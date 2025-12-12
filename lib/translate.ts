/**
 * DeepL Translation Service
 * Uses Vercel serverless function as proxy to avoid CORS
 */

// Cache translations in localStorage to avoid redundant API calls
const CACHE_KEY = 'deepl_translation_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
    translation: string;
    timestamp: number;
}

interface TranslationCache {
    [key: string]: CacheEntry;
}

function getCache(): TranslationCache {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch {
        return {};
    }
}

function setCache(cache: TranslationCache): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // Storage full, clear old entries
        localStorage.removeItem(CACHE_KEY);
    }
}

function getCacheKey(text: string, targetLang: string): string {
    return `${targetLang}:${text.substring(0, 100)}`;
}

export async function translateText(
    text: string,
    targetLang: 'ID' | 'EN'
): Promise<string> {
    if (!text || text.trim() === '') return text;

    // Check cache first
    const cacheKey = getCacheKey(text, targetLang);
    const cache = getCache();
    const cached = cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.translation;
    }

    try {
        // Call our serverless proxy instead of DeepL directly
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang,
            }),
        });

        if (!response.ok) {
            console.error('Translation proxy error:', response.status);
            return text;
        }

        const data = await response.json();
        const translation = data.translations?.[0]?.text || text;

        // Cache the translation
        cache[cacheKey] = {
            translation,
            timestamp: Date.now(),
        };
        setCache(cache);

        return translation;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

export async function translateBatch(
    texts: string[],
    targetLang: 'ID' | 'EN'
): Promise<string[]> {
    if (!texts.length) return [];

    // Check cache and find texts that need translation
    const cache = getCache();
    const results: string[] = new Array(texts.length);
    const toTranslate: { index: number; text: string }[] = [];

    texts.forEach((text, index) => {
        if (!text || text.trim() === '') {
            results[index] = text;
            return;
        }

        const cacheKey = getCacheKey(text, targetLang);
        const cached = cache[cacheKey];

        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
            results[index] = cached.translation;
        } else {
            toTranslate.push({ index, text });
        }
    });

    if (toTranslate.length === 0) return results;

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: toTranslate.map(({ text }) => text),
                target_lang: targetLang,
            }),
        });

        if (!response.ok) {
            toTranslate.forEach(({ index, text }) => {
                results[index] = text;
            });
            return results;
        }

        const data = await response.json();
        const translations = data.translations || [];

        toTranslate.forEach(({ index, text }, i) => {
            const translation = translations[i]?.text || text;
            results[index] = translation;

            const cacheKey = getCacheKey(text, targetLang);
            cache[cacheKey] = {
                translation,
                timestamp: Date.now(),
            };
        });

        setCache(cache);
        return results;
    } catch (error) {
        console.error('Batch translation error:', error);
        toTranslate.forEach(({ index, text }) => {
            results[index] = text;
        });
        return results;
    }
}

export function clearTranslationCache(): void {
    localStorage.removeItem(CACHE_KEY);
}
