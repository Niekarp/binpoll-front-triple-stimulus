import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { KeyCallbackSet } from '../../models/key-callback-set.model';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  // Back & next mean navigation directions

  // Iserted automatically on application start
  public router: Router;

  // Options
  public active = false;

  // Navigation condition (restarted after each navigation)
  public activeCondition = () => true;
  public goBackCondition = () => false;
  public goNextCondition = () => false;

  // Events
  public onGoNextConditionOK = () => {};
  public onGoNextConditionFail = () => {};

  public onGoBackConditionOK = () => {};
  public onGoBackConditionFail = () => {};

  // Key callback sets
  private readonly ARROW_LEFT_CALLBACK_SET: KeyCallbackSet = {
    goCondition: (): boolean => this.goBackCondition(),
    onGoConditionOK: (): void => this.onGoBackConditionOK(),
    onGoConditionFail: (): void => this.onGoBackConditionFail(),
    navigate: (): void => this.navigateToIndex(this.getCurrentRouteIndex() - 1)
  };

  private readonly ARROW_RIGHT_CALLBACK_SET: KeyCallbackSet = {
    goCondition: (): boolean => this.goNextCondition(),
    onGoConditionOK: (): void => this.onGoNextConditionOK(),
    onGoConditionFail: (): void => this.onGoNextConditionFail(),
    navigate: (): void => this.navigateToIndex(this.getCurrentRouteIndex() + 1)
  };

  constructor() {
    fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => { this.onKeydown(event); });
  }

  public restart(): void {
    this.activeCondition = () => true;
    this.goBackCondition = () => false;
    this.goNextCondition = () => false;
    this.onGoNextConditionOK = () => { };
    this.onGoNextConditionFail = () => { };
    this.onGoBackConditionOK = () => { };
    this.onGoBackConditionFail = () => { };
  }

  private onKeydown(event: KeyboardEvent): void {
    const keyCallbackSet = this.getCallbackSet(event.key);

    if (!keyCallbackSet || !this.active || !this.activeCondition()) { return; }

    if (keyCallbackSet.goCondition()) {
      keyCallbackSet.onGoConditionOK();
      keyCallbackSet.navigate();
    } else {
      keyCallbackSet.onGoConditionFail();
    }
    event.stopPropagation();
  }

  private getCallbackSet(key: string): KeyCallbackSet {
    switch (key) {
      case 'ArrowLeft': return this.ARROW_LEFT_CALLBACK_SET;
      case 'ArrowRight': return this.ARROW_RIGHT_CALLBACK_SET;
      default: return null;
    }
  }

  private navigateToIndex(index: number): void {
    this.router.navigateByUrl(this.router.config[index].path, { skipLocationChange: true });
  }

  private getCurrentRouteIndex(): number {
    return this.router.config.findIndex((route) => (this.router.url === '/' + route.path));
  }
}
