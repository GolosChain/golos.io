import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import withRedux from 'next-redux-wrapper';
import tt from 'counterpart';
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
import { LOCALE_COOKIE_KEY, AMPLITUDE_SESSION, readOnlyMode } from 'constants/config';
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
import CloseButton from 'components/common/CloseButton';
import ContentErrorBoundary from 'containers/ContentErrorBoundary';
import UIStoreSync from 'components/common/UIStoreSync';
import ScrollFix from 'components/common/ScrollFix';
import { checkMobileDevice } from 'helpers/browser';
import { init as initAnchorHelper } from 'utils/anchorHelper';

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

  state = {
    showCallout: true,
  };

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
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  renderCallout() {
    // const { error, flash } = this.props;
    // const alert = error || flash.get('alert');
    // const warning = flash.get('warning');
    // const success = flash.get('success');
    const alert = null;
    const warning = null;
    const success = null;

    let callout = null;

    if (this.state.showCallout && (alert || warning || success)) {
      callout = (
        <div className="App__announcement row">
          <div className="column">
            <div className="callout">
              <CloseButton onClick={() => this.setState({ showCallout: false })} />
              <p>{alert || warning || success}</p>
            </div>
          </div>
        </div>
      );
    }

    if (readOnlyMode && this.state.showCallout) {
      callout = (
        <div className="App__announcement row">
          <div className="column">
            <div className="callout warning">
              <CloseButton onClick={() => this.setState({ showCallout: false })} />
              <p>{tt('g.read_only_mode')}</p>
            </div>
          </div>
        </div>
      );
    }

    return callout;
  }

  render() {
    const { Component, pageProps, router, store } = this.props;

    const adapterArgs = {
      clientSideId: '',
      user: { key: '' },
    };

    return (
      <Container>
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
                        {this.renderCallout()}
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
      </Container>
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
