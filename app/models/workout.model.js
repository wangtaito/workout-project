import { Observable } from '@nativescript/core';
export class Workout extends Observable {
    constructor(data) {
        super();
        Object.assign(this, data);
    }
}
