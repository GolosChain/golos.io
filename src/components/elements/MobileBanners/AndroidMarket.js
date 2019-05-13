import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import tt from 'counterpart';

import settings from './settings';

@connect(state => {
  const settings = dataSelector('settings')(state);

  return {
    lang: settings.getIn(['basic', 'lang']),
  };
})
export default class AndroidMarket extends PureComponent {
  render() {
    const { lang } = this.props;

    if (!lang) {
      return null;
    }

    const imgsrc =
      lang === 'ru' || lang === 'ru-RU' ? settings.android.img_url_ru : settings.android.img_url;

    return (
      <a
        href={`${settings.android.market_source}&utm_source=${
          settings.android.utm_source
        }&utm_campaign=${
          settings.android.utm_campaign
        }&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1`}
      >
        <img alt={tt('about_jsx.mobile_banner_alt')} src={imgsrc} />
      </a>
    );
  }
}
