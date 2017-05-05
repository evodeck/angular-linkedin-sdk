import {
    Injectable,
    Inject,
    Optional
} from '@angular/core';
import {
    DomHelper
} from './dom.helper';
import {
    FluentApiCall
} from './fluent.api.call';
import {
    AsyncSubject,
    BehaviorSubject,
    Observable,
    Observer
} from 'rxjs';

@Injectable()
export class LinkedInService {
    /**
     * An observable that emits true and completes when library has finished loading.
     */
    public isInitialized$: Observable<boolean>;
    /**
     * An observable that has an initial value of undefined.
     * It emits a boolean value when the library has finished loading and when a login or logout is performed.
     */
    public isUserAuthenticated$: BehaviorSubject<boolean>;

    private _authorize: boolean;
    private _initializationStateSource: AsyncSubject<boolean>;
    private _sdkIN: any = undefined;

    public constructor(
        private _domHelper: DomHelper,
        @Inject('window') private _window: any,
        @Inject('apiKey') private _apiKey: string,
        @Inject('authorize') @Optional() authorize?: boolean,
        @Inject('isBrowser') @Optional() isBrowser?: boolean
    ) {
        this._authorize = authorize || false;
        if (isBrowser === undefined) {
            isBrowser = true;
        }
        this._initializationStateSource = new AsyncSubject<boolean>();
        this.isInitialized$ = this._initializationStateSource.asObservable();
        this.isUserAuthenticated$ = new BehaviorSubject(undefined);
        // Load Linkedin SDK once the service is provided
        this._domHelper.insertLinkedInScriptElement(
            () => this._onLibraryLoadedAndInitialized(),
            this._apiKey,
            this._authorize,
            isBrowser);
    }

    /**
     * Gets the IN variable from the LinkedIN SDK.
     */
    public getSdkIN(): any {
        return this._sdkIN;
    }

    /**
     * Log a member in. If the user is not logged in,
     * it will present the popup authorization window.
     */
    public login() {
        return this.isInitialized$
            .switchMap(() => {
                return Observable.create(
                    (observer: Observer<boolean>) => {
                        this._window.IN.User.authorize(() => {
                            observer.next(true);
                            observer.complete();
                        });
                    });
            });
    }

    /**
     * Log a member out. Logging the member out is defined as logging them out of
     * the LinkedIn network (i.e. clearing cookies). This does not revoke or
     * delete the user's authorization grant for your application.
     */
    public logout() {
        return this.isInitialized$
            .switchMap(() => {
                return Observable.create(
                    (observer: Observer<void>) => {
                        this._window.IN.User.logout(() => {
                            observer.next(undefined);
                            observer.complete();
                        });
                    });
            });
    }

    /**
     * Refreshes a member token for an additional 30 minutes.
     * Repeated continual use of the refresh() function to keep a member indefinitely
     * logged in can result in your application being disabled.  Use this call sparingly.
     */
    public refresh() {
        return this.isInitialized$
            .switchMap(() => {
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
        this._setEventsOn();
        this._sdkIN = this._window.IN;
    }

    private _setEventsOn() {
        this._window.IN.Event.on(
            this._window.IN,
            'auth',
            () => {
                this.isUserAuthenticated$.next(true);
            });
        this._window.IN.Event.on(
            this._window.IN,
            'logout',
            () => {
                this.isUserAuthenticated$.next(false);
            });
    }
}
