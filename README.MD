# angular-linkedin-api-wrapper

An Angular (Angular 2 & Angular 4) wrapper for LinkedIn official Javascript SDK. To know more about the official documentation please visit [here](https://developer.linkedin.com/docs/getting-started-js-sdk).

All features of the original Javascript SDK are available through the service `LinkedInService`. The `IN.Event.on(..)` and `IN.Event.onOnce(...)` handler registration methods aren't exposed from original API, because you should subscribe to the `isInitialized$` and `isUserAuthenticated$` observables instead.

> This library is published in an early state. The exposed interfaces might still be subject to change. Please don't expect a stable interface before version 0.2.x

## Demo

To try the out the demo project clone the repository and run
```bash
$ npm install
```

***Edit*** the demo/src/app/app.module.ts and paste you own LinkedIn API key

```typescript
{ provide: 'apiKey', useValue: 'YOUR_API_KEY' },
```

followed by
```bash
$ npm run-script demo
```

## Install

```bash
$ npm install angular-linkedin-api-wrapper
```

## ES2015 / UMD

If your project is based on Angular CLI / WebPack everything will work as expected.

> SystemJS / UMD support is not yet available, but planned for version 0.2.x

## Angualar Universal

Server side rendering is not supported, since the original LinkedIn Javascript SDK is using JSONP and can't run outside browser environments.

> we are working on browser-agnostic support for the library. As mentioned it's not up to us, to support server side rendering, but in future release we will avoid initialization on non-browser plattforms to make the library invisible. Currently we unfortunately must expect, that the library will cause crashes in ANgular Universal environments, because of DOCUMENT and window object usage. 

## Usage

In the Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the library
import { LinkedInSdkModule } from 'angular-linkedin-api-wrapper';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    LinkedInSdkModule
  ],
  providers: [
    // Inject apiKey and, optionally, authorize to integrate with LinkedIN official API
    { provide: 'apiKey', useValue: 'YOUR_API_KEY' },
    { provide: 'authorize', useValue: 'true/false' } // OPTIONAL by default: false
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### LinkedInService

```typescript
import {
    LinkedInService
} from 'angular-linkedin-api-wrapper';

export class AppComponent implements OnInit {
    public isUserAuthenticated;
    public constructor(private _linkedInService: LinkedInService) {
    }
}    
```

## API

* [isInitialized](#isInitialized)
* [isUserAuthenticated](#isUserAuthenticated)
* [login](#login)
* [logout](#logout)
* [raw](#rawapicall)

### isInitialized
An observable that emits true and completes when library has finished loading.

#### Example
```typescript
public subscribeToisInitialized(){
    this._linkedInService.isInitialized$.subscribe({
    next: (state) => {
      // state will always return true when API finishes loading
    },
    complete: () => {
      // Completed
    }
  });
}
```
### isUserAuthenticated
An observable that has an initial value of undefined. It emits a boolean value when the library has finished loading and when a login is performed.

#### Example
```typescript
ngOnInit() {
  // Subscribe to any values the observable will emit about logged in state
  this._linkedInService.isUserAuthenticated$.subscribe({
    next: (state) => {
      this.isUserAuthenticated = state;
    }
  });
}
```

### login
Returns an observable that emits true and completes when authenticated. Waits for the library to finish loading. isUserAuthenticated$ also emits an updated value.

#### Example
```typescript
public subscribeToLogin(){
  this._linkedInService.login().subscribe({
    next: (state) => {
      // state will always return true when login completed 
    },
    complete: () => {
      // Completed
    }
  });
}
```

### logout
Returns an observable that emits with no value and completes when logout is finished. Waits for the library to finish loading. isUserAuthenticated$ also emits an updated value.

#### Example
```typescript
public subscribeToLogout(){
  this._linkedInService.logout().subscribe({
    next: () => {
      // does not emit a value 
    },
    complete: () => {
      // Completed
    }
  });
}
```

### rawApiCall
Enables authenticated calls to the LinkedIn REST API using the generic call wrapper. The original fluent API is fully encapsulated.

#### Parameters

 * `url` The API URL to invoke: should not include `https://api.linkedin.com/v1`.

#### Example
```typescript
public rawApiCall(){
    const url = '/people/~?format=json';
    this._linkedInService.raw(url)
      .asObservable()
        .subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('RAW API call completed');
          }
        });
}
```
## Contribution

We are always looking for quality contributions and will be happy to accept your Pull Requests. For now, please make sure your PR has accompanying tests and all the tests are passing.

We will setup a CI system for the build very soon.

## License

MIT © [Evodeck Software](mailto:hello@evodeck.com)

[![Evodeck Software](https://ci3.googleusercontent.com/proxy/Eqggxj0X4HJQfdmVENMvZIkWeBriwSj0Tx60hc88cF4Y945yBEesVlGipqJdt9Klx_nfB0zZBu_it7bOsGi7BHVMcI39IROed1P6PZ_wo6o9_Ur3CKddxLnFXdiC7IHbELXKKqc1V8L_6j6F8KQS6-dvzbrRrxWCCUVn9SujcX19uNxUiNUebSLtYylRIg22wjVpZt2TT7v-8So=s0-d-e1-ft#https://docs.google.com/uc?export=download&id=0BxtZ4XgqKmltVFlJODZ3enc2dTg&revid=0BxtZ4XgqKmlta1hPL2UyOWsrUzVaVldoTDFFVmJsZUhQNWh3PQ)](https://www.evodeck.com)

