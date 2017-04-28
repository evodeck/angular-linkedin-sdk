import {
    Injectable,
    NgZone
} from '@angular/core';

@Injectable()
export class ZoneHelper {
    public constructor(
        private _zone: NgZone
    ) {
    }

    public runZoneIfNotAlready(callback: any) {
        if (NgZone.isInAngularZone()) {
            callback();
        } else {
            this._zone.run(() => {
                callback();
            });
        }
    }
}
