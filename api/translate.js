export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const DEEPL_API_KEY = process.env.VITE_DEEPL_API_KEY;

    if (!DEEPL_API_KEY) {
        return res.status(500).json({ error: 'DeepL API key not configured' });
    }

    try {
        const { text, target_lang } = req.body;

        if (!text || !target_lang) {
            return res.status(400).json({ error: 'Missing text or target_lang' });
        }

        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: Array.isArray(text) ? text.join('\n') : text,
                target_lang: target_lang,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('DeepL API error:', response.status, errorText);
            return res.status(response.status).json({ error: 'DeepL API error', details: errorText });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Translation proxy error:', error);
        return res.status(500).json({ error: 'Translation failed' });
    }
}
