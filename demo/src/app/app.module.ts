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
    { provide: 'apiKey', useValue: '86b4pxhj2bvw8v' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
