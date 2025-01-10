import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkoutEvent, WorkoutRecord } from '../types/workout';

interface WorkoutContextType {
  events: WorkoutEvent[];
  addEvent: (event: WorkoutEvent) => void;
  toggleCompletion: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
  addWorkoutRecord: (eventId: string, record: Omit<WorkoutRecord, 'id' | 'date'>) => void;
  getWorkoutRecord: (eventId: string) => WorkoutRecord | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<WorkoutEvent[]>(() => {
    const savedEvents = localStorage.getItem('workoutEvents');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        return parsed.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          record: event.record ? {
            ...event.record,
            date: new Date(event.record.date)
          } : undefined
        }));
      } catch (e) {
        console.error('Error parsing saved events:', e);
        return [];
      }
    }
    return [];
  });

  const saveEvents = (newEvents: WorkoutEvent[]) => {
    try {
      localStorage.setItem('workoutEvents', JSON.stringify(newEvents));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  };

  const addEvent = (event: WorkoutEvent) => {
    setEvents(prevEvents => {
      const newEvents = [...prevEvents, event];
      saveEvents(newEvents);
      return newEvents;
    });
  };

  const toggleCompletion = (eventId: string) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      );
      saveEvents(newEvents);
      return newEvents;
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.filter(event => event.id !== eventId);
      saveEvents(newEvents);
      return newEvents;
    });
  };

  const addWorkoutRecord = (eventId: string, record: Omit<WorkoutRecord, 'id' | 'date'>) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const newRecord = {
            ...record,
            id: Date.now().toString(),
            date: new Date(),
          };
          return {
            ...event,
            record: newRecord
          };
        }
        return event;
      });
      saveEvents(newEvents);
      return newEvents;
    });
  };

  const getWorkoutRecord = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.record;
  };

  return (
    <WorkoutContext.Provider value={{ 
      events, 
      addEvent, 
      toggleCompletion, 
      deleteEvent,
      addWorkoutRecord,
      getWorkoutRecord
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
} 