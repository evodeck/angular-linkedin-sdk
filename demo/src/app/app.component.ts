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
  public isLoggedIn;
  public constructor(private _linkedInService: LinkedInService) {
  }

  ngOnInit() {
    this._linkedInService.isLoggedIn$.subscribe({
      next: (state) => {
        this.isLoggedIn = state;
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

  public logIsLogged() {
    console.log(`Is logged: ${this.isLoggedIn}`);
  }
}
