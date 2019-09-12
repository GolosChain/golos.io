/* eslint-disable react/prop-types,react/destructuring-assignment */

import React, { Component } from 'react';
import { withRouter } from 'next/router';

import SmartLink from 'components/common/SmartLink';

const SPLITTER_SYMBOLS = ['/', '?', '#'];

@withRouter
class RouteListener extends Component {
  state = {
    url: this.props.router.asPath,
  };

  componentDidMount() {
    const { router } = this.props;
    router.events.on('routeChangeStart', this.onRouteChange);
  }

  componentWillUnmount() {
    const { router } = this.props;
    router.events.off('routeChangeStart', this.onRouteChange);
  }

  onRouteChange = url => {
    this.setState({
      url,
    });
  };

  render() {
    const { Comp, href, includeSubRoutes, includeRoute, exact } = this.props;
    let { url } = this.state;

    if (!exact) {
      url = url.replace(/[#].*$/, '');
    }

    let isActive = url === href ? 1 : 0;

    if (!exact && !isActive) {
      if (includeSubRoutes && url.startsWith(href)) {
        const endSymbol = url.charAt(href.length);

        // Если граничный символ является разделителем то значит путь является дочерним
        if (SPLITTER_SYMBOLS.includes(endSymbol)) {
          isActive = 1;
        }
      }

      if (includeRoute) {
        isActive = url.replace(/\?.*$/, '') === includeRoute ? 1 : 0;
      }
    }

    return <Comp {...this.props} active={isActive} />;
  }
}

/**
 * HOC оборачивающий обычную ссылку во врапер из 'shared/routes' и выставляющий
 * prop active=true в том случае если текущий адрес страницы соответсвует адресу ссылки.
 *
 * При этом нужно прокинуть props:
 *   route {string} - пробросывается в Link из shared/routes
 *   params {params} - пробросывается в Link из shared/routes
 *
 * и дополнительные props непосредствеено для HOC'a:
 *  [includeSubRoutes] {boolean} - если выставлен, то состояние active включается даже
 *    тогда когда текущий адрес страницы является дочерним от адреса ссылки.
 *    Пример: ссылка с адресом '/wallet/history' будет активной если текущий адрес страницы является
 *    '/wallet/history' или любой из дочерних, на пример '/wallet/history/transfer' или '/wallet/history/convert'
 *    так же дочерними будут является урлы вида '/wallet/history?param1=value1' и '/wallet/history#someAnchor'
 *    в противном случае все эти урлы будут являться не соотвествующими исходной ссылке.
 */
export default Comp => ({ route, params, ...props }) => (
  <SmartLink route={route} params={params}>
    <RouteListener {...props} Comp={Comp} />
  </SmartLink>
);
