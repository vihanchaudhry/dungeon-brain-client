import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeTypeValidator = (
  control: AbstractControl
): Observable<ValidationErrors | null> => {
  if (typeof control.value !== 'object' || !control.value) {
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = new Observable(
    (observer: Observer<ValidationErrors | null>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = '';
        let isValid = false;
        for (const element of arr) {
          header += element.toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true } as ValidationErrors);
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file as Blob);
    }
  );
  return frObs;
};
