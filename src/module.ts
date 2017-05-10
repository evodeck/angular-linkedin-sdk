import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  DomHelper
} from './dom.helper';
import {
  LinkedInService
} from './linkedin.service';
import {
  ZoneHelper
} from './zone.helper';
import {
  getWindow, WINDOW
} from './window.helper';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  providers: [
    { provide: WINDOW, useFactory: getWindow },
    ZoneHelper,
    DomHelper,
    LinkedInService
  ],
  exports: [
  ]
})
export class LinkedInSdkModule {
}
