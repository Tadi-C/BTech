import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreacks',
  standalone: true
})
export class LinebreacksPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value.replace(/\n/g, '<br>') : value;
  }

}
