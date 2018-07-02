import {formats, symbols, isSupportedLocale} from './formats';
import {condenseNumberToParts} from './condense-number-to-parts';

export function condenseCurrency(
  value: number,
  locale: string,
  currencyCode: string,
  precision: number = 0,
) {
  if (!isSupportedLocale(locale)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }

  const {sign, number, abbreviation} = condenseNumberToParts(
    value,
    locale,
    precision,
  );

  const localeInfo = formats[locale];
  const currencyFormatsForLocale = localeInfo.number.patterns.currency;

  const symbolsForLocale = symbols[localeInfo.number.symbols];

  const normalizedCurrencyCode = currencyCode.toUpperCase();
  const currencySymbol =
    localeInfo.number.currencies[normalizedCurrencyCode] ||
    normalizedCurrencyCode;

  const resolvedNumber = `${number}${abbreviation}`;

  if (sign === '-') {
    const {negativePattern} = currencyFormatsForLocale;

    return negativePattern
      .replace('{minusSign}', symbolsForLocale.minusSign)
      .replace('{currency}', currencySymbol)
      .replace('{number}', resolvedNumber);
  } else {
    const {positivePattern} = currencyFormatsForLocale;

    return positivePattern
      .replace('{currency}', currencySymbol)
      .replace('{number}', resolvedNumber);
  }
}
