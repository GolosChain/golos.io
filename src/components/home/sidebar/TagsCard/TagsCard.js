import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';
import TagSelect from 'components/common/TagSelect';
import { toggleTag } from 'utils/tags';

const Wrapper = styled.div`
  margin-bottom: 20px;

  @media (max-width: 500px) {
    display: none;
  }
`;

const TagSelectStyled = styled(TagSelect)`
  &:not(:last-child) {
    margin-right: 10px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.div`
  position: relative;
  line-height: 1;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.7px;
  color: #333;
  text-transform: uppercase;

  margin-bottom: 20px;

  ${is('onClick')`
    cursor: pointer;
  `};
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    margin-bottom: 10px;
  }
`;

const CollapseIcon = styled(Icon).attrs({
  name: 'chevron',
  width: 12,
  height: 7,
})`
  position: absolute;
  right: 0;
  transform: rotate(0.5turn);
  transition: transform 0.4s;

  &:hover {
    color: #000;
  }
`;

export default class TagsCard extends Component {
  static propTypes = {
    // pass
    selectedTags: PropTypes.arrayOf(PropTypes.string),
    // connect
    sequenceKey: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string),
    isEnd: PropTypes.bool,
    tags: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
    getHashTagTop: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedTags: [],
    sequenceKey: null,
    order: [],
    isEnd: false,
    tags: {},
  };

  onToggleClick = () => {
    const { getHashTagTop, sequenceKey } = this.props;

    getHashTagTop({ sequenceKey });
  };

  onTagClick = tag => toggleTag(tag);

  renderTag = id => {
    const { tags, selectedTags } = this.props;
    const tag = tags[id];

    const isSelected = selectedTags.includes(tag.name);
    return (
      <TagSelectStyled
        key={id}
        tag={tag.name}
        ariaLabel={
          isSelected
            ? tt('aria_label.cancel_sort_by_tag', { tag: tag.name })
            : tt('aria_label.sort_by_tag', { tag: tag.name })
        }
        isSelected={isSelected}
        onTagClick={this.onTagClick}
      />
    );
  };

  render() {
    const { order, isEnd } = this.props;

    return (
      <Wrapper>
        <Title>{tt('tags.popularTags')}</Title>
        <TagsWrapper>{order.map(this.renderTag)}</TagsWrapper>
        {!isEnd ? (
          <Title role="button" onClick={this.onToggleClick}>
            {tt('tags.show_more_tags')}
            <CollapseIcon />
          </Title>
        ) : (
          <Button auto onClick={this.onToggleClick}>
            {tt('g.collapse')}
          </Button>
        )}
      </Wrapper>
    );
  }
}
