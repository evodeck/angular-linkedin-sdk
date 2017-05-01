import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedInService } from './linkedin.service';
import { DomHelper } from './dom.helper';
import { ZoneHelper } from './zone.helper';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  providers: [
    { provide: 'window', useValue: window },
    ZoneHelper,
    DomHelper,
    LinkedInService
  ],
  exports: [
  ]
})
export class LinkedInSdkModule {
}
