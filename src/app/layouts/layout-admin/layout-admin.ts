import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';
import { TopbarComponent } from './topbar/topbar';

@Component({
  selector: 'app-layout-admin',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent
  ],
  templateUrl: './layout-admin.html'
})
export class LayoutAdminComponent {}