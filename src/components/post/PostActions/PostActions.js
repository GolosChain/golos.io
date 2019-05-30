import React from 'react';
import is from 'styled-is';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { Link } from 'shared/routes';
import Icon from 'components/golos-ui/Icon';

const Action = styled(({ isLink, ...props }) =>
  // eslint-disable-next-line
  isLink ? <a {...props} /> : <button {...props} />
)`
  display: flex;
  align-items: center;
  color: ${props => (props.active ? '#2879ff' : '#333')} !important;
  cursor: pointer;
  text-transform: initial !important;

  ${is('colored')`
    &:hover {
      color: #2879ff !important;
    }
  `};
`;

const ActionIcon = styled(Icon)`
  width: 20px;
`;

const ActionText = styled.div`
  margin-left: 25px;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  line-height: 44px;
  white-space: nowrap;
  cursor: pointer;
`;

export default function PostActions({
  className,
  isFavorite,
  // isPinned,
  // togglePin,
  isOwner,
  isEdit,
  showText = false,
  addFavorite,
  removeFavorite,
  fetchFavorites,
  fullUrl,
  coloredOnHover,
  currentUserId,
}) {
  let favoriteTooltip;

  if (!showText) {
    favoriteTooltip = isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites');
  }

  const onFavoriteClick = async () => {
    if (!currentUserId) {
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(fullUrl);
      } else {
        await addFavorite(fullUrl);
      }
      fetchFavorites();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  };

  const FavoriteButton = (
    <Action
      name="post-actions__favorite"
      className={className}
      colored={coloredOnHover ? 1 : 0}
      data-tooltip={favoriteTooltip}
      aria-label={favoriteTooltip}
      onClick={onFavoriteClick}
    >
      <ActionIcon name={isFavorite ? 'star_filled' : 'star'} />
      {showText ? <ActionText>{tt('g.add_to_favorites')}</ActionText> : null}
    </Action>
  );

  if (isOwner) {
    const editTooltip = showText ? undefined : tt('active_panel_tooltip.edit');
    // let pinTooltip;

    // if (!showText) {
    //   pinTooltip = isPinned
    //     ? tt('active_panel_tooltip.unpin_post')
    //     : tt('active_panel_tooltip.pin_post');
    // }

    return (
      <>
        {!isEdit ? (
          <Link route={`/@${fullUrl}/edit`} passHref>
            <Action
              isLink
              name="post-actions__edit"
              className={className}
              colored={coloredOnHover ? 1 : 0}
              data-tooltip={editTooltip}
              aria-label={editTooltip}
            >
              <ActionIcon name="pen" />
              {showText ? <ActionText>{tt('active_panel_tooltip.edit')}</ActionText> : null}
            </Action>
          </Link>
        ) : null}
        {/* TODO: Temp disabled
        <Action
          className={className}
          active={isPinned ? 1 : 0}
          colored={coloredOnHover ? 1 : 0}
          data-tooltip={pinTooltip}
          aria-label={pinTooltip}
          onClick={togglePin}
        >
          <ActionIcon name="pin" />
          {showText ? <ActionText>{tt('active_panel_tooltip.pin_post')}</ActionText> : null}
        </Action>
        */}
        {currentUserId ? FavoriteButton : null}
      </>
    );
  }
  return currentUserId ? FavoriteButton : null;
}

PostActions.propTypes = {
  fullUrl: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  // isPinned: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  // togglePin: PropTypes.func.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  showText: PropTypes.bool,
  coloredOnHover: PropTypes.bool,
};

PostActions.defaultProps = {
  showText: false,
  coloredOnHover: false,
};
