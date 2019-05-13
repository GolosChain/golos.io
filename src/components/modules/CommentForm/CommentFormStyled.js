import styled from 'styled-components';
import is from 'styled-is';

export const PreviewButtonWrapper = styled.div`
  z-index: 2;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(40px);

  ${is('emptyBody')`
    display: none;
  `};

  ${is('isStatic')`
    position: static;
    transform: translateX(0);
  `};
`;

export const ReplyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 0 8px 0;
  margin-right: 18px;
`;

export const CommentFooterWrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  margin-top: 20px;
  z-index: 1;
  user-select: none;
`;

export const CommentLoader = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  color: #999;
  pointer-events: none;
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: 0.3s;
`;

export const WorkArea = styled.div`
  position: relative;
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
`;
