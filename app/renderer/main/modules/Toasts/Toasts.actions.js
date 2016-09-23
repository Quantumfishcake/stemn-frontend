//import getUuid from '../../../../shared/helpers/getUuid.js';
//
//export function show({type, title, options, actions}) {
//  return {
//    type: 'TOAST/SHOW',
//    payload: {
//      id: getUuid(),
//      type, // 'error' || default
//      title,
//      options,
//      actions
//      /*************************
//      actions: [
//        {
//          text: 'Undo',
//          action: reduxAction
//        }
//      ]
//      *************************/
//
//    }
//  };
//}

//export function hide({id}){
//  return {
//    type: 'TOAST/HIDE',
//    payload: {
//      id,
//    }
//  };
//}


import getUuid from '../../../../shared/helpers/getUuid.js';
import Promise from 'bluebird';

export function showPromise({type, title, options, actions}) {
  return (dispatch) => {
    return new Promise((confirm, reject) => {
      dispatch(show({type, title, options, actions, confirm, reject}))
    })
  }
}

export function show({type, title, options, actions, confirm, reject}) {
  console.log({type, title, options, actions, confirm, reject});
  return {
    type: 'TOAST/SHOW',
    payload: {
      id: getUuid(),
      type, // 'error' || default
      title,
      options,
      actions,
      confirm,
      reject
    }
  };
}

export function hide({id}){
  return {
    type: 'TOAST/HIDE',
    payload: {
      id,
    }
  };
}