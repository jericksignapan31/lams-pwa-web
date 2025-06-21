import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'to24Hour',
})
export class To24HourPipe implements PipeTransform {
  transform(time: string): string {
    if (!time) return '';
    // Convert "07:00 AM" to "07:00:00", "01:30 PM" to "13:30:00"
    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return time;
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const period = match[3].toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute}:00`;
  }
}
