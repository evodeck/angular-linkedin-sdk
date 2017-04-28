import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LinkedINApiModule } from '../../temp';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LinkedINApiModule
  ],
  providers: [
    { provide: 'apiKey', useValue: 'Your key' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
