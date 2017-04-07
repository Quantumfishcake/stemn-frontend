import http from 'axios'
import { homeRoute } from 'route-actions'
import { push } from 'react-router-redux'
import { shouldDownload } from '../../redux/utils'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'

const fields = {
  sm: ['name', 'picture', 'stub'],
  md: ['name', 'picture', 'stub', 'blurb', 'updated'],
  lg: ['*']
}

export const setActiveProject = ({ projectId }) => (dispatch, getState) => {
  const activeProject = getState().projects.activeProject

  if (activeProject !== projectId) {
    dispatch({
      type: 'PROJECTS/SET_ACTIVE_PROJECT',
      payload: {
        projectId
      }
    })

    if (activeProject) {
      dispatch(websocketLeaveProject({ projectId: activeProject }))
    }
  }

  dispatch(websocketJoinProject({ projectId }))
}

export const getProject = ({ projectId, size = 'lg', force }) => (dispatch, getState) => {
  const project = getState().projects[projectId]

  const existingSize = project
    ? project.dataSize
    : undefined

  if (shouldDownload(size, existingSize) || force) {
    return dispatch({
      type: 'PROJECTS/GET_PROJECT',
      httpPackage: {
        url: `/api/v1/projects`,
        method: 'GET',
        staticParams: {
          select: fields[size]
        },
        params: {
          ids: projectId
        }
      },
      meta: {
        projectId,
        size
      }
    })
  }
}

export const createProject = (project) => ({
  type: 'PROJECTS/CREATE_PROJECT',
  payload: http({
    method: 'POST',
    url: `/api/v1/projects`,
    data: project
  })
})

export const getUserProjects = ({ userId }) => ({
  type: 'PROJECTS/GET_USER_PROJECTS',
  payload: http({
    url: `/api/v1/search`,
    method: 'GET',
    params: {
      type: 'project',
      parentType: 'user',
      parentId: userId,
      size: 1000,
      published: 'both',
      select: ['name', 'picture', 'stub', 'type', 'remote', 'updated', 'blurb']
    }
  })
})

export const confirmDeleteProject = ({ projectId, name }) => {
  return ModalActions.showConfirm({
    message: 'Deleting a project is permanent. You will not be able to undo this.<br/><br/> Note: All your Stemn data (such as commits and tasks) will be deleted. Your files will remain in your cloud provider.',
    confirmValue: name,
    confirmPlaceholder: 'Please type in the name of this project to confirm.',
    modalConfirm: {
      type: 'ALIASED',
      aliased: true,
      payload: {
        functionAlias: 'ProjectsActions.deleteProject',
        functionInputs: { projectId }
      }
    }
  })
}

export const deleteProject = ({ projectId }) => {
  return (dispatch) => {
    dispatch({
      type: 'PROJECTS/DELETE_PROJECT',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/projects/${projectId}`
      })
      .then((response) => dispatch(push(homeRoute()))),
      meta: {
        projectId
      }
    })
  }
}

export const saveProject = ({ project }) => ({
  type: 'PROJECTS/SAVE_PROJECT',
  payload: http({
    method: 'PUT',
    url: `/api/v1/projects/${project._id}`,
    data: project
  }),
  meta: {
    projectId: project._id
  }
})

export const addField = ({ projectId, field }) => ({
  type: 'PROJECTS/ADD_FIELD',
  payload: {
    projectId,
    field
  }
})

export const removeField = ({ projectId, fieldId }) => ({
  type: 'PROJECTS/REMOVE_FIELD',
  payload: {
    projectId,
    fieldId
  }
})

export const changeUserPermissions = ({ projectId, userId, role }) => ({
  type: 'PROJECTS/CHANGE_USER_PERMISSIONS',
  payload: {
    projectId,
    userId,
    role
  }
})

// This will return a plain object with an alias function
// This is used in modal callbacks.
export const linkRemoteAlias = ({ id, path, prevProvider, project, projectId, provider, userId }) => !provider
  ? {
    type: 'ALIASED',
    aliased: true,
    payload: {
      functionAlias: 'ProjectsActions.unlinkRemote',
      functionInputs: {
        prevProvider,
        projectId,
        userId
      }
    }
  }
  : {
    type: 'ALIASED',
    aliased: true,
    payload: {
      functionAlias: 'ProjectsActions.linkRemote',
      functionInputs: {
        id,
        path,
        prevProvider,
        projectId,
        provider,
        userId
      }
    }
  }

// If the store is connected - we confirm the change
// Else change straight away.
export const confirmLinkRemote = ({ isConnected, id, path, prevProvider, project, projectId, provider, userId }) => (dispatch) => isConnected
  ? dispatch(ModalActions.showConfirm({
    message: 'Changing your file store <b>will delete your entire commit and change history.</b> Are you sure you want to do this? There is no going back.',
    modalConfirm: linkRemoteAlias({ id, path, prevProvider, project, projectId, provider, userId })
  }))
  : dispatch(linkRemoteAlias({ id, path, prevProvider, project, projectId, provider, userId }))

export const linkRemote = ({ projectId, provider, path, id, prevProvider, userId }) => {
  return (dispatch) => {
    const link = () => dispatch({
      type: 'PROJECTS/LINK_REMOTE',
      payload: http({
        method: 'PUT',
        url: `/api/v1/sync/link/${projectId}/${provider}`,
        params: {
          path: path,
          id: id
        }
      }),
      meta: {
        cacheKey: projectId
      }
    })
    const unlink = () => dispatch({
      type: 'PROJECTS/UNLINK_REMOTE',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/sync/link/${projectId}/${prevProvider}`
      }),
      meta: {
        cacheKey: projectId
      }
    })
    const updateProject = () => dispatch(getProject({projectId}))
    const updateUserProjects = () => dispatch(getUserProjects({userId}))
    const projectUpdates = () => Promise.all([updateProject(), updateUserProjects()])

    return prevProvider
      ? unlink().then(link).then(projectUpdates)
      : link().then(projectUpdates)
  }
}

export const unlinkRemote = ({ projectId, prevProvider }) => {
  return (dispatch) => {
    dispatch({
      type: 'PROJECTS/UNLINK_REMOTE',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/sync/link/${projectId}/${prevProvider}`
      }).then(response => {
        dispatch(getProject({projectId}))
      }),
      meta: {
        cacheKey: projectId
      }
    })
  }
}

export const websocketJoinProject = ({ projectId }) => ({
  type: 'PROJECTS/WEBSOCKET_JOIN_PROJECT',
  websocket: true,
  payload: {
    type: 'ROOM/JOIN',
    payload: {
      room: projectId,
      type: 'project'
    }
  }
})

export const websocketLeaveProject = ({ projectId }) => ({
  type: 'PROJECTS/WEBSOCKET_LEAVE_PROJECT',
  websocket: true,
  payload: {
    type: 'ROOM/LEAVE',
    payload: {
      room: projectId,
      type: 'project'
    }
  }
})
