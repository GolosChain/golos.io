import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, omit } from 'ramda';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Unknown';
}

export async function getDynamicComponentInitialProps(DynamicComp, params) {
  let Comp = DynamicComp;

  if (Comp.preload) {
    Comp = (await Comp.preload()).default;
  }

  if (Comp.getInitialProps) {
    return Comp.getInitialProps(params);
  }

  return null;
}

export default (tabs, defaultTab) => Comp =>
  class WithTabs extends Component {
    static displayName = `withTabs(${getDisplayName(Comp)})`;

    static async getInitialProps({ query, store }) {
      const tab = tabs[query.section || defaultTab];

      const profileProps = await Comp.getInitialProps({ query, store });
      const tabProps = tab
        ? await getDynamicComponentInitialProps(tab.Component, { query, store, profileProps })
        : null;

      return {
        ...profileProps,
        tabProps: omit('namespacesRequired', tabProps),
        namespacesRequired: uniq(
          (profileProps.namespacesRequired || []).concat(
            (tabProps && tabProps.namespacesRequired) || []
          )
        ),
      };
    }

    static propTypes = {
      router: PropTypes.shape({
        query: PropTypes.shape({}).isRequired,
      }).isRequired,
    };

    render() {
      const { router } = this.props;

      const tabId = router.query.section || defaultTab;

      const tab = tabs[tabId];

      return <Comp {...this.props} tabs={tabs} tabId={tabId} tab={tab} />;
    }
  };
