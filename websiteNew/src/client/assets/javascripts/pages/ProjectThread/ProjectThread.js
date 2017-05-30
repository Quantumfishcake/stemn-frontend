import React, { Component } from 'react'
import moment from 'moment'
import classes from './ProjectThread.css'
import classNames from 'classnames'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Tag from 'stemn-shared/misc/Tags/Tag'
import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker'
import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx'
import MdDone from 'react-icons/md/done'
import MdAdd from 'react-icons/md/add'
import MdAccessTime from 'react-icons/md/access-time'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import Input from 'stemn-shared/misc/Input/Input/Input'
import LabelSelect from 'stemn-shared/misc/Threads/LabelSelect/LabelSelect'
import ThreadTimelineEmpty from 'stemn-shared/misc/Threads/ThreadTimelineEmpty'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import DueDate from 'stemn-shared/misc/Threads/ThreadDueDate'
import { permissionsIsMin } from 'stemn-shared/misc/Auth/Auth.utils'
import { get, has } from 'lodash'
import { Helmet } from "react-helmet"

export default class ProjectThread extends Component {
  updateThread = () => {
    setTimeout(() => this.props.updateThread({
      task: this.props.task.data
    }), 1);
  }
  dropdownOptions = [{
    value: undefined,
    name: 'Status: Open',
  }, {
    value: true,
    name: 'Status: Closed',
  }]
  sidebarEdit = () => {
    const { task, project, board, taskModel } = this.props
    const group = board.data.groups.find(group => group._id === task.data.group)

    const groupOptions = board.data.groups.map(group => ({
      value: group._id,
      name: group.name,
    }))

    const routeParams = {
      projectId: project.data._id,
    }

    return (
      <Col className="flex-gt-xs-30 flex-order-xs-0">
        <div className={ classes.panel }>
          <div className="text-mini-caps">
            Groups
          </div>
          <SimpleIconButton
            name="projectSettingsThreadsRoute"
            params={ routeParams }
            className={ classes.miniButton }
            title="Group Settings"
          >
            <MdAdd size={ 16 }/>
          </SimpleIconButton>
          <PopoverDropdown
            options={ groupOptions }
            onChange={ this.updateThread }
            value={ task.data.group }
            model={ `${taskModel}.data.group` }
            style={ { width: '100%' } }
          >
            Group:&nbsp;
          </PopoverDropdown>
        </div>
        <div className={ classes.panel }>
          <div className="text-mini-caps">Due Date</div>
           <DatePicker
            model={ `${taskModel}.data.due` }
            onChange={ this.updateThread }
            value={ task.data.due }
          />
        </div>
        <div className={ classes.panel }>
          <div className="text-mini-caps">Labels</div>
          <SimpleIconButton
            name="projectSettingsThreadsRoute"
            params={ routeParams }
            className={ classes.miniButton }
            title="Group Settings"
          >
            <MdAdd size={ 16 }/>
          </SimpleIconButton>
          <LabelSelect
            model={ `${taskModel}.data.labels` }
            value={ task.data.labels }
            onChange={ this.updateThread }
            labelInfo={ board.data.labels }
          />
        </div>
        <div className={ classes.panel }>
          <div className="text-mini-caps">Assigned Users</div>
          <SimpleIconButton
            name="projectSettingsTeamRoute"
            params={ routeParams }
            className={ classes.miniButton }
            title="Group Settings"
          >
            <MdAdd size={ 16 }/>
          </SimpleIconButton>
          <UserSelect
            model={ `${taskModel}.data.users` }
            onChange={ this.updateThread }
            value={ task.data.users }
            users={ project.data.team }
          />
        </div>
      </Col>
    )
  }
  sidebarNonEdit = () => {
    const { task, board } = this.props
    const group = board.data.groups.find(group => group._id === task.data.group)

    const taskRouteParams = {
      projectId: board.data.project,
    }

    return (
      <Col className="flex-gt-xs-30 flex-order-xs-0">
        <div className={ classes.panel }>
          <div className="text-mini-caps">Group</div>
          { group.name }
        </div>
        { task.data.due &&
        <div className={ classes.panel }>
          <div className="text-mini-caps">Due Date</div>
          <DueDate due={ task.data.due } />
        </div> }
        { task.data.labels && task.data.labels.length > 0 &&
        <div className={ classes.panel }>
          <div className="text-mini-caps">Labels</div>
          <ThreadLabelDots
            labels={ task.data.labels }
            labelInfo={ board.data.labels }
            tag
            name="projectThreadsRoute"
            params={ taskRouteParams }
            link
          />
        </div> }
        { task.data.users.length >= 0 &&
        <div className={ classes.panel }>
          <div className="text-mini-caps">Assignees</div>
          { task.data.users.map(user => (
            <Link
              name="userRoute"
              params={ { userId: user._id } }
              className="layout-row layout-align-start-center"
            >
              <UserAvatar
                className={ classes.avatar }
                name={ user.name }
                picture={ user.picture }
                size={ 20 }
                shape='square'
              />
              <b style={{fontSize: '12px'}}>{ user.name }</b>
            </Link>
          ))}
        </div> }
      </Col>
    )
  }
  render() {
    const { task, project, board, taskModel, taskId, timeline, timelineCacheKey, location, currentUser } = this.props

    if (task && task.data && board && board.data && project && project.data ) {
      const group = board.data.groups.find(group => group._id === task.data.group)

      const userRouteParams = {
        userId: task.data.owner._id
      }
      const taskRouteParams = {
        projectId: project.data._id,
        taskId: task.data._id,
      }

      const isOwner = task.data.owner._id === currentUser._id
      const currentUserRole = get(project.data.team.find(member => member._id === currentUser._id), 'permissions.role')
      const isAdmin = currentUserRole && permissionsIsMin(currentUserRole, 'admin')
      const canEdit = isOwner || isAdmin
      const edit = canEdit && location.pathname.endsWith('/edit')

      return (
        <div>
          { has(task, 'data.name') &&
            <Helmet>
              <title>{ `Thread: ${task.data.name} by ${task.data.owner.name}` }</title>
            </Helmet>
          }
          <SubSubHeader>
          <Breadcrumbs>
            <Crumb name="projectThreadsRoute" params={ { projectId: project.data._id } } text="Threads" />
            <Crumb name="projectThreadsRoute" params={ { projectId: project.data._id } } query={ { groups: [ group._id ]} } text={ group.name } />
            <Crumb text={ task.data.name || 'Untitled Thread' } />
          </Breadcrumbs>
          <br />
            <h2 className={ classes.title }>
              { edit
              ? <Input
                  model={ `${taskModel}.data.name` }
                  className="input-plain"
                  placeholder="Thread Title"
                  value={ task.data.name }
                />
              : <span>{ task.data.name || 'Untitled Thread'}</span> }
              { edit
              ? null
              : <span className={ classes.number }>&nbsp;{ task.data.taskNumber ? `#T${task.data.taskNumber}` : null }</span> }
            </h2>
            <div className="layout-row layout-align-start-center">
              <div className={ classNames('layout-row layout-align-start-center', classes.meta) }>
                <Link
                  name="userRoute"
                  params={ userRouteParams }
                  className="layout-row layout-align-start-center"
                >
                  <UserAvatar
                    className={ classes.avatar }
                    name={ task.data.owner.name }
                    picture={ task.data.owner.picture }
                    size={ 20 }
                    shape='square'
                  />
                  <b>{ task.data.owner.name }</b>
                </Link>
                <div>&nbsp;created this thread { moment(task.data.created).fromNow() }.</div>
              </div>
              <div className="flex" />
              { canEdit &&
                <PopoverDropdown
                  value={ task.data.complete }
                  model={ `${taskModel}.data.complete` }
                  options={ this.dropdownOptions }
                  onChange={ this.updateThread }
                  style={ { margin: '0 15px' } }
                />
              }
              { !canEdit &&
                <Tag className={ task.data.complete ? 'warn': 'success' } style={{ margin: '0px'}}>
                  <MdDone size={ 20 } style={ { marginRight: '5px' } }/>
                  { task.data.complete ? 'THREAD CLOSED': 'THREAD OPEN' }
                </Tag>
              }
              { edit &&
                <Button
                  className="primary"
                  name="taskRoute"
                  params={ taskRouteParams }
                >
                  Save
                </Button>
              }
              { !edit && canEdit &&
                <Button
                  className="primary"
                  name="taskEditRoute"
                  params={ taskRouteParams }
                >
                  Edit
                </Button>
              }
            </div>
          </SubSubHeader>
          <Container style={ { marginTop: '30px', marginBottom: '60px' } }>
            <Row className="layout-xs-column layout-gt-xs-row">
              <Col className="flex flex-order-xs-1 layout-column">
                { timeline && timeline.length > 0 &&
                  <TimelineVertical
                    className={ classes.timeline }
                    items={ timeline }
                    timelineCacheKey={ timelineCacheKey }
                    entity={ board }
                    type="task"
                  />
                }
                { timeline && timeline.length == 0 &&
                  <ThreadTimelineEmpty className={ classNames('flex-gt-xs', classes.empty) } />
                }
                <CommentNew
                  taskId={ taskId }
                  timelineCacheKey={ timelineCacheKey }
                />
              </Col>
              { edit
              ? this.sidebarEdit()
              : this.sidebarNonEdit() }
            </Row>
          </Container>
        </div>
      )
    } else {
      return null
    }
  }
}




//              <Tag className="primary">
//                <MdAccessTime size={ 20 } style={ { marginRight: '5px' } }/>
//                {`Due ${ moment(task.data.due).fromNow() }`}
//              </Tag>

//
//                <div className={ classes.panel }>
//                  <div className="text-mini-caps">Related Files</div>
//                </div>
