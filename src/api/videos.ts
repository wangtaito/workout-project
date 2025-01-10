import { promises as fs } from 'fs';
import path from 'path';
import { ExerciseVideo } from '../types/workout';

export async function saveVideo(video: ExerciseVideo) {
  try {
    const filePath = path.join(process.cwd(), 'src/data/exerciseVideos.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    data.videos.push(video);
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving video to file:', error);
    throw error;
  }
} 