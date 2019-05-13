import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { pathOr } from 'ramda';
// import sprite from 'svg-sprite-loader/runtime/sprite.build';
import GlobalStyles from 'styles/global';
// const spriteContent = sprite.stringify();

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [...initialProps.styles, ...sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const lang = pathOr(
      'en',
      ['__NEXT_DATA__', 'props', 'initialProps', 'initialLanguage'],
      this.props
    );

    return (
      <html lang={lang}>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta name="description" content="Cyber Golos App" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta
            name="description"
            content="Голос - социальная сеть, построенная на публичном блокчейне. Вознаграждение пользователей осуществляется за счет дополнительной эмиссии токенов. При этом распределением токенов управляют текущие пользователи сети через голосование за лучший контент."
          />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="GOLOS.io Блоги" />
          <meta property="og:title" content="GOLOS.io Блоги" />
          <meta
            property="og:description"
            content="Голос - социальная сеть, построенная на публичном блокчейне. Вознаграждение пользователей осуществляется за счет дополнительной эмиссии токенов. При этом распределением токенов управляют текущие пользователи сети через голосование за лучший контент."
          />
          <meta property="og:image" content="https://golos.io/images/golos-share.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@goloschain" />
          <meta name="twitter:title" content="GOLOS.io Блоги" />
          <meta name="twitter:image" content="https://golos.io/images/golos-share.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="57x57"
            href="/favicons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="60x60"
            href="/favicons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="72x72"
            href="/favicons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="76x76"
            href="/favicons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="114x114"
            href="/favicons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="120x120"
            href="/favicons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="144x144"
            href="/favicons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon-precomposed"
            type="image/png"
            sizes="152x152"
            href="/favicons/apple-icon-152x152.png"
          />
          <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16" />
          <meta name="application-name" content="Голос" />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-TileImage" content="/images/favicons/ms-icon-144x144.png" />
          <meta name="msapplication-square70x70logo" content="/images/favicons/ms-icon-70x70.png" />
          <meta
            name="msapplication-square150x150logo"
            content="/images/favicons/ms-icon-150x150.png"
          />
          <meta
            name="msapplication-wide310x150logo"
            content="/images/favicons/ms-icon-310x150.png"
          />
          <meta
            name="msapplication-square310x310logo"
            content="/images/favicons/ms-icon-310x310.png"
          />
          <GlobalStyles />
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
