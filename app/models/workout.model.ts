import { Observable } from '@nativescript/core';

export class Workout extends Observable {
  id: string;
  userId: string;
  type: string;
  duration: number; // in minutes
  date: Date;
  notes: string;
  
  constructor(data: Partial<Workout>) {
    super();
    Object.assign(this, data);
  }
}