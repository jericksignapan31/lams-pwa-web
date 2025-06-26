import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  userProfile: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userProfile = this.authService.userProfile;
    console.log('🔍 UserProfile from AuthService:', this.userProfile);

    if (!this.userProfile) {
      this.userService.getUser().subscribe((profile: any) => {
        this.user = profile;
        this.userProfile = profile;
        console.log('🔍 UserProfile from API:', this.userProfile);
      });
    } else {
      this.user = this.userProfile;
    }
  }
}
