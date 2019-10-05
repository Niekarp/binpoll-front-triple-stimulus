import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  constructor(private snackbar: MatSnackBar) { }

  public showSuccessMessage(message: string): void {
    this.showStandardMessage(message, 0, 2000);
  }

  public showWarningMessage(message: string): void {
    this.showStandardMessage(message, 1, 2000);
  }

  public showProblemMessage(message: string, duration: number = 2000): void {
    this.showStandardMessage(message, 2, duration);
  }

  public showFatalMessage(message: string): void {
    this.snackbar.open(message, null, {
      duration: 360000,
      verticalPosition: 'top',
      panelClass: ['my-snackbar-fatal']
    });
  }

  private showStandardMessage(message: string, type: number, duration: number): void {
    const panelClass = this.getSnackbarPanelClass(type);
    const $snackbar = this.snackbar.open(message, null, {
      duration,
      verticalPosition: 'top',
      panelClass
    });
    $snackbar.afterOpened().subscribe(() => {
      document.getElementsByClassName('mat-snack-bar-container')[0].parentElement.style.pointerEvents = 'none';
    });
  }

  private getSnackbarPanelClass(type: number): string[] {
    switch (type) {
      case 0: return ['my-snackbar-confirm'];
      case 1: return ['my-snackbar-warning'];
      case 2: return ['my-snackbar-problem'];
      default: return ['my-snackbar-confirm'];
    }
  }
}
