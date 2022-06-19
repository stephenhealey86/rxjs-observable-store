import { Subscription } from 'rxjs';

export class SubscriptionsHandler {
    private subscriptions = [] as Array<Subscription>;

    public set subs(value: Subscription) {
        this.subscriptions.push(value);
    }

    public unsubscribe(): void {
        this.subscriptions.forEach(sub => {
            if (!sub.closed) {
                sub.unsubscribe();
            }
        });
    }
}
