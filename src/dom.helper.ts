import {
    Injectable,
    Inject
} from '@angular/core';
import {
    DOCUMENT
} from '@angular/platform-browser';
import {
    ZoneHelper
} from './zone.helper';

@Injectable()
export class DomHelper {
    public constructor(
        private _zoneHelper: ZoneHelper,
        @Inject(DOCUMENT) private _document: any,
        @Inject('window') private _window: any
    ) {
    }

    public insertLinkedInScriptElement(initializationCallback: () => void, apiKey: string, authorize?: boolean, isServer?: boolean) {
        if (isServer !== true) {
            this._initializeLibrary(initializationCallback);
            this._writeToDOM(apiKey, authorize);
        }
    }

    private _initializeLibrary(initializationCallback: () => void) {
        this._window['linkedInStateChangeRef'] = () => {
            this._zoneHelper.runZoneIfNotAlready(() => {
                if (initializationCallback) {
                    initializationCallback();
                }
            });
        };
    }

    private _writeToDOM(apiKey: string, authorize: boolean) {
        let linkedInScriptElement = this._document.createElement('script');
        linkedInScriptElement.type = 'text/javascript';
        const linkedInAPISrc = '//platform.linkedin.com/in.js';
        linkedInScriptElement.src = linkedInAPISrc;
        const linkedInAPIKey = `\napi_key: ${apiKey}`;
        const linkedInAPIOnLoad = `\nonLoad: window.linkedInStateChangeRef`;
        const linkedInAPIAuthorize = `\nauthorize: ${authorize}\n`;
        const linkedInAPICfg = linkedInAPIKey + linkedInAPIOnLoad + linkedInAPIAuthorize;
        linkedInScriptElement.innerHTML = linkedInAPICfg;
        this._document.head.appendChild(linkedInScriptElement);
    }
}
