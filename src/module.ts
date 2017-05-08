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
  getWindow
} from './window.helper';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  providers: [
    { provide: 'window', useFactory: getWindow },
    ZoneHelper,
    DomHelper,
    LinkedInService
  ],
  exports: [
  ]
})
export class LinkedInSdkModule {
}
