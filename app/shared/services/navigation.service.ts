import { Frame } from '@nativescript/core';
import { ROUTES } from '../constants/routes';

export class NavigationService {
  static navigate(route: keyof typeof ROUTES) {
    Frame.topmost().navigate({
      moduleName: ROUTES[route]
    });
  }
}