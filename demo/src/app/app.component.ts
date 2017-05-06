import {
  Component,
  OnInit
} from '@angular/core';
import {
  LinkedInService
} from '../../temp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isUserAuthenticatedEmittedValue = false;
  public isInitializedEmittedValue = false;
  public isUserAuthenticated;
  public isInitialized;
  public lastResponse;
  public apiKey;
  public anonymousToken;

  private basicProfileFields = ['id', 'first-name', 'last-name', 'maiden-name', 'formatted-name', 'phonetic-first-name', 'phonetic-last-name', 'formatted-phonetic-name', 'headline', 'location', 'industry', 'picture-url', 'positions'];

  public constructor(private _linkedInService: LinkedInService) {
  }

  ngOnInit() {
    this.isUserAuthenticated = this._linkedInService.isUserAuthenticated$;
    this.isInitialized = this._linkedInService.isInitialized$;

    this._linkedInService.isUserAuthenticated$.subscribe({
      next: (state) => {
        this.isUserAuthenticatedEmittedValue = true;
      }
    });

    this._linkedInService.isInitialized$.subscribe({
      next: (state) => {
        this.isInitializedEmittedValue = true;
      }
    });
  }

  public login() {
    this._linkedInService.login().subscribe({
      next: (state) => {
        console.log(`Login result: ${state}`);
      }
    });
  }

  public refresh() {
    this._linkedInService.refresh().subscribe({
      next: (value) => {
        console.log(`Refresh result: ${value}`);
      }
    });
  }

  public logout() {
    this._linkedInService.logout().subscribe({
      next: () => {
        console.log('Logout emitted.');
      },
      complete: () => {
        console.log('Logout completed.');
      }
    });
  }

  public rawApiCall() {
    let url =`/people/~:(${this.basicProfileFields.join(',')})?format=json'`;
    this._linkedInService.raw(url)
      .asObservable()
      .subscribe({
        next: (data) => {
          this.lastResponse = data;
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

  public getApiKeyFromSdkIN() {
    this.apiKey = this._linkedInService.getSdkIN().ENV.auth.api_key;
  }

  public getAnonymousTokenFromSdkIN() {
    this.anonymousToken = this._linkedInService.getSdkIN().ENV.auth.anonymous_token;
  }
}
