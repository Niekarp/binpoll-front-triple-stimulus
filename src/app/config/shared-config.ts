import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedConfig {

	public appVersion = "4.1";
	public testCount = 30;
}
