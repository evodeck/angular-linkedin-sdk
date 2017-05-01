import {
    Injectable,
    Inject,
    Optional
} from '@angular/core';
import {
    AsyncSubject,
    BehaviorSubject,
    Observable,
    Observer
} from 'rxjs';
import { DomHelper } from './dom.helper';
import { FluentApiCall } from './fluent.api.call';


@Injectable()
export class LinkedInService {
    public isInitialized$: Observable<boolean>;
    public isUserAuthenticated$: BehaviorSubject<boolean>;

    private _initializationStateSource: AsyncSubject<boolean>;

    private _authorize : boolean;

    public constructor(
        private _domHelper: DomHelper,
        @Inject('window') private _window: any,
        @Inject('apiKey') private _apiKey: string,
        @Inject('authorize') @Optional() authorize?: boolean
    ) {
        this._authorize = authorize || false;
        this._initializationStateSource = new AsyncSubject<boolean>();
        this.isInitialized$ = this._initializationStateSource.asObservable();
        this.isUserAuthenticated$ = new BehaviorSubject(undefined);

        // Load Linkedin SDK once the service is provided
        this._domHelper.insertLinkedInScriptElement(() => this._onLibraryLoadedAndInitialized(), this._apiKey, this._authorize);
    }

    public login() {
        return this.isInitialized$
            .switchMap(() => {
                return Observable.create(
                    (observer: Observer<boolean>) => {
                        this._window.IN.User.authorize(() => {
                            const isLoggedIn = this._getIsAuthorized();
                            observer.next(isLoggedIn);
                            this.isUserAuthenticated$.next(isLoggedIn);
                            observer.complete();
                        });
                    });
            });
    }

    public logout() {
        return this.isInitialized$
            .switchMap(() => {
                return Observable.create(
                    (observer: Observer<void>) => {
                        this._window.IN.User.logout(() => {
                            observer.next(undefined);
                            this.isUserAuthenticated$.next(this._getIsAuthorized());
                            observer.complete();
                        });
                    });
            });
    }

    public refresh() {
        return this.isInitialized$
            .switchMap(()=> {
                return Observable.create(
                    (observer: Observer<any>) => {
                        this._window.IN.User.refresh();
                        
                        observer.next(undefined);
                        observer.complete();
                        });
                    });
    }

    /**
     * Enables authenticated calls to the LinkedIn REST API using the generic call wrapper.
     * @param url The API URL to invoke: should not include https://api.linkedin.com/v1.
     */
    public raw(url: string): FluentApiCall {
        return new FluentApiCall(this.isInitialized$, this._window, url);
    }

    private _getIsAuthorized() {
        return this._window.IN.User.isAuthorized();
    }

    private _onLibraryLoadedAndInitialized() {
        this._initializationStateSource.next(true);
        this._initializationStateSource.complete();

        this.isUserAuthenticated$.next(this._getIsAuthorized());
    }
}
