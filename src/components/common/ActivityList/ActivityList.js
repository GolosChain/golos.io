import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedDate } from 'react-intl';

import ActivityItem from '../ActivityItem';

// const DateWrapper = styled.div`
//   display: flex;
//   justify-content: center;
// `;
//
// const Date = styled.div`
//   display: flex;
//   align-items: center;
//   height: 30px;
//   padding: 0 13px;
//   border-radius: 100px;
//   font-size: 14px;
//   font-weight: 300;
//   color: #333;
//   background: #fff;
//   box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
//   cursor: default;
// `;

export default class ActivityList extends Component {
  static propTypes = {
    order: PropTypes.array.isRequired,
    isCompact: PropTypes.bool,
    checkVisibility: PropTypes.bool,
  };

  // renderDate(notification) {
  //   const { isCompact } = this.props;
  //
  //   if (!isCompact && notification.isNextDay) {
  //     return (
  //       <DateWrapper>
  //         <Date>
  //           <FormattedDate
  //             value={notification.get('createdAt')}
  //             day="numeric"
  //             month="long"
  //             year="numeric"
  //           />
  //         </Date>
  //       </DateWrapper>
  //     );
  //   }
  //
  //   return null;
  // }

  render() {
    const { order, isCompact, checkVisibility } = this.props;

    return (
      <>
        {order.map(id => (
          <Fragment key={id}>
            {/*{this.renderDate(id)}*/}
            <ActivityItem id={id} isCompact={isCompact} checkVisibility={checkVisibility} />
          </Fragment>
        ))}
      </>
    );
  }
}
