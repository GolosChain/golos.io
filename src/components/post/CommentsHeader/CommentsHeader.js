import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Popover from 'components/golos-ui/Popover';
import { logClickAnalytics } from 'helpers/gaLogs';
import SortLine from 'components/post/CommentsHeader/SortLine';
import { SORT_BY_NEWEST, SORT_BY_OLDEST } from 'shared/constants';

const SORT_CATEGORIES = [SORT_BY_NEWEST, SORT_BY_OLDEST];

const CommentsHeaderWrapper = styled.div`
  display: flex;
  height: 32px;
  justify-content: space-between;

  @media (max-width: 500px) {
    height: 48px;
  }
`;

const CommentsCount = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #393636;
  text-transform: uppercase;
`;

const SortComments = styled.div`
  display: flex;

  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #b7b7ba;
`;

const CommentCategory = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px 0 5px;
  color: #333;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-20%);

    border: 3px solid transparent;
    border-top: 4px solid #333;
  }
`;

const SortBy = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 576px) {
    display: none;
  }
`;

const CustomPopover = styled(Popover)`
  margin: -5px 0 0 -27px;
`;

const SortWrapper = styled.div`
  display: flex;
  width: 170px;
  padding: 4px 0;
  margin: 0;
  flex-direction: column;
`;

export default class CommentsHeader extends Component {
  static propTypes = {
    commentsCount: PropTypes.number.isRequired,
    sortCategory: PropTypes.string.isRequired,

    setCommentsFilter: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
  };

  state = {
    showPopover: false,
  };

  closePopover = e => {
    if (e) {
      e.stopPropagation();
    }

    this.setState({
      showPopover: false,
    });

    this.lastCloseTs = Date.now();
  };

  openPopover = () => {
    // Unexpected reopen popup protection
    if (this.lastCloseTs && Date.now() - this.lastCloseTs < 250) {
      return;
    }

    this.setState({
      showPopover: true,
    });
  };

  onSortCategoryChange = sortCategory => {
    const { fetchComments, setCommentsFilter } = this.props;

    this.closePopover();
    logClickAnalytics('Link', `Sort by ${sortCategory}`);
    setCommentsFilter(sortCategory);

    fetchComments({ sortBy: sortCategory });
  };

  render() {
    const { commentsCount, sortCategory } = this.props;
    const { showPopover } = this.state;

    return (
      <CommentsHeaderWrapper id="comments">
        <CommentsCount>
          {tt('g.comments')} ({commentsCount})
        </CommentsCount>
        <SortComments>
          <SortBy>{tt('post_jsx.sort_by')}:</SortBy>
          <CommentCategory onClick={this.openPopover}>
            {tt(['post_jsx', sortCategory])}
            {showPopover ? (
              <CustomPopover show withArrow={false} closePopover={this.closePopover}>
                <SortWrapper>
                  {SORT_CATEGORIES.map(sortCategory => (
                    <SortLine
                      key={sortCategory}
                      sortCategory={sortCategory}
                      onChange={this.onSortCategoryChange}
                    />
                  ))}
                </SortWrapper>
              </CustomPopover>
            ) : null}
          </CommentCategory>
        </SortComments>
      </CommentsHeaderWrapper>
    );
  }
}
