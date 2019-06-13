import { connect } from 'react-redux';

import PostOptions from './PostOptions';

export default connect(state => {
  // TODO: get from community
  // const chainProps = state.chain_properties;
  // if (!chainProps) {
  //   return {};
  // }
  // return {
  //   minCurationPercent: chainProps.min_curation_percent,
  //   maxCurationPercent: chainProps.max_curation_percent,
  // };

  // TODO: temp
  return {
    minCurationPercent: 2500,
    maxCurationPercent: 10000,
  };
})(PostOptions);
