import styled from 'styled-components';

import { overflowEllipsis } from 'utils/styles';

import Button from 'components/golos-ui/Button';

export const SubTitle = styled.p`
  margin-top: 12px;
  line-height: 20px;
  text-align: center;
  font-size: 17px;
  letter-spacing: -0.41px;
`;

export const SendButton = styled(Button)`
  margin-top: 70px;
  color: #fff;
  transition: background-color 0.3s;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    color: #fff;
    background-color: #0e69ff;
  }
`;

export const BackButton = styled(Button)`
  margin-top: 12px;
  transition: border-color 0.3s;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    color: #393636;
    background-color: #fff !important;
    border: 1px solid #c0c0c0;
  }
`;

export const ErrorText = styled.span`
  position: absolute;
  bottom: -36px;
  max-width: 100%;
  line-height: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.errorTextRed};
  ${overflowEllipsis};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 20px;
  font-size: 17px;
  letter-spacing: -0.41px;

  ${overflowEllipsis};
`;

export const Circle = styled.div`
  width: 160px;
  height: 160px;
  margin-top: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.contextWhite};
`;

export const LastScreenTitle = styled.h3`
  margin-top: 24px;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.41px;
  text-align: center;
`;

export const LastScreenSubTitle = styled.p`
  margin-top: 12px;
  font-size: 15px;
  letter-spacing: -0.41px;
  text-align: center;
  color: ${({ theme }) => theme.colors.contextGrey};
`;
