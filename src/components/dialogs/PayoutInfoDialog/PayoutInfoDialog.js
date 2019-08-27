import React, { PureComponent } from 'react';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';
import PayoutInfo from 'components/common/PayoutInfo';

const Wrapper = styled.div`
  position: relative;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  width: 46px;
  height: 46px;
  padding: 18px 18px 14px 14px;
  color: #e1e1e1;
  user-select: none;
  cursor: pointer;
`;

export default class PayoutInfoDialog extends PureComponent {
  render() {
    const { close } = this.props;

    return (
      <Wrapper>
        <CloseIcon name="cross" onClick={close} />
        <PayoutInfo {...this.props} />
      </Wrapper>
    );
  }
}
