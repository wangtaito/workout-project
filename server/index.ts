import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/videos', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../src/data/exerciseVideos.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const newVideo = req.body;
    data.videos.push(newVideo);
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    res.json(data);
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ message: 'Error saving video' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 