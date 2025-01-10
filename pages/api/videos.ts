import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'src/data/exerciseVideos.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // 添加新視頻
    const newVideo = req.body;
    data.videos.push(newVideo);
    
    // 保存更新後的數據
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ message: 'Error saving video' });
  }
} 