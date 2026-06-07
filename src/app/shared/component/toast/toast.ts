import { Component, inject } from '@angular/core';
import { ToastService } from '../../../common/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html'
})
export class ToastComponent {

  toastService = inject(ToastService);

}