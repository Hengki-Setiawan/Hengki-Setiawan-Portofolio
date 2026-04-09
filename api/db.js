import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, args = [] } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Valid SQL query string is required' });
  }

  // Security Check: Block dangerous commands without Admin credentials
  const uppercaseQuery = query.trim().toUpperCase();
  const isReadonly = uppercaseQuery.startsWith('SELECT') && !uppercaseQuery.includes(';') && !uppercaseQuery.includes('DELETE') && !uppercaseQuery.includes('DROP');
  
  if (!isReadonly) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ error: 'Unauthorized: Write operations require authentication.' });
    }
    const token = authHeader.split(' ')[1];
    const validAdminPassword = (process.env.ADMIN_PASSWORD || 'admin12345').trim();
    if (token.trim() !== validAdminPassword) {
       // We'll keep it simple: token == ADMIN_PASSWORD
       return res.status(403).json({ error: 'Forbidden: Invalid Admin Token.' });
    }
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    return res.status(500).json({ error: 'Database connection configuration missing.' });
  }

  try {
    const client = createClient({ url, authToken });
    const result = await client.execute({ sql: query, args });
    
    // Format result to behave somewhat like Supabase (array of objects)
    const formattedData = result.rows.map((row) => {
      const obj = {};
      result.columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    return res.status(200).json({ data: formattedData, error: null });
  } catch (error) {
    console.error('Database execution error:', error);
    return res.status(500).json({ error: error.message || 'Database error occurred', data: null });
  }
}
