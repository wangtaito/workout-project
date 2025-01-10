import { Observable } from '@nativescript/core';

export class User extends Observable {
  id: string;
  email: string;
  displayName: string;
  
  constructor(id: string, email: string, displayName: string) {
    super();
    this.id = id;
    this.email = email;
    this.displayName = displayName;
  }
}