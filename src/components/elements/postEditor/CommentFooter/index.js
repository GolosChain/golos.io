import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import tt from 'counterpart';
import Button from 'components/elements/common/Button';
import Hint from 'components/elements/common/Hint';
import './index.scss';

export default class CommentFooter extends React.PureComponent {
  static propTypes = {
    editMode: PropTypes.bool,
    postDisabled: PropTypes.bool,
    onPostClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
  };

  rootRef = createRef();

  state = {
    temporaryErrorText: null,
  };

  componentDidMount() {
    this.setState({
      multiLine: this.rootRef.current.clientWidth > 950,
    });
  }

  componentWillUnmount() {
    clearTimeout(this._temporaryErrorTimeout);
  }

  showPostError(errorText) {
    clearTimeout(this._temporaryErrorTimeout);

    this.setState({
      temporaryErrorText: errorText,
    });

    this._temporaryErrorTimeout = setTimeout(() => {
      this.setState({
        temporaryErrorText: null,
      });
    }, 5000);
  }

  render() {
    const { editMode, postDisabled } = this.props;
    const { temporaryErrorText } = this.state;

    return (
      <div
        className={cn('CommentFooter', {
          CommentFooter_edit: editMode,
        })}
        ref={this.rootRef}
      >
        <div className="CommentFooter__line">
          <div className="CommentFooter__buttons">
            <div className="CommentFooter__button">
              {temporaryErrorText ? <Hint error>{temporaryErrorText}</Hint> : null}
              <Button
                small
                primary
                disabled={postDisabled}
                className="CommentFooter__button-element"
                onClick={this.props.onPostClick}
              >
                {editMode ? tt('g.update') : tt('g.reply')}
              </Button>
            </div>
            <div className="CommentFooter__button">
              <Button
                small
                className="CommentFooter__button-element"
                onClick={this.props.onCancelClick}
              >
                {tt('g.cancel')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
