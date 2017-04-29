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
import { ZoneHelper } from './zone.helper';
import { FluentApiCall } from './fluent.api.call';

@Injectable()
export class LinkedInService {
    public isInitialized$: Observable<boolean>;
    public isUserAuthenticated$: BehaviorSubject<boolean>;

    private _initializationStateSource: AsyncSubject<boolean>;

    public constructor(
        private _zoneHelper: ZoneHelper,
        @Inject('apiKey') private _apiKey: string,
        @Inject('window') private _window: any,
        @Inject('authorize') @Optional() private _authorize?: boolean
    ) {
        this._window = _window;
        this._authorize = _authorize || false;
        this._initializationStateSource = new AsyncSubject<boolean>();
        this.isInitialized$ = this._initializationStateSource.asObservable();
        this.isUserAuthenticated$ = new BehaviorSubject(undefined);
        this._setDOM();
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
                        this._window.IN.User.refresh((value : any) => {
                            observer.next(value);
                            observer.complete();
                        });
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

    private _setDOM() {
        this._window['linkedInStateChangeRef'] = () => {
            this._updateInitializationState();
        };
        let linkedInAPI = document.createElement('script');
        linkedInAPI.type = 'text/javascript';
        const linkedInAPISrc = '//platform.linkedin.com/in.js';
        linkedInAPI.src = linkedInAPISrc;
        const linkedInAPIKey = `\napi_key: ${this._apiKey}`;
        const linkedInAPIOnLoad = `\nonLoad: window.linkedInStateChangeRef`;
        const linkedInAPIAuthorize = `\nauthorize: ${this._authorize}\n`;
        const linkedInAPICfg = linkedInAPIKey + linkedInAPIOnLoad + linkedInAPIAuthorize;
        linkedInAPI.innerHTML = linkedInAPICfg;
        document.head.appendChild(linkedInAPI);
    }

    private _setInitializationStateSource() {
        this._initializationStateSource.next(true);
        this._initializationStateSource.complete();
    }

    private _updateInitializationState() {
        this._zoneHelper.runZoneIfNotAlready(() => {
            this._setInitializationStateSource();
            this.isUserAuthenticated$.next(this._getIsAuthorized());
        });
    }
}
