// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';
import * as ChangesActions from '../Changes.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { Field, actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';
import classes from './CommitBox.css';

// Sub Components
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import Button from 'app/renderer/main/components/Buttons/Button/Button.jsx';
import Editor from 'app/renderer/main/modules/Editor/Editor.jsx';

import { MdDone } from 'react-icons/lib/md';
import { MentionsInput, Mention } from 'react-mentions';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  showTaskCommitModal(){
    this.props.ModalActions.showModal({
      modalType: 'TASK_COMMIT',
      modalProps: {
        projectId: this.props.project._id
      },
      modalConfirm: ChangesActions.mentionTasks({projectId: this.props.project._id}) // mentions value is assigned inside the modal
    })
  },
  render() {
    const { entityModel, changes } = this.props;
    return (
      <div className="p-15">
        <Field model={`changes.${this.props.project._id}.summary`}>
          <input className={classes.input} type="text" placeholder="Summary"/>
        </Field>
        <Editor
          model={`${entityModel}.description`}
          value={changes.description}
          className={classes.description}/>
        <div className="layout-row layout-align-start-center">
          <a className="link-primary" onClick={this.showTaskCommitModal}>
            <MdDone size="16" style={{marginRight: '3px', marginBottom: '2px'}}/>
            Add related tasks
          </a>
          <div className="flex"></div>
          <Button onClick={this.props.commitFn} className="primary">Add Commit</Button>
        </div>
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);


//          <IconButton ><MdDone size="22"/>Add Commit Message</IconButton>