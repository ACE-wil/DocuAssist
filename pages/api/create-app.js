export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 直接转发 FormData
      const response = await fetch('http://127.0.0.1:5000/api/create-app', {
        method: 'POST',
        body: req.body
      });

      if (response.ok) {
        const data = await response.json();
        res.status(201).json(data);
      } else {
        res.status(response.status).json({ message: 'Failed to create application' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}