import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../common/services/auth.service';
import { URL_ENDPOINT } from '../../../common/constants/url-endpoint';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly authService = inject(AuthService);
  readonly urlEndpoint = URL_ENDPOINT;

  logout(): void {
    this.authService.logout();
    this.router.navigate([URL_ENDPOINT.LOGIN]);
  }
}