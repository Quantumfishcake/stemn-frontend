<<<<<<< HEAD
module.exports=webpackJsonp([4],{0:function(e,t,a){a(584),e.exports=a(1630)},1630:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function l(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,a){function n(l,r){try{var i=t[l](r),u=i.value}catch(e){return void a(e)}return i.done?void e(u):Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)})}return n("next")})}}var r=function(){var e=l(regeneratorRuntime.mark(function e(){var t,a,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,M.get("sessionState");case 2:t=e.sent,a=(0,p.default)(t),n=(0,f.syncHistoryWithStore)(c.hashHistory,a),i.ipcRenderer.on("redux-action",function(e,t){a.dispatch(t)}),a.dispatch((0,x.initHttpHeaders)()),(0,s.render)(d.default.createElement(o.Provider,{store:a},d.default.createElement(c.Router,{history:n,routes:(0,h.default)(a)})),document.getElementById("root"));case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}();a(580);var i=a(56),u=a(1),d=n(u),s=a(25),o=a(5),c=a(26),f=a(62),m=a(583),p=n(m),v=a(1633),h=n(v),y=a(482),E=n(y),_=a(420),g=n(_),x=a(88),M=(0,E.default)(g.default);r()},1631:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function l(e){var t=e.children;return i.default.createElement("div",{className:"layout-column flex"},t)}Object.defineProperty(t,"__esModule",{value:!0});var r=a(1),i=n(r),u=a(315);n(u);l.propTypes={children:r.PropTypes.element.isRequired},t.default=l,e.exports=t.default},1632:function(e,t,a){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function l(e){return e&&e.__esModule?e:{default:e}}function r(e,t){var a=e.files,n=e.syncTimeline,l=t.params,r=l.fileId+"-"+l.revisionId;return{fileMeta:a.fileMeta[r],syncTimeline:n[l.fileId]}}function i(e){return{filesActions:(0,u.bindActionCreators)(h,e),syncTimelineActions:(0,u.bindActionCreators)(E,e)}}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=t.InnerComponent=void 0;var u=a(6),d=a(5),s=a(1),o=l(s),c=a(4),f=(l(c),a(15)),m=a(21),p=l(m),v=a(910),h=n(v),y=a(930),E=n(y),_=a(575),g=l(_),x=a(324),M=l(x),b=a(256),I=l(b),N=a(908),S=l(N),T=a(576),w=l(T),C=a(38),j=l(C),P=a(1650),k=l(P),R=a(931),O=l(R),A=a(1651),H=l(A),q=a(1908),z=l(q),B=t.InnerComponent=o.default.createClass({displayName:"InnerComponent",getInitialState:function(){return{selected1:this.props.syncTimeline.data[0],selected2:null,lastSelected:1,mode:"single"}},onSelect:function(e){"single"==this.state.mode?this.setState({selected1:e,lastSelected:1}):1==this.state.lastSelected?this.setState({selected2:e,lastSelected:2}):this.setState({selected1:e,lastSelected:1})},changeMode:function(e){this.setState({mode:e})},clickCrumb:function(e){var t=e.file;console.log(t)},isSelected:function(e){var t=!!(0,f.has)(this.state,"selected1.data.revisionId")&&e.data.revisionId==this.state.selected1.data.revisionId,a=!!(0,f.has)(this.state,"selected2.data.revisionId")&&e.data.revisionId==this.state.selected2.data.revisionId;return"single"==this.state.mode?t:t||a},render:function(){var e=this.props,t=e.fileMeta,a=e.syncTimeline,n=this.state,l=n.mode,r=n.selected1,i=n.selected2,u="single"==l?[r]:(0,f.orderBy)([r,i],function(e){return new Date(e.timestamp).getTime()}),d=u[0].data,s=u[1]?u[1].data:void 0,c=a&&a.data?a.data.filter(function(e){return"revision"==e.event}):[];return o.default.createElement("div",{className:"layout-column flex"},o.default.createElement("div",{className:z.default.header+" layout-row layout-align-start-center"},o.default.createElement("div",{className:"flex"},t&&t.data?o.default.createElement(S.default,{meta:t.data,clickFn:this.clickCrumb}):""),o.default.createElement(w.default,{file1:d,file2:s,revisions:c,mode:l,changeMode:this.changeMode})),o.default.createElement("div",{className:"layout-row flex"},o.default.createElement("div",{className:"layout-column flex"},o.default.createElement(g.default,{project:t.data.project,file1:d,file2:s,mode:l}),o.default.createElement(M.default,{className:z.default.timeline,items:c,onSelect:this.onSelect,isSelected:this.isSelected,preferPlace:"above"})),o.default.createElement(I.default,{side:"left",width:"450",widthRange:[0,450],className:"layout-column"},o.default.createElement("aside",{className:z.default.sidebar+" flex",style:{minWidth:"400px",overflowY:"auto"}},o.default.createElement(H.default,{style:{marginBottom:"15px"}},"Meta"),o.default.createElement(O.default,null,o.default.createElement("tr",null,o.default.createElement("td",null,"Name"),o.default.createElement("td",null,t.data.name)),o.default.createElement("tr",null,o.default.createElement("td",null,"Size"),o.default.createElement("td",null,t.data.size)),o.default.createElement("tr",null,o.default.createElement("td",null,"Last modified"),o.default.createElement("td",null,(0,p.default)(t.data.modified).fromNow())),o.default.createElement("tr",null,o.default.createElement("td",null,"Revisions"),o.default.createElement("td",null,c.length))),o.default.createElement(H.default,{style:{margin:"30px 0"}},"Timeline"),o.default.createElement(k.default,{items:a&&a.data?a.data:[]})))))}}),L=t.Component=o.default.createClass({displayName:"Component",onMount:function(e,t){var a=e.params,n=a.revisionId,l=a.fileId,r=a.projectId;e.fileMeta&&(e.fileMeta.data||e.fileMeta.loading)||e.filesActions.getMeta({fileId:l,revisionId:n}),e.syncTimeline&&(e.syncTimeline.data||e.syncTimeline.loading)||e.syncTimelineActions.fetchTimeline({projectId:r,fileId:l})},componentWillMount:function(){this.onMount(this.props)},render:function(){var e=this.props,t=e.fileMeta,a=e.syncTimeline;return o.default.createElement("div",{className:"layout-column flex"},t&&a&&a.data?o.default.createElement(B,{fileMeta:t,syncTimeline:a}):null,o.default.createElement(j.default,{show:!t||!a}))}});t.default=(0,d.connect)(r,i)(L)},1633:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(26),u=a(1631),d=n(u),s=a(1632),o=n(s);t.default=function(e){return r.default.createElement(i.Route,{component:d.default,path:"/"},r.default.createElement(i.Route,{path:"/preview/:projectId/:fileId/:revisionId",component:o.default}))},e.exports=t.default},1649:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(21),u=n(i),d=a(4),s=(n(d),a(965)),o=n(s),c=a(75),f=n(c),m=a(573),p=n(m),v=a(920),h=n(v),y=a(26),E={revision:function(e){return r.default.createElement("span",null,"modified this file.")},commit:function(e){var t={pathname:"/project/"+e.data.project+"/feed",query:{item:e.data._id}};return r.default.createElement("span",null,"added this file to commit: ",r.default.createElement(y.Link,{to:t,className:"link-primary"},e.data.summary))}},_=function(e){return E[e.event]?E[e.event](e):r.default.createElement("span",null,"Unknown Event Type")};t.default=r.default.createClass({displayName:"TimelineItem",render:function(){var e=this.props.item;return"comment"==e.event?r.default.createElement(p.default,{commentId:e.comment}):r.default.createElement(h.default,{style:{marginLeft:"5px"}},r.default.createElement("div",{className:"layout-row layout-align-start-center flex"},r.default.createElement("div",{className:o.default.avatar},r.default.createElement(f.default,{picture:e.user.picture,size:"25px",shape:"square"})),r.default.createElement("div",null,r.default.createElement("b",null,e.user.name," "),r.default.createElement("span",{className:"text-grey-3",style:{lineHeight:"1.5em"}},_(e)," - ",(0,u.default)(e.timestamp).fromNow()))))}}),e.exports=t.default},1650:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(4),u=(n(i),a(1649)),d=n(u);t.default=r.default.createClass({displayName:"TimelineVertical",render:function(){var e=this.props.items;return r.default.createElement("div",null,e.map(function(e){return r.default.createElement(d.default,{key:e._id,item:e})}))}}),e.exports=t.default},1651:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(1911),u=n(i);t.default=r.default.createClass({displayName:"SectionTitle",render:function(){var e=this.props,t=e.children,a=e.style;return r.default.createElement("div",{className:u.default.section+" layout-row",style:a},r.default.createElement("div",{className:u.default.text},t))}}),e.exports=t.default},1908:function(e,t){e.exports={primary:"rgb(68, 154, 211)",border1:"rgba(0, 0, 0, 0.1)",bg1:"rgba(0, 0, 0, 0.03)",sidebar:"_🇻🇳🇮🇲🇽🇰😀🍝👼🏼",timeline:"_👔🇨🇽🐣💚🇭🇳🐶",header:"_🇮🇳🍎👴🏽🍭🚏🤗"}},1911:function(e,t){e.exports={secondary:"rgba(0, 0, 0, 0.7)",border1:"rgba(0, 0, 0, 0.1)",bg1:"rgba(0, 0, 0, 0.03)",section:"_👾🏎🛀🏾📰🖐🏼🏋🏾",text:"_👆🏿🈳🛃🍽🇭🇺👸🏻"}}});
=======
module.exports=webpackJsonp([4],{0:function(e,t,a){a(593),e.exports=a(1672)},1672:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function l(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,a){function n(l,r){try{var i=t[l](r),u=i.value}catch(e){return void a(e)}return i.done?void e(u):Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)})}return n("next")})}}var r=function(){var e=l(regeneratorRuntime.mark(function e(){var t,a,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,M.get("sessionState");case 2:t=e.sent,a=(0,p.default)(t),n=(0,f.syncHistoryWithStore)(c.hashHistory,a),i.ipcRenderer.on("redux-action",function(e,t){a.dispatch(t)}),a.dispatch((0,x.initHttpHeaders)()),(0,s.render)(d.default.createElement(o.Provider,{store:a},d.default.createElement(c.Router,{history:n,routes:(0,h.default)(a)})),document.getElementById("root"));case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}();a(589);var i=a(56),u=a(1),d=n(u),s=a(25),o=a(5),c=a(26),f=a(62),m=a(592),p=n(m),v=a(1675),h=n(v),y=a(436),E=n(y),_=a(375),g=n(_),x=a(88),M=(0,E.default)(g.default);r()},1673:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function l(e){var t=e.children;return i.default.createElement("div",{className:"layout-column flex"},t)}Object.defineProperty(t,"__esModule",{value:!0});var r=a(1),i=n(r),u=a(319);n(u);l.propTypes={children:r.PropTypes.element.isRequired},t.default=l,e.exports=t.default},1674:function(e,t,a){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function l(e){return e&&e.__esModule?e:{default:e}}function r(e,t){var a=e.files,n=e.syncTimeline,l=t.params,r=l.fileId+"-"+l.revisionId;return{fileMeta:a.fileMeta[r],syncTimeline:n[l.fileId]}}function i(e){return{filesActions:(0,u.bindActionCreators)(h,e),syncTimelineActions:(0,u.bindActionCreators)(E,e)}}Object.defineProperty(t,"__esModule",{value:!0}),t.Component=t.InnerComponent=void 0;var u=a(6),d=a(5),s=a(1),o=l(s),c=a(4),f=(l(c),a(15)),m=a(22),p=l(m),v=a(923),h=n(v),y=a(943),E=n(y),_=a(584),g=l(_),x=a(328),M=l(x),b=a(257),I=l(b),N=a(921),S=l(N),T=a(585),w=l(T),C=a(37),j=l(C),P=a(1692),k=l(P),R=a(944),O=l(R),A=a(1693),H=l(A),q=a(1950),z=l(q),B=t.InnerComponent=o.default.createClass({displayName:"InnerComponent",getInitialState:function(){return{selected1:this.props.syncTimeline.data[0],selected2:null,lastSelected:1,mode:"single"}},onSelect:function(e){"single"==this.state.mode?this.setState({selected1:e,lastSelected:1}):1==this.state.lastSelected?this.setState({selected2:e,lastSelected:2}):this.setState({selected1:e,lastSelected:1})},changeMode:function(e){this.setState({mode:e})},clickCrumb:function(e){var t=e.file;console.log(t)},isSelected:function(e){var t=!!(0,f.has)(this.state,"selected1.data.revisionId")&&e.data.revisionId==this.state.selected1.data.revisionId,a=!!(0,f.has)(this.state,"selected2.data.revisionId")&&e.data.revisionId==this.state.selected2.data.revisionId;return"single"==this.state.mode?t:t||a},render:function(){var e=this.props,t=e.fileMeta,a=e.syncTimeline,n=this.state,l=n.mode,r=n.selected1,i=n.selected2,u="single"==l?[r]:(0,f.orderBy)([r,i],function(e){return new Date(e.timestamp).getTime()}),d=u[0].data,s=u[1]?u[1].data:void 0,c=a&&a.data?a.data.filter(function(e){return"revision"==e.event}):[];return o.default.createElement("div",{className:"layout-column flex"},o.default.createElement("div",{className:z.default.header+" layout-row layout-align-start-center"},o.default.createElement("div",{className:"flex"},t&&t.data?o.default.createElement(S.default,{meta:t.data,clickFn:this.clickCrumb}):""),o.default.createElement(w.default,{file1:d,file2:s,revisions:c,mode:l,changeMode:this.changeMode})),o.default.createElement("div",{className:"layout-row flex"},o.default.createElement("div",{className:"layout-column flex"},o.default.createElement(g.default,{project:t.data.project,file1:d,file2:s,mode:l}),o.default.createElement(M.default,{className:z.default.timeline,items:c,onSelect:this.onSelect,isSelected:this.isSelected,preferPlace:"above"})),o.default.createElement(I.default,{side:"left",width:"450",widthRange:[0,450],className:"layout-column"},o.default.createElement("aside",{className:z.default.sidebar+" flex",style:{minWidth:"400px",overflowY:"auto"}},o.default.createElement(H.default,{style:{marginBottom:"15px"}},"Meta"),o.default.createElement(O.default,null,o.default.createElement("tr",null,o.default.createElement("td",null,"Name"),o.default.createElement("td",null,t.data.name)),o.default.createElement("tr",null,o.default.createElement("td",null,"Size"),o.default.createElement("td",null,t.data.size)),o.default.createElement("tr",null,o.default.createElement("td",null,"Last modified"),o.default.createElement("td",null,(0,p.default)(t.data.modified).fromNow())),o.default.createElement("tr",null,o.default.createElement("td",null,"Revisions"),o.default.createElement("td",null,c.length))),o.default.createElement(H.default,{style:{margin:"30px 0"}},"Timeline"),o.default.createElement(k.default,{items:a&&a.data?a.data:[]})))))}}),L=t.Component=o.default.createClass({displayName:"Component",onMount:function(e,t){var a=e.params,n=a.revisionId,l=a.fileId,r=a.projectId;e.fileMeta&&(e.fileMeta.data||e.fileMeta.loading)||e.filesActions.getMeta({fileId:l,revisionId:n}),e.syncTimeline&&(e.syncTimeline.data||e.syncTimeline.loading)||e.syncTimelineActions.fetchTimeline({projectId:r,fileId:l})},componentWillMount:function(){this.onMount(this.props)},render:function(){var e=this.props,t=e.fileMeta,a=e.syncTimeline;return o.default.createElement("div",{className:"layout-column flex"},t&&a&&a.data?o.default.createElement(B,{fileMeta:t,syncTimeline:a}):null,o.default.createElement(j.default,{show:!t||!a}))}});t.default=(0,d.connect)(r,i)(L)},1675:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(26),u=a(1673),d=n(u),s=a(1674),o=n(s);t.default=function(e){return r.default.createElement(i.Route,{component:d.default,path:"/"},r.default.createElement(i.Route,{path:"/preview/:projectId/:fileId/:revisionId",component:o.default}))},e.exports=t.default},1691:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(22),u=n(i),d=a(4),s=(n(d),a(978)),o=n(s),c=a(74),f=n(c),m=a(582),p=n(m),v=a(933),h=n(v),y=a(26),E={revision:function(e){return r.default.createElement("span",null,"modified this file.")},commit:function(e){var t={pathname:"/project/"+e.data.project+"/feed",query:{item:e.data._id}};return r.default.createElement("span",null,"added this file to commit: ",r.default.createElement(y.Link,{to:t,className:"link-primary"},e.data.summary))}},_=function(e){return E[e.event]?E[e.event](e):r.default.createElement("span",null,"Unknown Event Type")};t.default=r.default.createClass({displayName:"TimelineItem",render:function(){var e=this.props.item;return"comment"==e.event?r.default.createElement(p.default,{commentId:e.comment}):r.default.createElement(h.default,{style:{marginLeft:"5px"}},r.default.createElement("div",{className:"layout-row layout-align-start-center flex"},r.default.createElement("div",{className:o.default.avatar},r.default.createElement(f.default,{picture:e.user.picture,size:"25px",shape:"square"})),r.default.createElement("div",null,r.default.createElement("b",null,e.user.name," "),r.default.createElement("span",{className:"text-grey-3",style:{lineHeight:"1.5em"}},_(e)," - ",(0,u.default)(e.timestamp).fromNow()))))}}),e.exports=t.default},1692:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(4),u=(n(i),a(1691)),d=n(u);t.default=r.default.createClass({displayName:"TimelineVertical",render:function(){var e=this.props.items;return r.default.createElement("div",null,e.map(function(e){return r.default.createElement(d.default,{key:e._id,item:e})}))}}),e.exports=t.default},1693:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(1),r=n(l),i=a(1953),u=n(i);t.default=r.default.createClass({displayName:"SectionTitle",render:function(){var e=this.props,t=e.children,a=e.style;return r.default.createElement("div",{className:u.default.section+" layout-row",style:a},r.default.createElement("div",{className:u.default.text},t))}}),e.exports=t.default},1950:function(e,t){e.exports={primary:"rgb(68, 154, 211)",border1:"rgba(0, 0, 0, 0.1)",bg1:"rgba(0, 0, 0, 0.03)",sidebar:"_🇱🇧👮🏻‍♂️💪🙅🏾‍♂️🤾🏼‍♂️🤴🏼",timeline:"_👦🏽🔽🕦👨‍👨‍👦🏋🏼👍",header:"_👪🏻🤦🏾👩‍👩‍👧🇮🇶📒🕕"}},1953:function(e,t){e.exports={secondary:"rgba(0, 0, 0, 0.7)",border1:"rgba(0, 0, 0, 0.1)",bg1:"rgba(0, 0, 0, 0.03)",section:"_🇬💆🏿‍♀️🏙🌲🏊🏼‍♂️🚵🏽‍♀️",text:"_🇵🇸👮‍♀️👩‍💼🚵🏼‍♀️🏄🏾‍♂️🎿"}}});
>>>>>>> origin/master
