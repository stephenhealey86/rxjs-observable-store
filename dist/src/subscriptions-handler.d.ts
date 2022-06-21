import { Subscription } from 'rxjs';
export declare class SubscriptionsHandler {
    private subscriptions;
    set subs(value: Subscription);
    unsubscribe(): void;
}
