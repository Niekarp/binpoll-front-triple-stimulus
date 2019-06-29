import { Injectable, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  // back & next mean navigation directions
  
  // iserted automatically on application start
  public router: Router;
  
  // options
  public active = false;
  public deactivateOnNext = false;
  
  // navigation condition (restarted after each navigation)
  public goBackCondition: () => boolean;
  public goNextCondition: () => boolean;
  
  // events
  public onGoNextConditionOK = () => {};
  public onGoNextConditionFail = () => {};
  
  public onGoBackConditionOK = () => {};
  public onGoBackConditionFail = () => {};
  
  constructor() { 
    fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => { this.onKeydown(event); });
  }

  public restart() {
    this.goBackCondition = () => { return false };
    this.goNextCondition = () => { return false };
    this.onGoNextConditionOK = () => { };
    this.onGoNextConditionFail = () => { };
    this.onGoBackConditionOK = () => { };
    this.onGoBackConditionFail = () => { };
    this.deactivateOnNext = false;
  }
  
  private onKeydown(event: KeyboardEvent): void {
    // console.log('navigation keydown');
    
    if (this.active === false) return;
    // console.log('navigationKeyboard active');
    
    let currentRouteIndex = this.router.config.findIndex((route: any) => {
      return this.router.url === '/' + route.path;
    });
    
    if (event.key === 'ArrowLeft')
    {
      if (this.goBackCondition())
      {
        this.onGoBackConditionOK();
        this.router.navigateByUrl(this.router.config[currentRouteIndex - 1].path, { skipLocationChange: true });
      }
      else
      {
        this.onGoBackConditionFail();
      }
      event.stopPropagation();
    }
    else if (event.key === 'ArrowRight')
    {
      if (this.goNextCondition())
      {
        this.onGoNextConditionOK();
        if (this.deactivateOnNext)
        {
          this.active = false;
        }
        this.router.navigateByUrl(this.router.config[currentRouteIndex + 1].path, { skipLocationChange: true });
      }
      else
      {
        this.onGoNextConditionFail();
      }
      event.stopPropagation();
    }
  }
}
