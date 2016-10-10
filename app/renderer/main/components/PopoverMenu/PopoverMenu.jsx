import React from 'react';
import Popover from 'app/renderer/assets/other/react-popup';

export default React.createClass({
  getInitialState () {
    return {
      isOpen: false,
    }
  },
  toggleDelayTime: 200,
  toggleDelayTimeout: null,
  toggleDelay (toState){
    clearTimeout(this.toggleDelayTimeout);
    this.toggleDelayTimeout = setTimeout(()=>{
      this.toggle(toState);
    }, this.toggleDelayTime)
  },
  toggle (toState) {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  },
  render() {
    const { preferPlace, trigger, disableClickClose, children, className } = this.props;

    const triggerMap = {
      hover          : {
        onMouseEnter : () => {this.toggle(true)},
        onMouseLeave : () => {this.toggle(false)}
      },
      hoverDelay     : {
        onMouseEnter : () => {this.toggleDelay(true)},
        onMouseLeave : () => {this.toggleDelay(false)}
      },
      click          : {
        onClick      : () => {this.toggle(null)}
      }
    };

    const contentMap = {
      hover          : {},
      hoverDelay     : {
        onMouseEnter : () => {this.toggleDelay(true)},
        onMouseLeave : () => {this.toggleDelay(false)},
      },
      click          : {
        onClick      : () => {disableClickClose ? null : this.toggle(false)}
      }
    }

    const triggerProps = triggerMap[trigger] || triggerMap['click']; // Default to click
    const contentProps = contentMap[trigger] || contentMap['click']; // Default to click

    return (
      <Popover
        isOpen={this.state.isOpen}
        body={React.cloneElement(children[1], contentProps)}
        onOuterAction={()=>this.toggle(false)}
        preferPlace = {preferPlace || 'above'}>
        {React.cloneElement(children[0], triggerProps)}
      </Popover>
    );
  }
})
