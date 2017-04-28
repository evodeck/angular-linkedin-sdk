import {
    ZoneHelper
} from './zone.helper';
import {
    inject,
    TestBed
} from '@angular/core/testing';
import {
    NgZone
} from '@angular/core';

describe('ZoneHelper', () => {
  let subject: ZoneHelper;
  let zone: NgZone;

  beforeEach(() => {
      TestBed.configureTestingModule({
          providers: [ZoneHelper]
      });
  });

  beforeEach(inject([ZoneHelper, NgZone], (zoneHelper: ZoneHelper, ngZone: NgZone) => {
      subject = zoneHelper;
      zone = ngZone;
  }));

  describe('when calling runZoneIfNotAlready' , () => {
    let isCallbackCalled: boolean;
    let callback: any;

    beforeEach(() => {
      isCallbackCalled = false;
      // Create callback mock
      callback = function(){
        isCallbackCalled = true;
      };
      // Setup mock to be used
      spyOn(zone, 'run').and.callFake(callbackToCall => {
        callbackToCall();
      });
    });

    it('should call callback, if already in zone', () => {
      spyOn(NgZone, 'isInAngularZone').and.returnValue(true);
      subject.runZoneIfNotAlready(callback);
      expect(isCallbackCalled).toBeTruthy();
    });

    it('should call callback, if not in zone', () => {
      spyOn(NgZone, 'isInAngularZone').and.returnValue(false);
      subject.runZoneIfNotAlready(callback);
      expect(isCallbackCalled).toBeTruthy();
    });

    it('should not start new zone, if already in zone', () => {
      spyOn(NgZone, 'isInAngularZone').and.returnValue(true);
      subject.runZoneIfNotAlready(callback);
      expect(zone.run).not.toHaveBeenCalled();
    });

    it('should start new zone, if not in zone', () => {
      spyOn(NgZone, 'isInAngularZone').and.returnValue(false);
      subject.runZoneIfNotAlready(callback);
      expect(zone.run).toHaveBeenCalled();
    });
  });
});
