import * as cn from 'classnames'
import * as React from 'react'
import * as s from './PipelineGraphSidebarWidget.scss'

export const PipelineGraphSidebarWidget = () => {
  return (
    <div className={ cn(s.sidebarWidget, 'layout-column', 'layout-align-center-center') }>
      <div
        className={ cn(s.icon, 'layout-column', 'layout-align-center-center') }
        draggable
        onDragStart={ (event) => {
          event.dataTransfer.setData('storm-diagram-node', JSON.stringify({ nodeType: 'some_type' }))
        } }
      >
        W
      </div>
      <div>Chron Trigger</div>
    </div>
  )
}
