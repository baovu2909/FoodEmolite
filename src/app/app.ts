import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './common/services/auth.service';

import { ToastComponent } from './shared/component/toast/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('food-emolite');

  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.verifyOnRefresh().subscribe();
  }
}