import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import withRedux from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';
import { ConfigureFlopFlip } from '@flopflip/react-redux';
import adapter from '@flopflip/memory-adapter';
import 'isomorphic-unfetch';
import ToastsManager from 'toasts-manager';
import NProgress from 'nprogress';

import 'styles/index.scss';

import initStore from 'store/store';
import {
  setScreenTypeByUserAgent,
  setLayoutByCookies,
  updateUIMode,
  changeLocale,
} from 'store/actions/ui';
import { setServerAccountName } from 'store/actions/gate/auth';
import { getActualRates, getVestingSupplyAndBalance } from 'store/actions/gate';
import defaultTheme from 'themes';
import ModalManager from 'components/modals/ModalManager';
import { LOCALE_COOKIE_KEY, AMPLITUDE_SESSION } from 'constants/config';
import featureFlags from 'shared/feature-flags';
import Translator from 'shared/Translator';
import Header from 'components/header/Header';
import Footer from 'components/common/Footer';
import FeaturesToggle from 'components/common/FeaturesToggle';
import TooltipManager from 'components/elements/common/TooltipManager';
import MobileAppButton from 'components/elements/MobileBanners/MobileAppButton';
import DialogManager from 'components/elements/common/DialogManager';
import ScrollUpstairsButton from 'components/common/ScrollUpstairsButton';
import NotifyToast from 'components/common/NotifyToast';
import ContentErrorBoundary from 'containers/ContentErrorBoundary';
import UIStoreSync from 'components/common/UIStoreSync';
import ScrollFix from 'components/common/ScrollFix';
import { checkMobileDevice } from 'helpers/browser';
import { init as initAnchorHelper } from 'utils/anchorHelper';
import plugins from 'utils/JsPlugins';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

@withRedux(initStore, { debug: Boolean(process.env.DEBUG_REDUX) })
export default class GolosApp extends App {
  static propTypes = {
    error: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

  static async getInitialProps({ Component, ctx }) {
    if (ctx.req) {
      const screenTypeAction = setScreenTypeByUserAgent(ctx.req.headers['user-agent']);
      if (screenTypeAction) {
        ctx.store.dispatch(screenTypeAction);
      }

      const layoutAction = setLayoutByCookies(ctx.req.cookies);
      if (layoutAction) {
        ctx.store.dispatch(layoutAction);
      }

      const userId = ctx.req.cookies['golos.userId'];

      if (userId) {
        ctx.store.dispatch(setServerAccountName(userId));
      }

      const locale = ctx.req.cookies[LOCALE_COOKIE_KEY];
      if (locale) {
        ctx.store.dispatch(changeLocale(locale));
      }
    }

    try {
      await ctx.store.dispatch(getVestingSupplyAndBalance());
      await ctx.store.dispatch(getActualRates());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }

    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      },
    };
  }

  componentWillMount() {
    if (process.browser) {
      window.INIT_TIMESSTAMP = Date.now();
    }
  }

  componentDidMount() {
    const { store } = this.props;

    sendNewVisitToAmplitudeCom();

    initAnchorHelper();

    store.dispatch(
      updateUIMode({
        isSSR: false,
      })
    );

    plugins({
      google_analytics_id: process.env.GLS_GA_ID,
      facebook_app_id: process.env.GLS_FB_APP_ID,
      amplitude_id: process.env.GLS_AMPLITUDE_ID,
    });
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, router, store } = this.props;

    const adapterArgs = {
      clientSideId: '',
      user: { key: '' },
    };

    return (
      <>
        <Head>
          <title>Golos.io</title>
        </Head>
        <Provider store={store}>
          <Translator>
            <ThemeProvider theme={defaultTheme}>
              <ConfigureFlopFlip
                adapter={adapter}
                adapterArgs={adapterArgs}
                defaultFlags={featureFlags}
              >
                <div className="App">
                  <Header />
                  <ScrollFix>
                    <ContentErrorBoundary>
                      <div className="App__content">
                        <Component {...pageProps} />
                        {router.route === '/submit' ? null : <Footer />}
                        {router.route === '/submit' ? null : <ScrollUpstairsButton />}
                        <MobileAppButton />
                      </div>
                      <TooltipManager />
                      <UIStoreSync />
                      <ModalManager passStore={store} />
                      <DialogManager />
                      <ToastsManager renderToast={NotifyToast} />
                    </ContentErrorBoundary>
                  </ScrollFix>
                  <FeaturesToggle />
                </div>
              </ConfigureFlopFlip>
            </ThemeProvider>
          </Translator>
        </Provider>
      </>
    );
  }
}

function sendNewVisitToAmplitudeCom() {
  if (!sessionStorage.getItem(AMPLITUDE_SESSION)) {
    if (window.amplitude) {
      if (checkMobileDevice()) {
        window.amplitude.getInstance().logEvent('Attendance - new visitation (mobile)');
      } else {
        window.amplitude.getInstance().logEvent('Attendance - new visitation (desktop)');
      }
      sessionStorage.setItem(AMPLITUDE_SESSION, true);
    }
  }
}
