import React, { Component, PropTypes } from 'react';

import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';
import TaskLabelsEdit from 'stemn-shared/misc/Tasks/TaskLabelsEdit/TaskLabelsEdit.jsx'
import TaskGroupsEdit from 'stemn-shared/misc/Tasks/TaskGroupsEdit'

export default class TasksSettings extends Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    boardModel: PropTypes.string.isRequired,
    saveBoard: PropTypes.func.isRequired,
  }
  render() {
    const { boardModel, board, saveBoard } = this.props;
    return(
      <div>
        <h3>Thread Groups</h3>
        <p>Groups are used to categorize your threads. A thread can only be part of 1 group at any given time. If you delete a group, all child threads will be removed.</p>
        <TaskGroupsEdit model={ `${boardModel}.forms.groups` } value={ board.data.groups } />
        <br />
        <br />
        <h3>Thread Labels</h3>
        <p>Labels act in a similar way to Groups except a thread can have multiple labels. If you delete a label, it will be removed from all related threads.</p>
        <TaskLabelsEdit model={ `${boardModel}.forms.labels` } value={ board.data.labels } />
        <br />
        <div className="layout-row">
          <div className="flex"></div>
          <ProgressButton
            className="primary"
            onClick={ saveBoard }
            loading={ board.savePending }>
            Save
          </ProgressButton>
        </div>
      </div>
    );
  }
}
