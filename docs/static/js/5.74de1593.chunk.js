(this["webpackJsonp@material-appkit/documentation"]=this["webpackJsonp@material-appkit/documentation"]||[]).push([[5],{272:function(t,e,n){"use strict";n.r(e);var a=n(33),i=n(88),c=n(7),r=n(0),o=n(260),u=n.n(o),s=n(246),b=n.n(s),l=n(248),p=n(23),j=n(249),O=n.n(j),h=n(66),f=n.n(h),d=n(243),m=n.n(d),x=n(256),v=n(259),k=n(65),g=n(105);var P=function(t){var e=Object(r.useContext)(k.a),n=Object(p.a)(),a=Object(r.useState)(!1),o=Object(i.a)(a,2),u=o[0],s=o[1],j=Object(r.useState)(null),h=Object(i.a)(j,2),d=h[0],P=h[1],w=Object(r.useState)([]),z=Object(i.a)(w,2),S=z[0],A=z[1],L=Object(v.usePrevious)(S);Object(v.useInit)(Object(l.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.onMount(),!t.initialize){e.next=7;break}return e.next=4,t.initialize();case 4:s(!0),e.next=8;break;case 7:s(!0);case 8:return e.abrupt("return",(function(){t.onUnmount()}));case 9:case"end":return e.stop()}}),e)})))),Object(r.useEffect)((function(){if(t.location!==d){var e=Object(x.matchesForPath)(t.location.pathname,t.routes);e.length?e!==L&&(P(t.location),A(e)):f.a.navigate(t.redirectPath,null,!0)}}),[t.location,t.redirectPath,t.routes,d,L]);var C=null;return u&&(C=Object(c.jsx)(O.a,{location:t.location,matches:S,onViewDidAppear:function(t){e.update({pageTitle:t.props.title})}})),Object(c.jsx)(m.a,{bar:Object(c.jsx)(g.a,{navLinkArrangement:t.navLinkArrangement}),barSize:n.topbar.height,placement:"top",children:C})},w=n(101),z=Object(r.lazy)((function(){return n.e(4).then(n.bind(null,271))})),S=[{path:w.a.index,component:z}];e.default=function(t){var e=Object(r.useContext)(k.a),n=Object(r.useState)([]),o=Object(i.a)(n,2),s=o[0],b=o[1];return Object(c.jsx)(P,Object(a.a)({initialize:function(){return new Promise((function(t,n){b([{title:"Home",path:w.a.index,Icon:u.a}]),e.update({loadProgress:null}),t()}))},navLinkArrangement:s,redirectPath:w.a.index,routes:S},t))}}}]);