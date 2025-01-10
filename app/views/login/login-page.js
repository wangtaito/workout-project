import { LoginViewModel } from './login-view-model';
export function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new LoginViewModel();
}
