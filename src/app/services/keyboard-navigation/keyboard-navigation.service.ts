import { Injectable, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  // Back & next mean navigation directions
  
  // Iserted automatically on application start
  public router: Router;
  
  // Options
  public active = false;
  public deactivateOnNext = false;
  
  // Navigation condition (restarted after each navigation)
  public activeCondition: () => boolean;
  public goBackCondition: () => boolean;
  public goNextCondition: () => boolean;
  
  // Events
  public onGoNextConditionOK = () => {};
  public onGoNextConditionFail = () => {};
  
  public onGoBackConditionOK = () => {};
  public onGoBackConditionFail = () => {};
  
  constructor() { 
    fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => { this.onKeydown(event); });
  }

  public restart(): void {
    this.activeCondition = () => { return true; };
    this.goBackCondition = () => { return false; };
    this.goNextCondition = () => { return false; };
    this.onGoNextConditionOK = () => { };
    this.onGoNextConditionFail = () => { };
    this.onGoBackConditionOK = () => { };
    this.onGoBackConditionFail = () => { };
    this.deactivateOnNext = false;
  }
  
  private onKeydown(event: KeyboardEvent): void {
    // console.log('navigation keydown');
    
    if (this.active === false || this.activeCondition() === false) return;
    // console.log('navigationKeyboard active');
    
    let currentRouteIndex = this.router.config.findIndex((route: any) => {
      return this.router.url === '/' + route.path;
    });
    
    if (event.key === 'ArrowLeft') {
      if (this.goBackCondition()) {
        this.onGoBackConditionOK();
        this.router.navigateByUrl(this.router.config[currentRouteIndex - 1].path, { skipLocationChange: true });
      } else {
        this.onGoBackConditionFail();
      }
      event.stopPropagation();
    } else if (event.key === 'ArrowRight') {
      if (this.goNextCondition()) {
        this.onGoNextConditionOK();
        if (this.deactivateOnNext) {
          this.active = false;
        }
        this.router.navigateByUrl(this.router.config[currentRouteIndex + 1].path, { skipLocationChange: true });
      } else {
        this.onGoNextConditionFail();
      }
      event.stopPropagation();
    }
  }
}
