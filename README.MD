# angular-linkedin-api-wrapper

An Angular wrapper for LinkedIN official API. To know more about the official documentation please visit [here](https://developer.linkedin.com/docs/getting-started-js-sdk).

# Demo

To try the out the demo project clone the repository and run
```bash
$ npm install
```

followed by
```bash
$ npm run-script demo
```
# Library

* [Install](#installation)
* [Consume](#consuming-the-library)
* [API](#api)

## Installation

To install this library, run:

```bash
$ npm install angular-linkedin-api-wrapper
```

## Consuming the library

In your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the library
import { LinkedINApiModule } from 'angular-linkedin-api-wrapper';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    LinkedINApiModule
  ],
  providers: [
    // Inject apiKey and, optionally, authorize to integrate with LinkedIN official API
    { provide: 'apiKey', useValue: 'Your API Key' },
    { provide: 'authorize', useValue: 'true/false' } // OPTIONAL by default: false
  ],
  bootstrap: [AppComponent]
})
export class YourModule { }
```

Once your library is imported, you can use it in your Angular application:

```typescript
import {
    LinkedInService
} from 'angular-linkedin-api-wrapper';

export class YourComponent implements OnInit {
    public isUserAuthenticated;
    public constructor(private _linkedInService: LinkedInService) {
    }
}    
```
## API

* [isInitialized](#isInitialized)
* [isUserAuthenticated](#isUserAuthenticated)
* [Login](#login)
* [Logout](#logout)
* [RAW API Call](#rawapicall)

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
Enables authenticated calls to the LinkedIn REST API using the generic call wrapper.

#### Parameters

 * `url` The API URL to invoke: should not include `https://api.linkedin.com/v1`.
 * `method` The HTTP method to use (GET, POST, PUT, or DELETE). If omitted, uses a default value of GET.
 * `bodyContent` For APIs with a POST body, POSTs and PUTs, this is the URL encoded post body. For GET requests this does nothing.

#### Example
```typescript
public subscribeToRawApiCall(){
    this._linkedInService.rawApiCall(url, method, bodyContent).subscribe({
    next: (data) => {
      // Emits the data returned from the LinkedIN API 
    },
    error: (err) => {
      // Emits the error returned from the LinkedIN API
    },
    complete: () => {
      // Completed
    }
  });    
}
```

## License

MIT © [Evodeck Software](mailto:hello@evodeck.com)

[![Evodeck Software](https://ci3.googleusercontent.com/proxy/Eqggxj0X4HJQfdmVENMvZIkWeBriwSj0Tx60hc88cF4Y945yBEesVlGipqJdt9Klx_nfB0zZBu_it7bOsGi7BHVMcI39IROed1P6PZ_wo6o9_Ur3CKddxLnFXdiC7IHbELXKKqc1V8L_6j6F8KQS6-dvzbrRrxWCCUVn9SujcX19uNxUiNUebSLtYylRIg22wjVpZt2TT7v-8So=s0-d-e1-ft#https://docs.google.com/uc?export=download&id=0BxtZ4XgqKmltVFlJODZ3enc2dTg&revid=0BxtZ4XgqKmlta1hPL2UyOWsrUzVaVldoTDFFVmJsZUhQNWh3PQ)](https://www.evodeck.com)

