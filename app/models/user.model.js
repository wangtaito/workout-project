import { Observable } from '@nativescript/core';
export class User extends Observable {
    constructor(id, email, displayName) {
        super();
        this.id = id;
        this.email = email;
        this.displayName = displayName;
    }
}
