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
    let panelClass = success ? ['my-snackbar-confirm'] : ['my-snackbar-problem'];
    let $snackbar = this.snackbar.open(message, null, {
      duration: 2000,
      verticalPosition: "top",
      panelClass: panelClass
    });
    $snackbar.afterOpened().subscribe(() => {
      ($snackbar as any).containerInstance._elementRef.nativeElement.parentElement.style.pointerEvents = 'none';
    });
  }
}
