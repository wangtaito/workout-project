import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

export function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  
  return (
    <div
      role="tabpanel"
      className="p-4 animate-fadeIn"
    >
      {children}
    </div>
  );
}