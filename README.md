# Observable Store

A light weight state management solution implemented using RxJS.

<a name="installation"/>

## Installation

Install with **NPM**

```bash
npm i @stephenhealey86/rxjs-observable-store
```

<a name="usage"/>

## Usage

### Overview
Observable Store has two classes, ObservableStore and SubscriptionsHandler. The SubscriptionsHandler provides a clean and easy way to keep track of subscriptions and handles unsubscribing. ObservableStore allows you to easily create state management objects from interfaces, that when their properties are set their equivalent observable property emits.

### Creating a store service

#### Interfaces representing our app state

```typescript
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
```

#### The store service class

```typescript
import { ObservableStore, SubscriptionsHandler } from '@stephenhealey86/rxjs-observable-store';

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
```
### Using our observable store

#### Our app component

```typescript
import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';

class AppComponent {

    private subsHandler: SubscriptionsHandler;
    private viewModel$: Observable<{
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
```
<a name="author"/>

## Author

**Stephen Healey**

- [github/stephenhealey86](https://github.com/stephenhealey86)
