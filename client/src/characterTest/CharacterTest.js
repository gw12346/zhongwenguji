import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
} from './characterTestActions';
import {
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  resultData
} from './characterTestReducer';
import mapSelectors from '../util/mapSelectors';
import keyHandler from '../util/keyHandler';
import noop from '../util/noop';
import style from './CharacterTest.module.scss';
import CardStackDisplay from '../card/CardStackDisplay';
import CardStackButtons from '../card/CardStackButtons';

const DISCARD_THRESHOLD = 50;
const EMPTY_CARD = { index: -1, score: NaN };

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,

    toggleDefinition: PropTypes.func,
    markCurrentKnown: PropTypes.func,
    markCurrentUnknown: PropTypes.func,
    undoDiscard: PropTypes.func,
  };

  static defaultProps = {
    currentCard: null,
    isShowDefinition: false,
    status: '',

    toggleDefinition: noop,
    markCurrentKnown: noop,
    markCurrentUnknown: noop,
    undoDiscard: noop,
  };

  componentDidMount() {
    this.keyHandler = keyHandler({
      onKeyDown: this.handleKeyDown
    });
  }

  componentWillUnmount() {
    this.keyHandler.unregister();
  }

  handleKeyDown = (key) => {
    switch (key) {
      case 'ArrowDown':
        this.props.toggleDefinition();
        break;
      case 'ArrowLeft':
        this.props.markCurrentUnknown();
        break;
      case 'ArrowRight':
        this.props.markCurrentKnown();
        break;
      case 'ArrowUp':
        this.props.undoDiscard();
        break;
      default:
        break;
    }
  };

  handleDiscardLeft = () => {
    this.props.markCurrentUnknown();
  };

  handleDiscardRight = () => {
    this.props.markCurrentKnown();
  };

  handleUndo = () => {
    this.props.undoDiscard();
  };

  handleDefinition = () => {
    this.props.toggleDefinition();
  };

  render() {
    const {
      currentCard = EMPTY_CARD,
      isShowDefinition
    } = this.props;

    return (
      <div className={cx(style.container, this.props.className)}>
        <CardStackDisplay
          card={currentCard}
          showDefinition={isShowDefinition}
          discardThreshold={DISCARD_THRESHOLD}
          onDiscardLeft={this.handleDiscardLeft}
          onDiscardRight={this.handleDiscardRight}
        />
        <CardStackButtons
          onUndo={this.handleUndo}
          onDefinition={this.handleDefinition}
          showDefinition={isShowDefinition}
        />
      </div>
    );
  }
}

export { CharacterTest as Pure };

export default connect(mapSelectors({
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  resultData
}), {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
})(CharacterTest);

