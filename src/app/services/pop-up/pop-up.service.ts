import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  constructor(private snackbar: MatSnackBar) { }

  public showProblemMessage(message: string): void {
    this.showMessage(message, false);
  }

  public showSuccessMessage(message: string): void {
    this.showMessage(message, true);
  }

  private showMessage(message: string, success: boolean): void {
    const panelClass = success ? ['my-snackbar-confirm'] : ['my-snackbar-problem'];
    const $snackbar = this.snackbar.open(message, null, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass
    });
    $snackbar.afterOpened().subscribe(() => {
      document.getElementsByClassName('mat-snack-bar-container')[0].parentElement.style.pointerEvents = 'none';
    });
  }
}
