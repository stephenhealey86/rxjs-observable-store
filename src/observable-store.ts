import { BehaviorSubject, Observable } from 'rxjs';

export class ObservableStore<T extends { [key: string]: any }> {

    private storeSubject = {} as { [ key in keyof T]: BehaviorSubject<T[key]> };
    public state = {} as { [ key in keyof T]: T[key] };

    constructor(initialState: T) {
        Object.keys(initialState).forEach(key => {
            // Initialise storeSubject
            Object.defineProperty(this.storeSubject, key, {
                value: new BehaviorSubject<any>(initialState[key]),
                writable: false,
                enumerable: true
            });

            // Add getters and setters to public store
            Object.defineProperty(this.state, key, {
                get: function(this: any): any { return this.storeSubject[key].value; }.bind(this),
                set: function(this: any, val: any): void {
                    this.storeSubject[key].next(val);
                }.bind(this),
                enumerable: true
            });
        });
    }

    public get state$(): { [key in keyof T]: Observable<T[key]> } {
        return Object.entries(this.storeSubject).reduce((acc: { [key: string]: Observable<any> }, [key, val]: [string, BehaviorSubject<any> ]) => {
            acc[key] = val.asObservable();
            return acc;
        }, {}) as { [ key in keyof T]: Observable<T[key]> };
    }

    public complete(): void {
        Object.values(this.storeSubject).forEach((val: BehaviorSubject<any>) => { val.complete(); });
    }
}
