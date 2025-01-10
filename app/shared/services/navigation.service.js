import { Frame } from '@nativescript/core';
import { ROUTES } from '../constants/routes';
export class NavigationService {
    static navigate(route) {
        Frame.topmost().navigate({
            moduleName: ROUTES[route]
        });
    }
}
