import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

// Recaptcha errors temporary fix
import { RecaptchaComponent } from 'ng-recaptcha';
RecaptchaComponent.prototype.ngOnDestroy = function() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
