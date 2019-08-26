import React, { PureComponent } from 'react';
import { ANDROID_PACKAGE, ANDROID_DEEP_LINK_DOMAIN } from 'constants/config';
import OpenMobileAppButton from 'components/common/OpenMobileAppButton';

const STORE_KEY = 'golos.hideOpenAppLink';

let hide = false;

if (process.browser) {
  hide = Boolean(localStorage.getItem(STORE_KEY));
}

const ignoreRoutes = ['/welcome', '/faq', '/~witnesses', '/leaders', '/validators', '/market'];

export default class MobileAppButton extends PureComponent {
  render() {
    if (!process.browser) {
      return null;
    }

    if (
      hide ||
      !navigator.userAgent.match(/android/i) ||
      ignoreRoutes.includes(window.location.pathname)
    ) {
      return null;
    }

    return (
      <OpenMobileAppButton
        onClick={this._onClick}
        onHide={this._onHide}
        onHideForever={this._onHideForever}
      />
    );
  }

  _onClick = () => {
    const path = window.location.pathname;
    const iframe = document.createElement('iframe');
    const rewritePath = path === '/' ? '/trending' : path;

    iframe.src = `golosioapp://${ANDROID_DEEP_LINK_DOMAIN}${rewritePath}`;
    document.body.appendChild(iframe);

    setTimeout(() => {
      window.location.replace(`market://details?id=${ANDROID_PACKAGE}`);
    }, 250);
  };

  _onHide = () => {
    hide = true;
    this.forceUpdate();
  };

  _onHideForever = () => {
    hide = true;
    localStorage.setItem(STORE_KEY, '1');
    this.forceUpdate();
  };
}
