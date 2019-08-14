import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-further-help-dialog',
  templateUrl: './further-help-dialog.component.html',
  styleUrls: ['./further-help-dialog.component.scss']
})
export class FurtherHelpDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FurtherHelpDialogComponent>, private router: Router) { }

  ngOnInit() {
    this.dialogRef.afterOpened().subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  onBackButtonClick(): void {
    this.dialogRef.close();
  }

  onReportProblemClick(): void {
    this.dialogRef.close();
    this.router.navigateByUrl('/report-problem', { skipLocationChange: true });
  }
}
