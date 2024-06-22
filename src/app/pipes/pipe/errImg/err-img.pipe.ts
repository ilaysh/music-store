import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errImg',
  standalone: true
})
export class ErrImgPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (!value) {
      return 'public/no-image.png';
    }

    return value;
  }

}
