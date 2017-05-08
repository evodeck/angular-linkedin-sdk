# angular-linkedin-sdk

An Angular (Angular 2 & Angular 4) wrapper for LinkedIn official Javascript SDK. To know more about the official documentation please visit [here](https://developer.linkedin.com/docs/getting-started-js-sdk).

All features of the original Javascript SDK are available through the service `LinkedInService`. The `IN.Event.on(..)` and `IN.Event.onOnce(...)` handler registration methods aren't exposed from original API, because you should subscribe to the `isInitialized$` and `isUserAuthenticated$` observables instead.

> This library is published in an early state. The exposed interfaces might still be subject to change. Please don't expect a stable interface before version 0.2.x

[![NPM](https://nodei.co/npm/angular-linkedin-sdk.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angular-linkedin-sdk/)
[![NPM](https://nodei.co/npm-dl/angular-linkedin-sdk.png?months=3&height=3)](https://nodei.co/npm/angular-linkedin-sdk/)

[![Build Status](https://travis-ci.org/evodeck/angular-linkedin-sdk.svg?branch=master)](https://travis-ci.org/evodeck/angular-linkedin-sdk)
[![codecov](https://codecov.io/gh/evodeck/angular-linkedin-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/evodeck/angular-linkedin-sdk)

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
$ npm install angular-linkedin-sdk
```

## ES2015 / UMD

If your project is based on Angular CLI / WebPack everything will work as expected.

> SystemJS / UMD support is not yet available, but planned for version 0.2.x

## Angular Universal

Server side rendering is not supported, since the original LinkedIn Javascript SDK is using JSONP and can't run outside browser environments.

> We are working on browser-agnostic support for the library. As mentioned it's not up to us to support server side rendering but in future release we will avoid initialization on non-browser platforms to make the library invisible. It might cause crashes in Angular Universal environments because of DOCUMENT and window object usage. You can specify whether to run in browser or server in the providers as seen in the Usage example.

## Usage

In the Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the library
import { LinkedInSdkModule } from 'angular-linkedin-sdk';

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
    { provide: 'authorize', useValue: 'true/false' }, // OPTIONAL by default: false
    { provide: 'isServer', useValue: 'true/false' }  // OPTIONAL by default: false
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### LinkedInService

```typescript
import {
    LinkedInService
} from 'angular-linkedin-sdk';

export class AppComponent implements OnInit {
    public isUserAuthenticated;
    public constructor(private _linkedInService: LinkedInService) {
    }
}    
```

## API

* [isInitialized](#isinitialized)
* [isUserAuthenticated](#isuserauthenticated)
* [getSdkIN](#getsdkin)
* [login](#login)
* [logout](#logout)
* [raw](#raw)
* [refresh](#refresh)

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
An observable that has an initial value of undefined. It emits a boolean value when the library has finished loading and when a login or logout is performed.

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

### getSdkIN
Gets the IN variable from the LinkedIN SDK. Allows access to variables from the SDK that are or are not documented officially.

#### Example
```typescript
public getApiKeyFromSdkIN() {
    // Retrieve the API key used in the library through the SDK IN variable
    this.apiKey = this._linkedInService.getSdkIN().ENV.auth.api_key;
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

### raw
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

### refresh
Refreshes a member token for an additional 30 minutes. Repeated continual use of the refresh() function to keep a member indefinitely logged in can result in your application being disabled.  Use this call sparingly.

#### Example
```typescript
public refresh() {
    this._linkedInService.refresh().subscribe({
      next: (value) => {
        console.log(`Refresh result: ${value}`);
      },
      complete: () => {
        console.log('Refresh call completed');
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

