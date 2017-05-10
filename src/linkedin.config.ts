import { OpaqueToken } from '@angular/core';

export let LINKEDIN_CONFIG = new OpaqueToken('linkedin.config');

export abstract class LinkedInConfig {
    public abstract getApiToken() : string;

    public getAuthorize() : boolean {
        return false;
    }
}