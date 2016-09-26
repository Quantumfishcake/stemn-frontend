
export function getComment({commentId}) {
  return {
    type: 'COMMENTS/GET_COMMENT',
    httpPackage: {
      endpoint: 'api/v1/comments',
      url: `http://localhost:3000/api/v1/comments`,
      method: 'GET',
      params: {
        'ids' : commentId
      }
    },
    meta: {
      commentId
    },
  }
}

export function newComment({comment}) {
  return (dispatch) => {
    if(comment.body && comment.body.length > 0){
      dispatch({
        type: 'COMMENTS/NEW_COMMENT',
        http: true,
        payload: {
          url: `http://localhost:3000/api/v1/tasks/${comment.task}/comments`,
          method: 'POST',
          data: comment
        },
        meta: {
          taskId: comment.task
        }
      })
    }
  }
}
//        body        :  { type : String,   default : ''         },
//        task        :  { type : ObjectId, ref     : 'Task'     },
//        owner       :  { type : ObjectId, ref     : 'User'     },
//        timestamp   :  { type : Date,     default : Date.now   },
//        edited      :  { type : Date,                          },
//        reactions   : [{
//            _id     :  { type : ObjectId                       },
//            owner   :  { type : ObjectId, ref     : 'User'     },
//            type    :  { type : Number,   default : 0          }
//        }]

export function startEdit({commentId}) {
  return {
    type: 'COMMENTS/START_EDIT',
    payload: {
      commentId
    }
  }
}
export function finishEdit({commentId}) {
  return {
    type: 'COMMENTS/FINISH_EDIT',
    payload: {
      commentId
    }
  }
}

export function deleteComment({commentId}) {
  return {
    type: 'COMMENTS/DELETE',
    http: true,
    payload: {
      url: `http://localhost:3000/api/v1/comments/${commentId}`,
      method: 'DELETE'
    },
    meta: {
      commentId
    }
  }
}


export function updateComment({comment}) {
  return {
    type: 'COMMENTS/UPDATE',
    http: true,
    payload: {
      url: `http://localhost:3000/api/v1/comments/${comment._id}`,
      method: 'PUT',
      data: comment
    },
    meta: {
      commentId: comment._id
    }
  }
}
