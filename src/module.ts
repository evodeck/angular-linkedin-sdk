import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedInService } from './linkedinapi.service';
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
    LinkedInService
  ],
  exports: [
  ]
})
export class LinkedINApiModule {
}
