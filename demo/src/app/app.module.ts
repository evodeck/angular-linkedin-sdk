import { BrowserModule } from '@angular/platform-browser';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LinkedInSdkModule } from '../../temp';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PrettyJsonModule,
    LinkedInSdkModule
  ],
  providers: [
    { provide: 'apiKey', useValue: '77e6o5uw11lpyk' },
    { provide: 'authorize', useValue: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
