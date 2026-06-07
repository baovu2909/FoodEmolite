import {
  Component,
  output,
  signal,
  input
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateStoreRequest } from '../../../../common/models/store.model';

export type StoreAddSubmit = CreateStoreRequest;

@Component({
  selector: 'app-pop-up-store-add',
  imports: [
    FormsModule
  ],
  templateUrl: './pop-up-store-add.html'
})
export class PopUpStoreAdd {
  isSubmitting = input(false);

  closed = output<void>();
  submitted = output<StoreAddSubmit>();

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  formStoreName = signal('');
  formPhoneNumber = signal('');
  formAddress = signal('');
  formDescription = signal('');

  close(): void {
    this.closed.emit();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedFile.set(null);
      this.previewUrl.set(null);
      return;
    }

    const file = input.files[0];

    this.selectedFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
  }

  submit(): void {
    this.submitted.emit({
      storeName: this.formStoreName(),
      thumbnailFile: this.selectedFile(),
      phoneNumber: this.formPhoneNumber() || null,
      address: this.formAddress() || null,
      description: this.formDescription() || null
    });
  }
}