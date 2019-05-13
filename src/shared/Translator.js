import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import tt from 'counterpart';

import { UIModeSelector } from 'store/selectors/ui';

import { DEFAULT_LOCALE } from 'constants/config';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';

addLocaleData([...en, ...ru, ...uk]);

tt.registerTranslations('en', require('locales/en.json'));
tt.registerTranslations('ru', require('locales/ru-RU.json'));
tt.registerTranslations('uk', require('locales/ua.json'));

@connect(state => ({
  locale: UIModeSelector('locale')(state),
}))
export default class Translator extends PureComponent {
  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  render() {
    const { locale, children } = this.props;
    const localeWithoutRegionCode =
      locale && typeof locale === 'string'
        ? locale.toLowerCase().split(/[_-]+/)[0]
        : DEFAULT_LOCALE; // fix for firefox private mode

    tt.setLocale(localeWithoutRegionCode);
    tt.setFallbackLocale('en');

    return (
      <IntlProvider
        key={localeWithoutRegionCode}
        locale={localeWithoutRegionCode}
        defaultLocale={DEFAULT_LOCALE}
      >
        {children}
      </IntlProvider>
    );
  }
}
