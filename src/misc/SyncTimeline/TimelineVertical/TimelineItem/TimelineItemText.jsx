import React, { Component, PropTypes } from 'react';
import Link from 'stemn-shared/misc/Router/Link'
import TaskLabelDots from 'stemn-shared/misc/Tasks/TaskLabelDots/TaskLabelDots.jsx'
import pluralise from 'stemn-shared/utils/strings/pluralise'

const eventTextMap = {
  uncompleted: (item, type, entity) => <span>re-opened this task</span>,
  addAsignee: (item, type, entity) => <span>was assigned to this task</span>,
  removeAsignee : (item, type, entity) => <span>was removed from assignees</span>,
  revision: (item, type, entity) => {
    return <span>modified this file.</span>
  },
  commit: (item, type, entity) => {
    const params = {
      projectId: item.data.project._id,
      commitId: item._id
    }
    if (type === 'file') {
      return (
        <span>
          added this file to commit:
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
        </span>
      )
    } else if (type === 'feed') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
          to
          <Link name="projectRoute" params={ params }>{ item.data.project.name || 'Untitled Project' }</Link>
        </span>
      )
    } else if (type === 'project' || type === 'user') {
      return (
        <span>
          added a commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
          containing { pluralise(item.data.items.length, 'revision') }
        </span>
      )
    } else if (type === 'task') {
      return (
        <span>
          referenced this thread in commit
          <Link name="commitRoute" params={ params }>{ item.data.summary }</Link>
        </span>
      )
    }
  },
  completed: (item, type, entity) => {
    if (item.data.summary) {
      const params = {
        projectId: item.data.project._id,
        commitId: item.commit._id
      };
      return <span>
        marked this as complete in commit
        <Link
          className="link-primary"
          closeModals
          name="commitRoute"
          params={ params }
          scope="main"
          show
        >
          &nbsp;{ item.data.summary }
        </Link>
      </span>
    }
    else{
      return <span>marked this as complete</span>
    }
  },
  changedLabels: (item, type, entity) => {
    return (
      <span>
        { item.data.addedLabels && item.data.addedLabels.length > 0
          ? <span>
              added the&nbsp;
              <TaskLabelDots
                labels={item.data.addedLabels}
                labelInfo={entity.data.labels}
                tag
              />
              &nbsp;{ item.data.addedLabels.length == 1 ? 'label' : 'labels' }
            </span>
          : null }
        { item.data.addedLabels && item.data.removedLabels && item.data.addedLabels.length > 0 && item.data.removedLabels.length>0
          ? <span>&nbsp;and&nbsp;</span>
          : null }
        { item.data.removedLabels && item.data.removedLabels.length > 0
          ? <span>
              removed the&nbsp;
              <TaskLabelDots
                labels={ item.data.removedLabels }
                labelInfo={ entity.data.labels }
                tag
              />
              &nbsp;{item.data.removedLabels.length == 1 ? 'label' : 'labels'}
            </span>
          : null }
      </span>
    )
  },
}

export default class TimelineItemText extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    item: PropTypes.object,
    entity: PropTypes.object,
  }
  render() {
    const { item, type, entity } = this.props
    return eventTextMap[item.event]
      ? eventTextMap[item.event](item, type, entity)
      : <span>Unknown Event Type</span>
  }
};
