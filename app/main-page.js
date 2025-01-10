import { HelloWorldModel } from './main-view-model';
export function navigatingTo(args) {
    if (!args || !args.object) {
        console.error('Navigation failed: Invalid arguments');
        return;
    }
    const page = args.object;
    try {
        page.bindingContext = new HelloWorldModel();
    }
    catch (error) {
        console.error('Failed to set binding context:', error);
    }
}
