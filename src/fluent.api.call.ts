import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

export class FluentApiCall {
    private _fluentCallbackStack: any[] = new Array();

    public constructor(private isLoadedObservable: Observable<boolean>,
        private _window: any,
        url: string
    ) {
        this._fluentCallbackStack.push((raw: any) => raw.IN.API.Raw(url));
    }

    public url(url: string): FluentApiCall {
        this._fluentCallbackStack.push((raw: any) => raw.url(url));
        return this;
    }

    public method(method: string): FluentApiCall {
        this._fluentCallbackStack.push((raw: any) => raw.method(method));
        return this;
    }

    public body(body: string): FluentApiCall {
        this._fluentCallbackStack.push((raw: any) => raw.body(body));
        return this;
    }

    public asObservable(): Observable<Object> {
        return this.isLoadedObservable.pipe(
            switchMap(() => {
                return Observable.create(
                    (observer: Observer<Object>) => {
                        this.executeFluentCallbackStack()
                            .result((data: Object) => {
                                observer.next(data);
                                observer.complete();
                            })
                            .error((error: Object) => {
                                observer.error(error);
                            });
                    });
            })
        );
    }

    private executeFluentCallbackStack(): any {
        let currentInstance = this._window;

        this._fluentCallbackStack.forEach((callback) => {
            currentInstance = callback(currentInstance);
        });

        return currentInstance;
    }
}
