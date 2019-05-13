import { PureComponent } from 'react';
import PropTypes from 'prop-types';

const BREAKPOINTS = {
  mobileLandscape: 501,
  tablet: 768,
  desktop: 1025, // targeting devices that are larger than the iPad (which is 1024px in landscape mode)
};

export default class UIStoreSync extends PureComponent {
  static propTypes = {
    screenType: PropTypes.string.isRequired,
    updateUIMode: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const { screenType, updateUIMode } = this.props;
    const width = window.innerWidth;

    let actualScreenType;

    if (width >= BREAKPOINTS.desktop) {
      actualScreenType = 'desktop';
    } else if (width >= BREAKPOINTS.tablet) {
      actualScreenType = 'tablet';
    } else if (width >= BREAKPOINTS.mobileLandscape) {
      actualScreenType = 'mobileLandscape';
    } else {
      actualScreenType = 'mobile';
    }

    if (actualScreenType !== screenType) {
      updateUIMode({
        screenType: actualScreenType,
      });
    }
  };

  render() {
    return null;
  }
}
