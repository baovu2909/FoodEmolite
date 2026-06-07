import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-popup',
  imports: [],
  templateUrl: './confirm-popup.html'
})
export class ConfirmPopupComponent {
  title = input.required<string>();
  message = input.required<string>();
  confirmText = input('Xác nhận');
  cancelText = input('Huỷ');
  isSubmitting = input(false);

  confirmed = output<void>();
  cancelled = output<void>();
}