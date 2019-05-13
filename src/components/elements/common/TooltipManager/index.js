import React from 'react';
import cn from 'classnames';
import debounce from 'lodash/debounce';

const RAISE_TIME = 400;
let key = 0;

export default class TooltipManager extends React.PureComponent {
  state = {
    tooltip: null,
  };

  componentDidMount() {
    document.addEventListener('mousemove', this._onMouseMove, true);
    document.addEventListener('resize', this._resetTooltips);
    document.addEventListener('mousedown', this._resetTooltipsEvent, true);
    document.addEventListener('keydown', this._resetTooltipsEvent, true);
    window.addEventListener('scroll', this._resetTooltips);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this._onMouseMove, true);
    document.removeEventListener('resize', this._resetTooltips);
    document.removeEventListener('mousedown', this._resetTooltipsEvent, true);
    document.removeEventListener('keydown', this._resetTooltipsEvent, true);
    window.removeEventListener('scroll', this._resetTooltips);

    this._resetTooltips();
  }

  render() {
    const { tooltip } = this.state;

    return (
      <div>
        {tooltip ? (
          <div key={tooltip.key} className={cn('Tooltip', tooltip.addClass)} style={tooltip.style}>
            <div
              className="Tooltip__inner"
              dangerouslySetInnerHTML={tooltip.isHtml ? { __html: tooltip.text } : null}
            >
              {tooltip.isHtml ? null : tooltip.text}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  _onMouseMove = debounce(e => {
    const hint = e.target.closest('[data-hint]');
    const hintText = hint ? hint.dataset.hint.trim() : null;

    if (hint && hintText) {
      if (hintText === this._hoverText) {
        return;
      }

      this._resetTooltips();

      this._hoverElement = hint;
      this._hoverText = hintText;

      this._showTooltip(true);
      return;
    }

    const tooltip = e.target.closest('[data-tooltip]');
    const text = tooltip ? tooltip.dataset.tooltip.trim() : null;

    if (tooltip && text === this._hoverText) {
      this._hoverElement = tooltip;
      return;
    }

    this._resetTooltips();

    if (tooltip && text) {
      this._hoverElement = tooltip;
      this._hoverText = text;

      this._timeout = setTimeout(() => {
        this._showTooltip();
      }, RAISE_TIME);
    }
  }, 50);

  _showTooltip(isHint) {
    const element = this._hoverElement;
    const bound = element.getBoundingClientRect();

    this._elementBound = bound;

    const isDownDirection = element.dataset.tooltipDown != null;
    let y;

    if (isDownDirection) {
      y = bound.bottom;
    } else {
      y = bound.top;
    }

    const addClasses = [];

    if (isDownDirection) {
      addClasses.push('Tooltip_bottom');
    }

    if (bound.left < 100) {
      addClasses.push('Tooltip_left');
    } else if (bound.right > window.innerWidth - 100) {
      addClasses.push('Tooltip_right');
    }

    this.setState({
      tooltip: {
        key: ++key,
        text: this._hoverText,
        isHint,
        isHtml: element.dataset.tooltipHtml != null,
        addClass: addClasses.join(' '),
        style: {
          top: Math.round(y + window.scrollY),
          left: Math.round(bound.left + bound.width / 2),
        },
      },
    });

    this._checkInterval = setInterval(this._checkElement, 500);
  }

  _checkElement = () => {
    if (!this._hoverElement.isConnected) {
      this._resetTooltips();
      return;
    }

    const b = this._elementBound;
    const bound = this._hoverElement.getBoundingClientRect();

    if (b.top !== bound.top || b.left !== bound.left) {
      this._resetTooltips();
    }
  };

  _resetTooltips = () => {
    this._hoverElement = null;
    this._hoverText = null;
    this._elementBound = null;

    this._onMouseMove.cancel();
    clearTimeout(this._timeout);

    if (this.state.tooltip) {
      this._hideTooltip();
    }
  };

  _resetTooltipsEvent = () => {
    const { tooltip } = this.state;

    if (tooltip && tooltip.isHint) {
      return;
    }

    this._resetTooltips();
  };

  _hideTooltip() {
    clearInterval(this._checkInterval);

    this.setState({
      tooltip: null,
    });
  }
}
