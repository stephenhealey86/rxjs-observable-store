;
// import { ObservableStore, SubscriptionsHandler } from '@stephenhealey86/rxjs-observable-store';
import { ObservableStore, SubscriptionsHandler } from './src';
class StoreService {
    constructor() {
        /*
        ObservableStore takes a type and a default state object of that type.
        It makes available two objects "state" & "state$", state$ has Observables for each property defined by the type passed to ObservableStore
        They will emit any time their equivalent property on “state” is set.
        */
        this.store = new ObservableStore({
            isAuthorised: false,
            blogs: [],
            timestamps: {
                lastDuration: null,
                lastVisit: null
            }
        });
        this.state = this.store.state;
        this.state$ = this.store.state$;
    }
    updateAuthorisation(isAuthorised) {
        // Update state & handle side effects
        this.state.isAuthorised = isAuthorised;
    }
    addBlogs(blog) {
        // Update state & handle side effects
        this.state.blogs = [...this.state.blogs, blog];
    }
    setLastVisit(lastVisit) {
        // Update state & handle side effects
        this.state.timestamps = Object.assign(Object.assign({}, this.state.timestamps), { lastVisit });
    }
    setLastDuration(lastDuration) {
        // Update state & handle side effects
        this.state.timestamps = Object.assign(Object.assign({}, this.state.timestamps), { lastDuration });
    }
    updateTimestamps(timestamps) {
        // Update state & handle side effects
        this.state.timestamps = timestamps;
    }
}
import { combineLatestWith, map } from 'rxjs/operators';
class AppComponent {
    constructor(store) {
        this.store = store;
        this.subsHandler = new SubscriptionsHandler();
    }
    // Component life cycle event
    initalise() {
        this.viewModel$ = this.store.state$.isAuthorised.pipe(combineLatestWith(this.store.state$.blogs.pipe(map(blogs => blogs[0]))), map(([isAuthorised, blog]) => ({ isAuthorised, blog })));
    }
    // Component life cycle event
    destory() {
        this.subsHandler.unsubscribe();
    }
}
