export type WorkoutType = '跑步' | '健身' | '游泳' | '瑜伽' | '其他';

export interface WorkoutRecord {
  id: string;
  date: Date;
  weight: number;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    avg: number;
  };
  notes: string;
  photoUrls: string[];
}

export interface WorkoutEvent {
  id: string;
  date: Date;
  type: WorkoutType;
  duration: number;
  notes: string;
  completed: boolean;
  record?: WorkoutRecord;
}