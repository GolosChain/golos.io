import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Icon from 'components/golos-ui/Icon';

const Root = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 0);
  z-index: 400;
  pointer-events: all;
`;

const ButtonBlock = styled.div`
  width: 320px;
  max-width: 100%;
  height: 50px;
  border-radius: 100px;
  background: #2879ff;
  overflow: hidden;
  transform: translate(0, 100px);
  transition: background-color 0.25s, transform 0.35s;
  box-shadow: 0 10px 37px 0 rgba(202, 202, 202, 0.76);
  pointer-events: all;

  ${is('second')`
    background: #fff;
  `};

  ${is('show')`
    transform: translate(0, 0);
  `};

  ${is('hiding')`
    transform: translate(0, 100px);
  `};
`;

const Container = styled.div`
  transform: translate(0, 0);
  transition: transform 0.25s;

  ${is('second')`
    transform: translate(0, -50px);
  `};
`;

const State = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;

const Button = styled.div`
  flex-basis: 150px;
  flex-grow: 1;
  height: 50px;
  padding: 0 4px;
  line-height: 50px;
  font-family: 'SF Pro Text', sans-serif;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
  white-space: nowrap;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MainButton = styled(Button)`
  padding-left: 8px;
`;

const ButtonLeft = styled(Button)`
  border-right: 1px solid #e1e1e1;
  font-size: 12px;
  color: #959595;
`;

const ButtonRight = styled(Button)`
  border-left: 1px solid #e1e1e1;
  font-size: 12px;
  color: #333;
`;

const Close = styled.div.attrs({ role: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 100%;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const CloseIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  color: #fff;
`;

export default class OpenMobileAppButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onHideForever: PropTypes.func.isRequired,
  };

  state = {
    show: false,
    hiding: false,
    closePrompt: false,
  };

  componentDidMount() {
    this._to = setTimeout(() => {
      this.setState({
        show: true,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this._to);
  }

  render() {
    const { onClick } = this.props;
    const { closePrompt, show, hiding } = this.state;

    return (
      <Root>
        <ButtonBlock second={closePrompt} show={show} hiding={hiding}>
          <Container second={closePrompt}>
            <State>
              <MainButton onClick={onClick}>{tt('start_mobile_app.open_in_app')}</MainButton>
              <Close onClick={this._onCloseClick}>
                <CloseIcon name="cross" />
              </Close>
            </State>
            <State>
              <ButtonLeft onClick={this._onHideForever}>
                {tt('start_mobile_app.close_forever')}
              </ButtonLeft>
              <ButtonRight onClick={this._onHide}>{tt('start_mobile_app.close_once')}</ButtonRight>
            </State>
          </Container>
        </ButtonBlock>
      </Root>
    );
  }

  _onCloseClick = () => {
    this.setState({
      closePrompt: true,
    });
  };

  _onHideForever = () => {
    this.setState({
      hiding: true,
    });

    setTimeout(() => {
      this.props.onHideForever();
    }, 350);
  };

  _onHide = () => {
    this.setState({
      hiding: true,
    });

    setTimeout(() => {
      this.props.onHide();
    }, 350);
  };
}
