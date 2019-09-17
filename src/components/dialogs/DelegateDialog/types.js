import PropTypes from 'prop-types';

export const DelegationType = PropTypes.shape({
  to: PropTypes.string.isRequired,
  toUsername: PropTypes.string,
  from: PropTypes.string.isRequired,
  fromUsername: PropTypes.string,
  quantity: PropTypes.shape({
    GESTS: PropTypes.string.isRequired,
    GOLOS: PropTypes.string.isRequired,
  }).isRequired,
});
