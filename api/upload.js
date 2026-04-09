import { v2 as cloudinary } from 'cloudinary';
// If busboy or formidable was available we could parse multipart/form-data.
// For Vibe Coding speed on Vercel, it is much easier to just accept base64 JSON payload.

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Authenticate Request
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized Upload.' });
  }

  // Parse Body (Expecting JSON {"image": "data:image/png;base64,....."})
  try {
      const { image, path } = req.body;
      if (!image) return res.status(400).json({ error: 'No image provided' });

      // Upload to Cloudinary using base64 string
      const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'hengki_portfolio',
          public_id: path?.replace(/\.[^/.]+$/, "") // remove extension 
      });

      return res.status(200).json({ url: uploadResult.secure_url });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
  }
}
