import {
    LinkedInSdkModule
} from './module';

describe('LinkedInSdkModule', () => {
    it('module should be defined', ()=>{
        expect(LinkedInSdkModule).toBeDefined();
    });

    it('instance of module can be created', ()=>{
        let module = new LinkedInSdkModule();
        expect(module).toBeDefined;
    });
});