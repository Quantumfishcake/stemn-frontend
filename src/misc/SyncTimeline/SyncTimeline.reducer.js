import i from 'icepick'
import { modeled } from 'react-redux-form'

const initialState = {
  /************************************************
  [ cacheKey ] : {
    loading: false,
    selected: {},
    data: [ array of data ]
  }
  ************************************************/
}

function reducer(state, action) {
  switch (action.type) {
    case 'TIMELINE/SELECT_ITEM':
      return i.assocIn(state, [action.meta.cacheKey, 'selected'], action.payload.selected)
    case 'TIMELINE/DESELECT_ITEM':
      return i.assocIn(state, [action.meta.cacheKey, 'selected'], {})
    case 'TIMELINE/FETCH_TIMELINE_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'TIMELINE/FETCH_TIMELINE_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'TIMELINE/FETCH_TIMELINE_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'data'], action.payload.data)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()
    default:
      return state
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'syncTimeline')(state, action)
}
