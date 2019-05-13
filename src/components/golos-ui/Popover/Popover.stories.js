import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Popover from './Popover';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const ButtonWrapper = styled(extend)`
  position: relative;
  overflow: unset;
`;

const Content = styled.div`
  position: relative;
  width: 100px;
  height: 50px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

let downPopover = {};
let upPopover = {};

storiesOf('Golos UI/Popover', module)
  .add('default', () => (
    <ButtonWrapper onClick={() => downPopover.open()}>
      Open
      <Popover opened ref={ref => (downPopover = ref)}>
        <Content>Down</Content>
      </Popover>
    </ButtonWrapper>
  ))
  .add('up', () => (
    <ButtonWrapper onClick={() => upPopover.open()}>
      Open
      <Popover position="top" opened ref={ref => (upPopover = ref)}>
        <Content>Up</Content>
      </Popover>
    </ButtonWrapper>
  ));
