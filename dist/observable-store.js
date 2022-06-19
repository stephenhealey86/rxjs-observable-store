import { BehaviorSubject } from 'rxjs';
export class ObservableStore {
    constructor(initialState) {
        this.storeSubject = {};
        this.state = {};
        Object.keys(initialState).forEach(key => {
            // Initialise storeSubject
            Object.defineProperty(this.storeSubject, key, {
                value: new BehaviorSubject(initialState[key]),
                writable: false,
                enumerable: true
            });
            // Add getters and setters to public store
            Object.defineProperty(this.state, key, {
                get: function () { return this.storeSubject[key].value; }.bind(this),
                set: function (val) {
                    this.storeSubject[key].next(val);
                }.bind(this),
                enumerable: true
            });
        });
    }
    get state$() {
        return Object.entries(this.storeSubject).reduce((acc, [key, val]) => {
            acc[key] = val.asObservable();
            return acc;
        }, {});
    }
    complete() {
        Object.values(this.storeSubject).forEach((val) => { val.complete(); });
    }
}
