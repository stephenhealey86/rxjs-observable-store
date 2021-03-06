interface Blog {
    title: string;
    content: string;
    date: Date;
}

interface Timestamps {
    lastVisit: Date | null;
    lastDuration: number | null;
};

interface AppState {
    isAuthorised: boolean;
    blogs: Array<Blog>;
    timestamps: Timestamps;
}

// import { ObservableStore, SubscriptionsHandler } from '@stephenhealey86/rxjs-observable-store';
import { ObservableStore, SubscriptionsHandler } from './src';

class StoreService {
    /*
    ObservableStore takes a type and a default state object of that type. 
    It makes available two objects "state" & "state$", state$ has Observables for each property defined by the type passed to ObservableStore
    They will emit any time their equivalent property on “state” is set.
    */
    private store = new ObservableStore<AppState>({
        isAuthorised: false,
        blogs: [],
        timestamps: {
            lastDuration: null,
            lastVisit: null
        }
    });

    private state = this.store.state;
    public state$ = this.store.state$;

    public updateAuthorisation(isAuthorised: boolean): void {
        // Update state & handle side effects
        this.state.isAuthorised = isAuthorised;
    }

    public addBlogs(blog: Blog): void {
        // Update state & handle side effects
        this.state.blogs = [ ...this.state.blogs, blog ];
    }

    public setLastVisit(lastVisit: Date): void {
        // Update state & handle side effects
        this.state.timestamps = { ...this.state.timestamps, lastVisit };
    }

    public setLastDuration(lastDuration: number): void {
        // Update state & handle side effects
        this.state.timestamps = { ...this.state.timestamps, lastDuration };
    }

    public updateTimestamps(timestamps: Timestamps): void {
        // Update state & handle side effects
        this.state.timestamps = timestamps;
    }
}

import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';

class AppComponent {

    private subsHandler: SubscriptionsHandler;
    private viewModel$!: Observable<{
        isAuthorised: boolean;
        blog: Blog;
    }>;

    constructor(private store: StoreService) {
        this.subsHandler = new SubscriptionsHandler();
    }


    // Component life cycle event
    public initalise(): void {
        this.viewModel$ = this.store.state$.isAuthorised.pipe(
            combineLatestWith(this.store.state$.blogs.pipe(map(blogs => blogs[0]))),
            map(([isAuthorised, blog]) => ({ isAuthorised, blog }))
        )
    }

    // Component life cycle event
    public destory(): void {
        this.subsHandler.unsubscribe();
    }
}
