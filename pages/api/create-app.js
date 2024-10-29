export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const formData = new FormData();
      
      Object.entries(req.body).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (req.files) {
        Object.entries(req.files).forEach(([key, file]) => {
          formData.append(key, file);
        });
      }

      const response = await fetch('http://127.0.0.1:5000/api/create-app', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      return res.status(201).json(data);
    } catch (error) {
      console.error('请求错误:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}