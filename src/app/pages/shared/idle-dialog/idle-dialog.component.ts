import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-idle-dialog',
  templateUrl: './idle-dialog.component.html',
  styleUrls: ['./idle-dialog.component.scss']
})
export class IdleDialogComponent implements OnInit {
  timeLeft = 30;
  interval: any;
  user: any;
  constructor(private router: Router,private mdDialogRef: MatDialogRef<IdleDialogComponent>,
    private userService: UserService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } 
      else 
      {
        //Logout
        clearTimeout(this.interval);
        this.mdDialogRef.close(true);
        this.authService.logout(this.user).subscribe(
        r => {
            localStorage.clear();
            this.router.navigate(['extra', 'login']);
        });
      }
    }, 1000)
  }

  hereClicked(){
    clearTimeout(this.interval);
    this.mdDialogRef.close(true);
  }

}
