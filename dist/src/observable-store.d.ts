import { Observable } from 'rxjs';
export declare class ObservableStore<T extends {
    [key: string]: any;
}> {
    private storeSubject;
    state: { [key in keyof T]: T[key]; };
    constructor(initialState: T);
    get state$(): {
        [key in keyof T]: Observable<T[key]>;
    };
    get combinedState$(): Observable<T>;
    complete(): void;
}
