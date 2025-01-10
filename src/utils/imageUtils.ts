export async function saveImage(file: File): Promise<string> {
  try {
    // 生成唯一的文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomString}-${file.name}`;
    const filePath = `/person-images/${fileName}`;

    // 創建一個 FormData 對象
    const formData = new FormData();
    formData.append('image', file);
    formData.append('path', filePath);

    // 這裡應該調用後端 API 來保存文件
    // 暫時將文件保存到 public 目錄
    // 實際項目中，這裡應該是一個 API 調用
    const publicPath = filePath;

    return publicPath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

export function getImageUrl(path: string): string {
  return path.startsWith('http') ? path : `${window.location.origin}${path}`;
} 