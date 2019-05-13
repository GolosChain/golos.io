import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

const Root = styled.div`
  ${is('animated')`
    path {
      transition: transform 0.15s;
    }
    
    path:hover, .pie-chart-big {
      transform: scale(1.1);
    }
  `};
`;

export default class PieChart extends PureComponent {
  render() {
    const { parts } = this.props;

    // Bug: https://github.com/GolosChain/tolstoy/issues/1401
    const animated = process.browser && !/ (?:firefox|edge)\//i.test(navigator.userAgent);

    let sum = 0;

    const __parts = [];

    for (const part of parts) {
      if (part.value) {
        __parts.push(part);
        sum += part.value;
      }
    }

    if (__parts.length === 0) {
      return null;
    }

    if (__parts.length === 1) {
      const part = __parts[0];

      return (
        <Root animated={animated}>
          <svg viewBox="-1.1 -1.1 2.2 2.2">
            <circle
              cx="0"
              cy="0"
              r="1"
              fill={part.color}
              className={part.isBig ? 'pie-chart-big' : null}
            />
          </svg>
        </Root>
      );
    }

    const _parts = __parts.map(part => ({
      value: part.value / sum,
      isBig: part.isBig,
      color: part.color,
    }));

    const start = {
      x: 0,
      y: -1,
    };

    let cur = start;
    let prevP = 0;

    const paths = _parts.map((part, i) => {
      const prev = cur;

      if (i === _parts.length - 1) {
        cur = start;
      } else {
        cur = calcXY(2 * Math.PI * (prevP + part.value));
      }

      prevP += part.value;

      const isBig = part.value > 0.5;

      return {
        d: `M ${prev.x} ${prev.y} A 1 1 0 ${isBig ? 1 : 0} 1 ${cur.x} ${cur.y} L 0 0`,
        fill: part.color,
        className: part.isBig ? 'pie-chart-big' : null,
      };
    });

    return (
      <Root animated={animated}>
        <svg viewBox="-1.1 -1.1 2.2 2.2">
          {paths.map((attrs, i) => (
            <path key={i} {...attrs} />
          ))}
        </svg>
      </Root>
    );
  }
}

function calcXY(angle) {
  return {
    x: Math.sin(angle),
    y: -Math.cos(angle),
  };
}
