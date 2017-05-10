import { LinkedInConfig } from './linkedin.config'

describe('When creating derived config using LinkedInConfig', () => {
    describe('and getAuthorize is not overwritten', ()=>{
        class LinkedInConfigMock extends LinkedInConfig {
            constructor(private _apiToken : string) {
                super();
            }

            public getApiToken() : string{
                return this._apiToken;
            }
        }


        it('should return false', () => {
            let config = new LinkedInConfigMock('');

            let authorizeValue = config.getAuthorize();

            expect(authorizeValue).toBeFalsy();
        });
    });
});