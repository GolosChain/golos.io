import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import SlideContainer from 'components/common/SlideContainer';
import TagSelect from 'components/common/TagSelect';
import { toggleTag } from 'utils/tags';
import { getPathnameFromPath } from 'utils/routes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  @media (max-width: 500px) {
    display: none;
  }
`;

const Title = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;

  line-height: 1;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.7px;
  color: #333;
  text-transform: uppercase;

  margin-bottom: 20px;
`;

const TagSelectStyled = styled(TagSelect)`
  &:not(:last-child) {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const Tags = styled.div`
  display: flex;

  @media (min-width: 768px) {
    flex-wrap: wrap;
  }
`;

const IconCross = styled(Icon).attrs({
  name: 'cross_thin',
  size: 14,
})`
  cursor: pointer;
`;

const ClearTags = styled(Link)`
  color: #333;

  &:hover {
    color: #2a2a2a;
  }
`;

@withRouter
export default class TagsBox extends Component {
  static propTypes = {
    router: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    // connect
    selectedTags: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    selectedTags: [],
  };

  handleTagClick = tag => toggleTag(tag);

  renderTag = tag => {
    return (
      <TagSelectStyled
        key={tag}
        tag={tag}
        isSelected
        onlyRemove
        ariaLabel={tt('aria_label.cancel_sort_by_tag', { tag })}
        onTagClick={this.handleTagClick}
      />
    );
  };

  render() {
    const { selectedTags, router } = this.props;

    if (!selectedTags.length) {
      return null;
    }

    return (
      <Wrapper>
        <Title>
          {tt('tags.selectedTags')}{' '}
          <ClearTags
            route={getPathnameFromPath(router.asPath)}
            role="button"
            aria-label={tt('aria_label.reset_tags')}
            data-tooltip={tt('aria_label.reset_tags')}
          >
            <IconCross />
          </ClearTags>
        </Title>

        <SlideContainer>
          <Tags>{selectedTags.map(this.renderTag)}</Tags>
        </SlideContainer>
      </Wrapper>
    );
  }
}
