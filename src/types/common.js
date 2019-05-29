import PropTypes from 'prop-types';

/* eslint-disable import/prefer-default-export */
export const profileType = PropTypes.shape({
  createdAt: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  personal: PropTypes.shape({
    about: PropTypes.string,
    coverImage: PropTypes.string,
    gender: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    social: PropTypes.shape({}),
    website: PropTypes.string,
  }),
  registration: PropTypes.shape({
    time: PropTypes.string.isRequired,
  }).isRequired,
  stats: PropTypes.shape({
    postsCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
  }).isRequired,
  subscribers: PropTypes.shape({
    usersCount: PropTypes.number.isRequired,
    communitiesCount: PropTypes.number.isRequired,
  }).isRequired,
  subscriptions: PropTypes.shape({
    usersCount: PropTypes.number.isRequired,
    communitiesCount: PropTypes.number.isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
});
