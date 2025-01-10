import { EventData, Page } from '@nativescript/core';
import { HelloWorldModel } from './main-view-model';

export function navigatingTo(args: EventData) {
  if (!args || !args.object) {
    console.error('Navigation failed: Invalid arguments');
    return;
  }

  const page = <Page>args.object;
  
  try {
    page.bindingContext = new HelloWorldModel();
  } catch (error) {
    console.error('Failed to set binding context:', error);
  }
}
