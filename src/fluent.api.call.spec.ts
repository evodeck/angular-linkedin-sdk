import { FluentApiCall } from './fluent.api.call';

import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';

import {
    fakeAsync
} from '@angular/core/testing';

class StubApi {
    public Raw(url: any) {
        return this;
    }
    public url(method: any) {
        return this;
    }
    public method(method: any) {
        return this;
    }
    public body(bodyContent: any) {
        return this;
    }
    public result(callback: any) {
        return this;
    }
    public error(callback: any) {
        return this;
    }
}

class INStub {
    constructor(public API : StubApi){

    }
}

class WindowStub {
    constructor(public IN : INStub){

    }
}


describe('FluentApiCall', () => {
    let isLoadedObservableSubject : AsyncSubject<boolean>;
    let isLoadedObservable : Observable<boolean>;
    let initialUrl : string;
    let rawApi : StubApi;
    let window : WindowStub;
    let subject : FluentApiCall;

    beforeEach(()=>{
        isLoadedObservableSubject = new AsyncSubject<boolean>();
        isLoadedObservable = isLoadedObservableSubject.asObservable();
        rawApi = new StubApi();
        window = new WindowStub(new INStub(rawApi));
        initialUrl = 'iniUrl://iniUrl';
        subject = new FluentApiCall(isLoadedObservable, window, initialUrl);
    });

    describe('when url() is called', () => {
        it('should return itself',() => {
            let url = 'myurl://myurl';
            let result = subject.url(url);
            expect(result).toBe(subject);
        });
    });

    describe('when mehtod() is called', () => {
        it('should return itself',() => {
            let method = 'GET';
            let result = subject.method(method);
            expect(result).toBe(subject);
        });
    });

    describe('when body() is called', () => {
        it('should return itself',() => {
            let body = 'some body content';
            let result = subject.body(body);
            expect(result).toBe(subject);
        });
    });

    describe('when asObservable() is called and subscribed', () => {
        let rawApiResultSpy : jasmine.Spy;
        let rawApiErrorSpy : jasmine.Spy;

        beforeEach(()=>{
            rawApiResultSpy = spyOn(rawApi, 'result').and.callThrough();
            rawApiErrorSpy = spyOn(rawApi, 'error').and.callThrough();
        });

        it('should not call result on raw api unless library is loaded', fakeAsync(() => {
            subject.asObservable().subscribe();
            expect(rawApiResultSpy).not.toHaveBeenCalled();
        }));

        it('should not call error on raw api unless library is loaded', fakeAsync(() => {
            subject.asObservable().subscribe();
            expect(rawApiErrorSpy).not.toHaveBeenCalled();
        }));

        it('should not call Raw on raw api unless library is loaded', () => {
            let rawApiSpy = spyOn(rawApi, 'Raw').and.callThrough();
            subject.asObservable().subscribe();
            expect(rawApiSpy).not.toHaveBeenCalled();
        });

        it('should not call raw api url() with param when calling url unless library is loaded',() => {
            let url = 'myurl://myurl';
            let rawApiUrlSpy = spyOn(rawApi, 'url').and.callThrough();
            subject.url(url).asObservable().subscribe();
            expect(rawApiUrlSpy).not.toHaveBeenCalledWith(url);
        });
        
        it('should not call raw api mehtod() with param when calling method unless library is loaded',() => {
            let method = 'GET';
            let rawApiMethodSpy = spyOn(rawApi, 'method').and.callThrough();
            subject.method(method).asObservable().subscribe();
            expect(rawApiMethodSpy).not.toHaveBeenCalledWith(method);
        });

        it('should not call raw api body() with param when calling body unless library is loaded',() => {
            let body = 'some body content';
            let rawApiBodySpy = spyOn(rawApi, 'body').and.callThrough();
            subject.body(body).asObservable().subscribe();
            expect(rawApiBodySpy).not.toHaveBeenCalledWith(body);
        });

        describe('and library is loaded', () => {
            beforeEach(()=>{
                isLoadedObservableSubject.next(true);
                isLoadedObservableSubject.complete();
            });

            it('should not call Raw on raw api unless library is loaded', () => {
                let rawApiSpy = spyOn(rawApi, 'Raw').and.callThrough();
                subject.asObservable().subscribe();
                expect(rawApiSpy).toHaveBeenCalledWith(initialUrl);
            });

            it('should call result on raw api', fakeAsync(() => {
                subject.asObservable().subscribe();
                expect(rawApiResultSpy).toHaveBeenCalled();
            }));

            it('should call error on raw api', fakeAsync(() => {
                subject.asObservable().subscribe();
                expect(rawApiErrorSpy).toHaveBeenCalled();
            }));

            it('should call raw api url() with param when calling url',() => {
                let url = 'myurl://myurl';
                let rawApiUrlSpy = spyOn(rawApi, 'url').and.callThrough();
                subject.url(url).asObservable().subscribe();
                expect(rawApiUrlSpy).toHaveBeenCalledWith(url);
            });
            
            it('should call raw api mehtod() with param when calling method',() => {
                let method = 'GET';
                let rawApiMethodSpy = spyOn(rawApi, 'method').and.callThrough();
                subject.method(method).asObservable().subscribe();
                expect(rawApiMethodSpy).toHaveBeenCalledWith(method);
            });

            it('should call raw api body() with param when calling body',() => {
                let body = 'some body content';
                let rawApiBodySpy = spyOn(rawApi, 'body').and.callThrough();
                subject.body(body).asObservable().subscribe();
                expect(rawApiBodySpy).toHaveBeenCalledWith(body);
            });

            it('should complete returned observable if api calls result callback', fakeAsync(()=>{
                let called = false;
                rawApiResultSpy.and.callFake((callback: any) => {callback(); });
                subject.asObservable().subscribe(()=>{}, ()=>{}, () => called = true);

                expect(called).toBeTruthy();
            }));

            it('should not emit error to subscriber if api calls just result callback', fakeAsync(()=>{
                let called = false;
                rawApiResultSpy.and.callFake((callback: any) => {callback(); });
                subject.asObservable().subscribe(()=>{}, () => called = true);

                expect(called).toBeFalsy();
            }));

            it('should not emit result to subscriber if api calls just error callback', fakeAsync(()=>{
                let called = false;
                rawApiErrorSpy.and.callFake((callback: any) => {callback(); });
                subject.asObservable().subscribe(() => called = true, ()=>{});

                expect(called).toBeFalsy();
            }));

            it('should emit dataObject to subscriber if api calls result callback', fakeAsync(()=>{
                let dataObject = {};
                rawApiResultSpy.and.callFake((callback: any) => {callback(dataObject); });
                let called = false;
                subject.asObservable().subscribe((data)=>{
                    expect(data).toBe(dataObject);
                    called = true;
                });

                expect(called).toBeTruthy();
            }));

            it('should emit error to subscriber if api calls error callback', fakeAsync(()=>{
                let error = {};
                rawApiErrorSpy.and.callFake((callback: any) => {callback(error); });
                let called = false;
                subject.asObservable().subscribe(()=>{}, (data)=>{
                    expect(data).toBe(error);
                    called = true;
                });

                expect(called).toBeTruthy();
            }));
        });        
    });
});
