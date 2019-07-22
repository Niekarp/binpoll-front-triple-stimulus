import { Injectable } from '@angular/core';
import { version } from '../../../package.json';

@Injectable({ providedIn: 'root' })
export class SharedConfig {
	public appVersion = version;
	public testCount = 10;
}
