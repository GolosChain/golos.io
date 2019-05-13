import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Icon from 'components/golos-ui/Icon';

export default class Hint extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    info: PropTypes.bool,
    error: PropTypes.bool,
    warning: PropTypes.bool,
    width: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center', 'right']),
  };

  rootRef = createRef();

  state = {
    align: 'center',
    alignCalculation: !this.props.align,
  };

  componentDidMount() {
    const { alignCalculation } = this.state;

    if (alignCalculation) {
      const box = this.rootRef.current.getBoundingClientRect();

      let align = 'center';

      if (box.x + box.width / 2 - window.scrollX > window.innerWidth - 150) {
        align = 'right';
      } else if (box.x - box.width / 2 - window.scrollX < 150) {
        align = 'left';
      }

      this.setState({
        alignCalculation: false,
        align,
      });
    }
  }

  render() {
    const { alignCalculation } = this.state;

    if (alignCalculation) {
      return <div ref={this.rootRef} />;
    }

    const { className, info, error, warning, width, children } = this.props;

    const align = this.props.align || this.state.align;

    let icon = 'Hint__icon';

    if (warning) {
      icon += ' Hint__icon_warning';
    } else if (error) {
      icon += ' Hint__icon_error';
    } else if (info) {
      icon += ' Hint__icon_info';
    } else {
      icon = null;
    }

    let contentStyle;

    if (width) {
      contentStyle = { width, maxWidth: 'unset' };
    }

    return (
      <div
        className={cn(
          'Hint',
          {
            [`Hint_${align}`]: align,
          },
          className
        )}
      >
        <div className="Hint__content" style={contentStyle}>
          {icon ? <Icon name="editor-info" className={icon} /> : null}
          <div className="Hint__inner">{children}</div>
        </div>
      </div>
    );
  }
}
