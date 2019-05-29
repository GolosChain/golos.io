import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Toast } from 'toasts-manager';

import Icon from 'components/golos-ui/Icon';

const ToastIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${({ color }) => color};
`;

const ToastText = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px 0 16px;
  flex-grow: 1;
  font-size: 15px;
  letter-spacing: -0.3px;
`;

const CloseButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  margin: -10px -12px -10px 0;
  color: #9b9fa2;
  transition: color 0.15s;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const CloseIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 16px;
  height: 16px;
`;

export default function NotifyToast({ type, text, onClose }) {
  let icon;

  switch (type) {
    case 'info':
      icon = <ToastIcon name="round-check" color="#4caf50" />;
      break;
    case 'warn':
      icon = <ToastIcon name="round-warning" color="#ffcb60" />;
      break;
    case 'error':
      icon = <ToastIcon name="round-warning" color="#ff5959" />;
      break;
    default:
      icon = null;
  }

  return (
    <Toast>
      {icon}
      <ToastText>{text}</ToastText>
      {onClose ? (
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      ) : null}
    </Toast>
  );
}

NotifyToast.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

NotifyToast.defaultProps = {
  onClose: null,
};
