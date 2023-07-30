export class DateUtils {
  static getNextDay(_date: Date): Date {
    const date: Date = new Date(_date);
    date.setDate(date.getDate() + 1);

    return date;
  }

  static getDayInXDays(days: number): Date {
    const date: Date = new Date();
    date.setDate(date.getDate() + days);

    return date;
  }

  static setEndOfDay(date: Date): Date {
    const _date: Date = new Date(date);
    _date.setHours(23, 59, 0, 0);
    return _date;
  }

  static setBeginingOfDay = (date: Date): Date => {
    const _date: Date = new Date(date);
    _date.setHours(0, 1, 0, 0);
    return _date;
  };

  static formatDate(date: Date): string {
    let dd: number | string = date.getDate();
    let mm: number | string = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return `${dd}.${mm}.${yyyy}`;
  }
}
