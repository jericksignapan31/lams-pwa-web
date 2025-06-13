import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: any;
  userService = inject(UserService);

  ngOnInit() {
    this.user = this.userService.getAllUsers()[0]; 
  }
}
