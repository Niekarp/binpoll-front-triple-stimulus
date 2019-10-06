import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public error = '';
  public password = '';

  constructor(public auth: AuthService, public router: Router) { }

  ngOnInit() {
  }

  public onLoginClick(event: any) {
    console.log(event);
    console.log(this.password);
    
    this.auth.login(this.password).subscribe(() => {
      this.router.navigateByUrl('/debug/audio-sets');
    },
      error => { this.error = error.error;
    });
  }
}
