export class SubscriptionsHandler {
    constructor() {
        this.subscriptions = [];
    }
    set subs(value) {
        this.subscriptions.push(value);
    }
    unsubscribe() {
        this.subscriptions.forEach(sub => {
            if (!sub.closed) {
                sub.unsubscribe();
            }
        });
    }
}
