import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedConfig {

	public appVersion = "1.0";
	public testCount = 10;
}
