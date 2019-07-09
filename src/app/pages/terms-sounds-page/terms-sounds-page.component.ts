import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import *  as $ from 'jquery';

@Component({
  selector: 'app-terms-sounds-page',
  templateUrl: './terms-sounds-page.component.html',
  styleUrls: ['./terms-sounds-page.component.scss']
})
export class TermsSoundsPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onMouseEnterImage(event: MouseEvent) {
    return;
    let $img = (event.srcElement as HTMLElement);
    let imgRect = $img.getClientRects().item(0);

    let xDiff = 400 - imgRect.left;
    let yDiff = 280 - imgRect.top;
    
    $img.style.transform = 'translate(' + xDiff + 'px, ' +  yDiff + 'px) scale(2)';
    $img.style.pointerEvents = 'none';

    setTimeout(() => {
      $img.style.transform = null;
      $img.style.pointerEvents = null;
    }, 2000);
  }

  onMouseLeaveImage(event: MouseEvent) {
    // let $img = (event.srcElement as HTMLElement);
    // $img.style.transform = null;
  }

  goToPreviousPage() {
    this.router.navigateByUrl('/poll-description', { skipLocationChange: true });
  }

  gotoNextPage() {
    this.router.navigateByUrl('/terms-front-scene', { skipLocationChange: true });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.goToPreviousPage();
    }
    else if (event.key === 'ArrowRight') {
      this.gotoNextPage();
    }
  }
}
