import React, { Component } from 'react'
import moment from 'moment'
import classes from './PipelineRow.scss'
import classNames from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import PipelineMiniMap from '../PipelineMiniMap'

const prefixZero = num => (num < 10 ? `0${num}` : num)
const diffTimes = (start, end) => {
  const duration = moment.duration(moment(end).diff(moment(start)))
  return `${prefixZero(duration.minutes())}:${prefixZero(duration.seconds())}s`
}

export default class ThreadRow extends Component {
  render() {
    const { pipeline, className } = this.props

    if (pipeline && pipeline.data) {
      const pipelineRouteParams = { 
        projectId: pipeline.data.project._id,
        pipelineId: pipeline.data._id,
      }

      return (
        <div className={ classNames('layout-row layout-align-start-center', classes.row, className) }>
          <div className="layout-column flex">
            <Link
              className={ classNames(classes.title, 'text-ellipsis') }
              name="projectPipelineRoute"
              params={ pipelineRouteParams }
            >
              { pipeline.data.name }
              { pipeline.data.pipelineNumber && <span className={ classes.pipelineNumber }>&nbsp;#P{ pipeline.data.pipelineNumber }</span> }
            </Link>
            <div className={ classes.meta }>
              { pipeline.data.start && <span>Triggered {moment(pipeline.data.start).fromNow()}</span> }
              { pipeline.data.start && <span className="text-interpunct" /> }
              { pipeline.data.end && <span className="text-grey-2">Duration: { diffTimes(pipeline.data.start, pipeline.data.end) }</span> }
            </div>
          </div>
          <PipelineMiniMap pipeline={ pipeline.data }  />
          <div className={ classes.asignees }>
            <UserAvatars
              className="layout-row"
              users={ [pipeline.data.owner] }
              limit={ 3 }
              shape="square"
            />
          </div>
        </div>
      )
    }
    return null
  }
}
