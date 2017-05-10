import { BrowserModule } from '@angular/platform-browser';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LinkedInSdkModule, LinkedInConfig, LINKEDIN_CONFIG } from '../../temp';

export class MyLinkedInConfig extends LinkedInConfig  {
  public getApiToken() : string{
    return 'YOUR_API_TOKEN';
  }

  public getAuthorize() : boolean{
    return true;
  }
}

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
    { provide: LINKEDIN_CONFIG, useClass: MyLinkedInConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
