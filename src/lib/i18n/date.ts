const KK_MONTHS = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
const KK_WEEKDAYS = ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'];

function intlLocale(locale: string) {
  return locale === 'ru' ? 'ru-RU' : 'en-US';
}

export function formatDate(value: string | Date, locale: string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (locale === 'kk') {
    return `${date.getDate()} ${KK_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return date.toLocaleDateString(intlLocale(locale), { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTopDate(locale: string): string {
  const date = new Date();
  if (locale === 'kk') {
    return `${KK_WEEKDAYS[date.getDay()]}, ${date.getDate()} ${KK_MONTHS[date.getMonth()]}`;
  }
  return date.toLocaleDateString(intlLocale(locale), { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatDateTime(value: string, locale: string): string {
  const date = new Date(value);
  if (locale === 'kk') {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${date.getDate()} ${KK_MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hh}:${mm}`;
  }
  return date.toLocaleString(intlLocale(locale));
}
