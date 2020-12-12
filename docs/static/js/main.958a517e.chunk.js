(this["webpackJsonp@material-appkit/documentation"]=this["webpackJsonp@material-appkit/documentation"]||[]).push([[0],{101:function(t,e,a){"use strict";e.a={index:"/"}},105:function(t,e,a){"use strict";var n=a(7),o=a(0),i=a(199),r=a(201),l=a(200),c=a(48),p=a(98),s=a(33),d=a(88),u=a(76),g=a(241),m=a(230),h=a(229),b=a(232),f=a(233),j=a(198),x=a(234),O=Object(p.a)((function(t){return{drawerMenuButton:{color:t.palette.common.white},drawerModal:{zIndex:"".concat(t.zIndex.appBar+1," !important")},drawerPaper:{backgroundColor:t.palette.grey[50],paddingTop:t.topbar.height,width:t.sidebar.width,zIndex:t.zIndex.appBar},listItemIcon:{marginRight:t.spacing(1),minWidth:"unset"}}}));var y=function(t){var e=O(),a=Object(o.useState)(!1),i=Object(d.a)(a,2),r=i[0],l=i[1],c=t.navLinkArrangement;return Object(n.jsxs)(o.Fragment,{children:[Object(n.jsx)(h.a,{edge:"start",className:e.drawerMenuButton,onClick:function(){l(!0)},children:Object(n.jsx)(g.a,{src:"/favicon-32x32.png"})}),Object(n.jsx)(m.a,{anchor:"left",classes:{modal:e.drawerModal,paper:e.drawerPaper},ModalProps:{keepMounted:!0},open:r,onClose:function(){l(!1)},variant:"temporary",children:Object(n.jsx)(b.a,{disablePadding:!0,children:c.map((function(t){var a={};t.path&&(a.to=t.path,a.component=u.Link);return Object(n.jsxs)(f.a,Object(s.a)(Object(s.a)({button:!0,divider:!0,onClick:function(){l(!1),t.onClick&&t.onClick()}},a),{},{children:[Object(n.jsx)(j.a,{className:e.listItemIcon,children:Object(n.jsx)(t.Icon,{})}),Object(n.jsx)(x.a,{primary:t.title})]}),t.title)}))})})]})},C=a(65),T=Object(p.a)((function(t){return{appBar:{zIndex:t.zIndex.appBar+2,justifyContent:"center",position:"relative"},progressBar:{height:2,left:0,position:"absolute",right:0,top:62},titleContainer:{display:"flex",flexDirection:"column",flex:1},toolBar:{minHeight:t.topbar.height,padding:t.spacing(0,.5,0,2)},appTitle:{color:"inherit",fontSize:t.typography.pxToRem(20),letterSpacing:0},buildLabel:{fontFamily:"monospace",fontSize:t.typography.pxToRem(11),lineHeight:1}}}));function S(t){var e=T(),a=Object(o.useContext)(C.a).loadProgress,p=t.navLinkArrangement;return Object(n.jsxs)(i.a,{className:e.appBar,color:"primary",elevation:2,position:"static",children:[Object(n.jsxs)(l.a,{className:e.toolBar,children:[Object(n.jsx)(y,{navLinkArrangement:p}),Object(n.jsx)(c.a,{className:e.appTitle,children:"Material AppKit"})]}),null!==a&&Object(n.jsx)(r.a,{className:e.progressBar})]})}S.defaultProps={navLinkArrangement:[]};e.a=S},143:function(t,e){},177:function(t){t.exports=JSON.parse('{"en-US":"English"}')},185:function(t,e,a){"use strict";a.r(e);var n=a(7),o=a(0),i=a.n(o),r=a(10),l=a.n(r),c=a(239),p=a(116),s=a(33),d=a(106),u=a(107),g=a(117),m=a(115),h=a(108),b=a.n(h),f=a(95),j=a.n(f),x=a(14),O=a(83),y=a(235),C=a(66),T=a.n(C),S=a(81),v=a(105);var R=function(t){return Object(n.jsx)(v.a,{})},k=a(65),_=a(101),E=a(111),w=a.n(E);var A=a(49),P=function(t){Object(g.a)(r,t);var e=Object(m.a)(r);function r(t){var o;return Object(d.a)(this,r),(o=e.call(this)).updateAppContext=function(t){var e=o.state.appContext,a=Object(S.filterByKeys)(e,Object.keys(t));if(!j()(a,t)){var n=Object(s.a)(Object(s.a)({},e),t);o.setState({appContext:n})}},o.layoutDidMount=function(t){o.setState({layoutConfig:t})},o.layoutWillUnmount=function(){o.setState({layoutConfig:null})},o.layoutRoutes=[{pathname:_.a.index,Component:i.a.lazy((function(){return Promise.all([a.e(3),a.e(5)]).then(a.bind(null,272))})),placeholder:Object(n.jsx)(R,{})}],o.state={layoutConfig:null,appContext:{loadProgress:null,locale:w.a.localValue("locale")||window.navigator.userLanguage||window.navigator.language||"en-US",pageTitle:null,update:o.updateAppContext}},o}return Object(u.a)(r,[{key:"componentDidMount",value:function(){var t={};A.b.forEach((function(e){t[e]=A.c[e].source}));var e=this.state.appContext.locale;A.b[e]||(e=A.a),b.a.init({currentLocale:e,locales:t,fallbackLocale:A.a})}},{key:"render",value:function(){var t=this,e=Object(s.a)(Object(s.a)({},this.state.appContext),{},{breakpoint:this.props.width});return Object(n.jsx)(k.a.Provider,{value:e,children:Object(n.jsx)(x.e,{history:T.a.history,children:Object(n.jsxs)(O.b,{children:[Object(n.jsxs)(O.a,{children:[Object(n.jsx)("link",{rel:"canonical",href:"https://admin.motostar.ca/"}),Object(n.jsx)("title",{children:this.pageTitle})]}),Object(n.jsx)(x.g,{children:this.layoutRoutes.map((function(e){return Object(n.jsx)(x.d,{path:e.pathname,render:function(a){return Object(n.jsx)(o.Suspense,{fallback:e.placeholder,children:Object(n.jsx)(e.Component,Object(s.a)(Object(s.a)({onMount:t.layoutDidMount,onUnmount:t.layoutWillUnmount},t.props),a))})}},e.pathname)}))})]})})})}},{key:"pageTitle",get:function(){var t=this.state.appContext.pageTitle,e=[];return t&&(e=Array.isArray(t)?Object(p.a)(t):[t]),e.push("Material AppKit"),e.join(" | ")}}]),r}(i.a.PureComponent),B=Object(y.a)()(P),I=a(238),N=a(236),D=a(82),L=a(112),z=a.n(L),W=a(113),F=a.n(W),M=a(46),G=Object(M.a)(),U=Object(M.a)({overrides:{MuiCssBaseline:{"@global":{html:{width:"100%",height:"100%"},body:{height:"100%",width:"100%","& > #root":{height:"100%"},"-webkitOverflowScrolling":"touch"},".pac-container":{zIndex:G.zIndex.modal+1}}},MuiFormControl:{marginNormal:{marginTop:G.spacing(1)}}},palette:{background:{default:"#fff"},primary:{main:"#3C3B6E"},secondary:{main:"#B22234"},text:{disabled:"rgba(0, 0, 0, 0.55)"}},mixins:{layout:{split:{display:"grid",gridAutoFlow:"column",gridTemplateColumns:"1fr 1fr",gridGap:16},splitStack:{display:"grid",gridAutoFlow:"row",gridTemplateColumns:"1fr",gridGap:16,[G.breakpoints.up("md")]:{gridAutoFlow:"column",gridTemplateColumns:"1fr 1fr"}}},status:{successBgColor:{backgroundColor:G.palette.success.main},infoBgColor:{backgroundColor:G.palette.info.main},warningBgColor:{backgroundColor:G.palette.warning.main},errorBgColor:{backgroundColor:G.palette.error.main},cancelledBgColor:{backgroundColor:G.palette.common.black},successColor:{color:G.palette.success.main},infoColor:{color:G.palette.info.main},warningColor:{color:G.palette.warning.main},errorColor:{color:G.palette.error.main},cancelledColor:{color:G.palette.common.black}},buttons:{deleteButton:{color:G.palette.error.main},linkButton:{minWidth:"initial",padding:0,"&:hover":{backgroundColor:"initial"}}},fullScreenDialog:{dialogTitle:{alignItems:"center",display:"flex",padding:G.spacing(1,2),position:"relative"},heading:{flex:1},dialogContent:{padding:G.spacing(1,2)},dialogActions:{display:"flex",flexDirection:"column",padding:G.spacing(1),[G.breakpoints.up("md")]:{flexDirection:"row"}},commitButton:{[G.breakpoints.up("md")]:{order:1}}},toolbar:{[G.breakpoints.down("md")]:{minHeight:56}},pageTitle:{fontSize:G.typography.pxToRem(24),marginBottom:G.spacing(2)},metadataGrid:{borderBottom:"1px solid ".concat(G.palette.grey[400]),borderTop:"1px solid ".concat(G.palette.grey[400]),paddingBottom:G.spacing(2),paddingTop:G.spacing(2),marginBottom:G.spacing(3),marginTop:G.spacing(2),"& > div:first-child":{[G.breakpoints.down("sm")]:{paddingBottom:G.spacing(2)},[G.breakpoints.up("md")]:{paddingRight:G.spacing(1)}},"& > div:not(:first-child)":{[G.breakpoints.down("sm")]:{borderTop:"1px solid ".concat(G.palette.grey[400]),paddingTop:G.spacing(2)},[G.breakpoints.up("md")]:{borderLeft:"1px solid ".concat(G.palette.grey[400]),paddingLeft:G.spacing(2)}}}},typography:{button:{textTransform:"none"},h1:{fontSize:G.typography.pxToRem(48)},h2:{fontSize:G.typography.pxToRem(24),fontWeight:400},h3:{fontSize:G.typography.pxToRem(20),fontWeight:400},h4:{fontSize:G.typography.pxToRem(18)},h5:{fontSize:G.typography.pxToRem(16),fontWeight:500},h6:{fontSize:G.typography.pxToRem(14)}},topbar:{height:64},sidebar:{width:260},scrollView:{height:"100%",overflow:"auto",width:"100%"},sizes:{navigationController:{navbarHeight:56,toolbarHeight:48}},listDialog:{filterField:{backgroundColor:"#FFF",borderRadius:4,padding:"0 16px",marginBottom:16},paper:{minWidth:320,width:480},progressBar:{height:2}},listView:{list:{padding:0,width:"100%",height:"100%",overflow:"auto"},subheader:{backgroundColor:"#e7e7e7"}},propertyList:{root:{padding:0},listItem:{listItemRoot:{display:"flex",fontSize:G.typography.pxToRem(14),padding:G.spacing(.25,0)},listItemIconRoot:{marginRight:5,minWidth:20},listItemIcon:{height:18,width:18},listItemTextRoot:{margin:0,padding:0},label:{fontWeight:500,marginRight:G.spacing(.5),"&:after":{content:'":"'}},inlineNestedList:{display:"inline-flex","& > *:not(:last-child)":{marginRight:G.spacing(.5),"&:after":{content:'","'}}},nestedListItem:{padding:0,width:"initial"}}},propertyTable:{cell:{fontSize:G.typography.pxToRem(13),padding:"".concat(G.spacing(.5),"px ").concat(G.spacing(1),"px")},table:{tableLayout:"fixed"},labelCell:{fontWeight:500,width:150,[G.breakpoints.up("md")]:{width:300}},rowInteractive:{cursor:"pointer"},rowOdd:{backgroundColor:G.palette.grey[100]},selectionCell:{width:40}}});1===parseInt("1")&&c.a({dsn:Object({NODE_ENV:"production",PUBLIC_URL:"/material-appkit",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_URL_BASENAME:"/",REACT_APP_SENTRY_LOGGING:"1",REACT_APP_SERVICE_WORKER_ENABLED:"1",REACT_APP_GA_ID:"G-76P0GP5209"}).REACT_APP_SENTRY_ID,environment:Object({NODE_ENV:"production",PUBLIC_URL:"/material-appkit",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_URL_BASENAME:"/",REACT_APP_SENTRY_LOGGING:"1",REACT_APP_SERVICE_WORKER_ENABLED:"1",REACT_APP_GA_ID:"G-76P0GP5209"}).REACT_APP_SENTRY_ENVIRONMENT}),T.a.initialize({}),l.a.render(Object(n.jsx)(N.a,{theme:U,children:Object(n.jsxs)(D.SnackbarProvider,{anchorOrigin:{horizontal:"center",vertical:"top"},autoHideDuration:3e3,children:[Object(n.jsx)(I.a,{}),Object(n.jsx)(F.a,{}),Object(n.jsx)(z.a,{}),Object(n.jsx)(B,{})]})}),document.getElementById("root"))},49:function(t,e,a){"use strict";a.d(e,"a",(function(){return i})),a.d(e,"b",(function(){return r})),a.d(e,"c",(function(){return l}));var n=a(3),o=a.n(n),i=(o.a.object,o.a.object,o.a.object,o.a.string,o.a.func,o.a.func,o.a.func,"en-US"),r=["en-US"],l={"en-US":{currencyFormat:{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:2},source:a(177)}}},65:function(t,e,a){"use strict";var n=a(0),o=a.n(n);e.a=o.a.createContext({breakpoint:null,loadProgress:null,locale:null,pageTitle:null,update:null})}},[[185,1,2]]]);