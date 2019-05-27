import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import { last } from 'ramda';

import {
  MODAL_CANCEL,
  SHOW_MODAL_LOGIN,
  SHOW_MODAL_SIGNUP,
  SHOW_MODAL_BECOME_LOADER,
} from 'store/constants/modalTypes';
// import ScrollFix from 'components/ScrollFix';
import { getDynamicComponentInitialProps } from 'utils/hocs/withTabs';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 600;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  z-index: 1;
  pointer-events: none;

  &:last-child {
    z-index: 3;
  }
`;

// const ModalWrapper = styled(ScrollFix)`
const ModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;

  ${up('tablet')} {
    padding: 40px 20px;
  }

  & > * {
    pointer-events: initial;
  }

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
`;

const modalsMap = new Map([
  [SHOW_MODAL_LOGIN, dynamic(() => import('components/modals/Login'))],
  [SHOW_MODAL_SIGNUP, dynamic(() => import('components/modals/SignUp'))],
  [SHOW_MODAL_BECOME_LOADER, dynamic(() => import('components/modals/BecomeLeader'))],
]);

export default class ModalManager extends PureComponent {
  static propTypes = {
    modals: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        modalId: PropTypes.number.isRequired,
        props: PropTypes.shape({}),
      })
    ).isRequired,
    passStore: PropTypes.shape({}).isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  state = {
    propsFetchedSet: {},
  };

  modalsRefs = {};

  async componentWillReceiveProps(nextProps) {
    const { propsFetchedSet } = this.state;

    for (const { modalId, type, props } of nextProps.modals) {
      if (!propsFetchedSet[modalId] && modalsMap.has(type)) {
        const ModalComponent = modalsMap.get(type);

        getDynamicComponentInitialProps(ModalComponent, {
          store: nextProps.passStore,
          props: props || {},
        }).then(initialProps => {
          // eslint-disable-next-line no-shadow
          const { propsFetchedSet } = this.state;

          this.setState({
            propsFetchedSet: {
              ...propsFetchedSet,
              [modalId]: {
                initialProps,
              },
            },
          });
        });
      }
    }
  }

  componentDidUpdate() {
    const { modals } = this.props;
    const { propsFetchedSet } = this.state;

    const isShowDialog = modals.some(
      ({ type, modalId }) => modalsMap.has(type) && propsFetchedSet[modalId]
    );

    document.body.style.overflow = isShowDialog ? 'hidden' : '';
  }

  onBackgroundClick = async () => {
    const { closeModal, modals } = this.props;
    const { modalId } = last(modals);

    const modalRef = this.modalsRefs[modalId];

    if (modalRef && modalRef.current && modalRef.current.canClose) {
      if (!(await modalRef.current.canClose())) {
        return;
      }
    }

    closeModal(modalId, { status: MODAL_CANCEL });
  };

  getReadyDialogs() {
    const { modals } = this.props;
    const { propsFetchedSet } = this.state;

    const dialogs = [];

    for (const { type, modalId, props } of modals) {
      const ModalComponent = modalsMap.get(type);
      const modalFetchData = propsFetchedSet[modalId];

      if (ModalComponent && modalFetchData) {
        dialogs.push({
          type,
          modalId,
          props,
          ModalComponent,
          modalFetchData,
        });
      }
    }

    return dialogs;
  }

  render() {
    const { closeModal } = this.props;

    const dialogsInfo = this.getReadyDialogs();

    const dialogs = dialogsInfo.map(({ modalId, props, ModalComponent, modalFetchData }) => {
      let modalRef = this.modalsRefs[modalId];

      if (!modalRef) {
        modalRef = createRef();
        this.modalsRefs[modalId] = modalRef;
      }

      return (
        <ModalContainer key={modalId} className="scroll-container">
          <ModalWrapper>
            <ModalComponent
              {...props}
              {...modalFetchData.initialProps}
              modalId={modalId}
              forwardedRef={modalRef}
              close={result => closeModal(modalId, result)}
            />
          </ModalWrapper>
        </ModalContainer>
      );
    });

    if (dialogs.length) {
      return (
        <Wrapper>
          <ModalBackground onClick={this.onBackgroundClick} />
          {dialogs}
        </Wrapper>
      );
    }

    return null;
  }
}
