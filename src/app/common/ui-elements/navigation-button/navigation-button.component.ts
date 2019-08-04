import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatAnchor } from '@angular/material';

@Component({
  selector: 'app-navigation-button',
  templateUrl: './navigation-button.component.html',
  styleUrls: ['./navigation-button.component.scss']
})
export class NavigationButtonComponent implements OnInit {
  @ViewChild('button')
  public button: MatAnchor;

  @Input()
  public text: string;

  @Input()
  public destinationUrl: string;

  @Input()
  public condition: boolean;

  @Input()
  set disabled(b: boolean) {
    if (b) this.button._elementRef.nativeElement.style.backgroundColor = 'gray';
    else   this.button._elementRef.nativeElement.style.backgroundColor = 'rgb(91, 155, 213)';
  }

  @Output()
  public success = new EventEmitter();

  @Output()
  public failure = new EventEmitter();

  constructor(public router: Router) { }

  ngOnInit() { }

  navigate(): void {
    if (this.condition || this.condition === undefined) {
      this.success.emit();
      this.router.navigateByUrl(this.destinationUrl, { skipLocationChange: true });
    } else {
      this.failure.emit();
    }
  }

  onNavigationButtonClick(): void {
    this.navigate();
  }

  onNavigationButtonKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.navigate();
    }
  }
}
