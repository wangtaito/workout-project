import { Observable } from '@nativescript/core';
import { isValidEmail, isValidPassword } from '../../shared/utils/validation';
import { NavigationService } from '../../shared/services/navigation.service';
export class LoginViewModel extends Observable {
    constructor() {
        super();
        this.email = '';
        this.password = '';
        this.errorMessage = '';
    }
    onLogin() {
        if (!this.email || !this.password) {
            this.set('errorMessage', 'Please enter both email and password');
            return;
        }
        if (!isValidEmail(this.email)) {
            this.set('errorMessage', 'Please enter a valid email address');
            return;
        }
        if (!isValidPassword(this.password)) {
            this.set('errorMessage', 'Password must be at least 6 characters long');
            return;
        }
        // Mock login success
        console.log('Login attempted with:', { email: this.email });
        this.set('errorMessage', '');
        NavigationService.navigate('DASHBOARD');
    }
    onRegister() {
        NavigationService.navigate('REGISTER');
    }
}
