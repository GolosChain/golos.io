import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
// import { isNil } from 'ramda';

import Icon from 'components/golos-ui/Icon';
import IconWrapper from 'components/common/IconWrapper';
import Hint from 'components/elements/common/Hint';
import Switcher from 'components/golos-ui/Form/components/Switcher';
// import Slider from 'components/golos-ui/Slider';
import RadioGroup from 'components/elements/common/RadioGroup';
import { PAYOUT_OPTIONS } from 'components/modules/PostForm/PostForm';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 0 30px;

  @media (max-width: 860px) {
    flex-direction: column;
    width: 100%;
    margin: 0;
  }
`;

const DesktopWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 860px) {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const IconWrapperStyled = styled(IconWrapper)`
  margin: 0 9px;
  padding: 4px;
  cursor: pointer;
  transition: color 0.1s;

  &:hover {
    color: #0078c4;
  }

  ${is('isWarning')`
    color: #ef3434;

    &:hover {
      color: #ef3434;
    }
  `};

  ${is('isActive')`
    color: #0078c4;
  `};
`;

const BubbleText = styled.p`
  margin: 0 0 6px;
  font-size: 14px;
  color: #757575;
`;

// const CurationText = styled.p`
//   margin: 0 0 6px;
//   font-size: 15px;
//   white-space: nowrap;
//   color: #393636;
// `;

// const CurationValue = styled.b`
//   display: inline-block;
//   width: 38px;
//   text-align: left;
//   font-weight: 500;
// `;

// const MobileCurationValue = styled.b`
//   margin-left: 8px;
//   font-weight: bold;
// `;

const MobileWrapper = styled.div`
  display: block;
  width: 100%;
  padding: 20px 16px;

  &:not(:last-child) {
    border-bottom: 1px solid #e9e9e9;
  }

  @media (min-width: 861px) {
    display: none;
  }
`;

const PayoutLabel = styled.h5`
  display: block;
  margin: 0;
  padding: 0 0 12px;
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #959595;
`;

const StyledRadioGroup = styled(RadioGroup)`
  label {
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #333;
  }
`;

const NsfwWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MobileOption = styled.div`
  display: flex;
  align-items: center;
`;

// const MobileOptionCuration = styled(MobileOption)`
//   margin-bottom: 8px;
// `;

const MobileOptionTitle = styled.div`
  width: 100%;
  margin: 0;
  padding-left: 16px;
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #333;
`;

// const SliderStyled = styled(Slider)`
//   margin-top: 20px;
// `;

// const MobileCurationBlock = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

export default class PostOptions extends PureComponent {
  static propTypes = {
    nsfw: PropTypes.bool.isRequired,
    payoutType: PropTypes.number.isRequired,
    // curationPercent: PropTypes.number.isRequired,
    // minCurationPercent: PropTypes.number,
    // maxCurationPercent: PropTypes.number,
    editMode: PropTypes.bool,
    onNsfwClick: PropTypes.func.isRequired,
    onPayoutChange: PropTypes.func.isRequired,
    onCurationPercentChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editMode: false,
  };

  state = {
    showPayoutMenu: false,
    showCuratorMenu: false,
  };

  curatorContainer = createRef();

  payoutContainer = createRef();

  componentDidMount() {
    window.addEventListener('mousedown', this.onAwayClick);
  }

  componentWillUnmount() {
    this.unmount = true;
    window.removeEventListener('mousedown', this.onAwayClick);
  }

  onCuratorClick = () => {
    this.setState(prevState => ({
      showCuratorMenu: !prevState.showCuratorMenu,
      showPayoutMenu: false,
    }));
  };

  onPayoutClick = () => {
    this.setState(prevState => ({
      showPayoutMenu: !prevState.showPayoutMenu,
      showCuratorMenu: false,
    }));
  };

  onCurationPercentChange = percent => {
    const { onCurationPercentChange } = this.props;
    onCurationPercentChange(Math.round(percent * 100));
  };

  onPayoutModeChange = payoutMode => {
    const { onPayoutChange } = this.props;
    onPayoutChange(payoutMode);
  };

  onAwayClick = e => {
    const { showPayoutMenu, showCuratorMenu } = this.state;

    if (showPayoutMenu || showCuratorMenu) {
      for (const dropdown of [this.payoutContainer, this.curatorContainer]) {
        if (dropdown.current && dropdown.current.contains(e.target)) {
          return;
        }
      }

      setTimeout(() => {
        if (!this.unmount) {
          this.setState({
            showPayoutMenu: false,
            showCuratorMenu: false,
          });
        }
      }, 50);
    }
  };

  renderCurationMenu() {
    return <Hint align="center">{this.renderCurationPercentSlider()}</Hint>;
  }

  // renderCurationPercentSlider(isMobile) {
  //   const { curationPercent, minCurationPercent, maxCurationPercent, editMode } = this.props;

  //   let min;
  //   let max;
  //   let percent;
  //   let showCaptions;

  //   if (editMode) {
  //     min = 0;
  //     max = 100;
  //     percent = curationPercent / 100;
  //     showCaptions = false;
  //   } else {
  //     const actualPercent = Math.round(curationPercent / 100);

  //     min = Math.ceil(minCurationPercent / 100);
  //     max = Math.floor(maxCurationPercent / 100);
  //     percent = Math.max(Math.min(actualPercent, max), min);
  //     showCaptions = true;
  //   }

  //   return (
  //     <>
  //       {isMobile ? (
  //         <MobileOptionCuration>
  //           <Icon name="editor-k" />
  //           <MobileOptionTitle>
  //             <MobileCurationBlock>
  //               {tt('post_editor.set_curator_percent')}{' '}
  //               <MobileCurationValue>{percent}%</MobileCurationValue>
  //             </MobileCurationBlock>
  //           </MobileOptionTitle>
  //         </MobileOptionCuration>
  //       ) : (
  //         <CurationText>
  //           {tt('post_editor.set_curator_percent')} <CurationValue>{percent}%</CurationValue>
  //         </CurationText>
  //       )}
  //       <SliderStyled
  //         value={percent}
  //         min={min}
  //         max={max}
  //         disabled={editMode}
  //         showCaptions={showCaptions}
  //         onChange={this.onCurationPercentChange}
  //       />
  //     </>
  //   );
  // }

  renderPayoutMenu() {
    const { editMode, payoutType } = this.props;

    return (
      <Hint align="center">
        <BubbleText>{tt('post_editor.set_payout_type')}:</BubbleText>
        <RadioGroup
          disabled={editMode}
          options={PAYOUT_OPTIONS.map(({ id, title, hint }) => ({
            id,
            title: tt(title),
            hint: hint ? tt(hint) : null,
          }))}
          value={payoutType}
          onChange={this.onPayoutModeChange}
        />
      </Hint>
    );
  }

  render() {
    const {
      editMode,
      payoutType,
      nsfw,
      // minCurationPercent,
      // maxCurationPercent,
      onNsfwClick,
    } = this.props;
    const { showPayoutMenu /* showCuratorMenu */ } = this.state;

    // const showCurationPercent =
    //   editMode || (!isNil(minCurationPercent) && minCurationPercent !== maxCurationPercent);

    return (
      <Wrapper>
        <DesktopWrapper>
          {/* {showCurationPercent ? (
            <ButtonContainer ref={this.curatorContainer}>
              <IconWrapperStyled
                isActive={showCuratorMenu}
                data-tooltip={tt('post_editor.payout_hint')}
                onClick={this.onCuratorClick}
              >
                <Icon name="editor-k" />
              </IconWrapperStyled>
              {showCuratorMenu ? this.renderCurationMenu() : null}
            </ButtonContainer>
          ) : null} */}
          <ButtonContainer ref={this.payoutContainer}>
            <IconWrapperStyled
              isActive={showPayoutMenu}
              data-tooltip={tt('post_editor.payout_hint')}
              onClick={this.onPayoutClick}
            >
              <Icon name="editor-coin" />
            </IconWrapperStyled>
            {showPayoutMenu ? this.renderPayoutMenu() : null}
          </ButtonContainer>
          <ButtonContainer>
            <IconWrapperStyled
              isWarning={nsfw}
              data-tooltip={tt('post_editor.nsfw_hint')}
              onClick={onNsfwClick}
            >
              <Icon name="editor-plus-18" />
            </IconWrapperStyled>
          </ButtonContainer>
        </DesktopWrapper>
        <MobileWrapper>
          <PayoutLabel>{tt('post_editor.set_payout_type')}</PayoutLabel>
          <StyledRadioGroup
            disabled={editMode}
            options={PAYOUT_OPTIONS.map(({ id, title, hint }) => ({
              id,
              title: tt(title),
              hint: hint ? tt(hint) : null,
            }))}
            value={payoutType}
            onChange={this.onPayoutModeChange}
          />
        </MobileWrapper>
        <MobileWrapper>
          <NsfwWrapper>
            <MobileOption>
              <Icon name="editor-plus-18" />
              <MobileOptionTitle>{tt('post_editor.nsfw_content')}</MobileOptionTitle>
            </MobileOption>
            <Switcher value={nsfw} onChange={onNsfwClick} />
          </NsfwWrapper>
        </MobileWrapper>
        {/* {showCurationPercent ? (
          <MobileWrapper>{this.renderCurationPercentSlider(true)}</MobileWrapper>
        ) : null} */}
      </Wrapper>
    );
  }
}
