(this.webpackJsonpcarousel=this.webpackJsonpcarousel||[]).push([[0],{1:function(e,t,a){e.exports={wrapper:"App_wrapper__RCHjb",slide:"App_slide__3wo5f",inactive:"App_inactive__3sm8u",loader:"App_loader__Dop8H",loadingSpinner:"App_loadingSpinner__mDfBX",media:"App_media__3AUMG",img:"App_img__KttCg",info:"App_info__TsZcg",actions:"App_actions__3Fim5",action:"App_action__3GOU7",activeBtn:"App_activeBtn__mek8F"}},29:function(e,t,a){e.exports=a(71)},68:function(e,t,a){},71:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(19),c=a.n(r),o=a(7),s=a.n(o),l=a(3),d=a(20),u=a(21),m=a(22),p=a(23),v=a(28),f=a(27),_=a(24),g=a.n(_),A=a(25),h=a.n(A),D=a(26),E=a.n(D),b=a(6),w=a.n(b),S=function(e,t,a){var n=e.slice();return t.forEach((function(t,i){"undefined"===typeof n[i]?n[i]=a.cloneUnlessOtherwiseSpecified(t,a):a.isMergeableObject(t)?n[i]=w()(e[i],t,a):-1===e.indexOf(t)&&n.push(t)})),n},I=a(1),k=a.n(I),y=new(a(67)),O=new E.a("_"),j="Error: No data provided",N="Error: Initialization Failed",L="Error: Failed to get data",x="Error: Postback sending error",C=function(e){Object(v.a)(a,e);var t=Object(f.a)(a);function a(){var e;Object(m.a)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={carouselData:null,isInitializing:!1,isLoadingData:!1,isActive:!1,selectedAction:void 0,errors:[]},e.initWidget=Object(u.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.setState({isInitializing:!0}),t.next=4,y.init((function(t){switch(e.setState({isInitializing:!1,isActive:!0}),t.type){case"WIDGET_INITIALIZED":if(e.setState({isLoadingData:!0}),t.metaData.items_url)h.a.get(t.metaData.items_url).then((function(t){e.setState({isLoadingData:!1,carouselData:t.data})}));else if(t.metaData.items_json)e.setState({isLoadingData:!1,carouselData:JSON.parse(t.metaData.items_json)});else if(Object.keys(t.metaData).find((function(e){return e.includes("items")}))){var a={items:[]};Object.keys(t.metaData).filter((function(e){return e.includes("items")})).forEach((function(e){a=w()(a,O.object(Object(d.a)({},e,t.metaData[e])),{arrayMerge:S})})),e.setState({isLoadingData:!1,carouselData:a})}else console.error(j),e.setState((function(e){return{isActive:!1,errors:[].concat(Object(l.a)(e.errors),[j])}}));break;case"WIDGET_INITIALIZATION_FAILED":console.error(N),e.setState((function(e){return{isActive:!1,errors:[].concat(Object(l.a)(e.errors),[N])}}))}}));case 4:t.next=11;break;case 6:t.prev=6,t.t0=t.catch(0),e.setState({isInitializing:!1}),console.error(L,t.t0),e.setState((function(e){return{isActive:!1,errors:[].concat(Object(l.a)(e.errors),[L])}}));case 11:case"end":return t.stop()}}),t,null,[[0,6]])}))),e.onActionClickHandler=function(t,a,n){var i=e.state.errors;switch(t){case"postback":y.widgetIsActive&&y.sendUserData({selectedItem:a,errorMessage:i},(function(t){"SEND_USER_DATA_SUCCESS"===t.type?e.setState({selectedAction:a,isActive:!1}):(console.error(x),e.setState((function(e){return{isActive:!1,errors:[].concat(Object(l.a)(e.errors),[x])}})))}));break;case"link":var r=window.open(n,"_blank","noopener,noreferrer");r&&(r.opener=null)}},e}return Object(p.a)(a,[{key:"componentDidMount",value:function(){this.initWidget()}},{key:"componentDidUpdate",value:function(e,t,a){var n=this.state.errors;!y.widgetIsActive&&t.isActive&&(console.error(N),this.setState((function(e){return{isActive:!1,errors:[].concat(Object(l.a)(e.errors),[N])}}))),n.length!==t.errors.length&&y.widgetIsActive&&y.sendUserData({selectedItem:null,errorMessage:n},(function(){}))}},{key:"render",value:function(){var e=this,t=this.state,a=t.carouselData,n=t.isInitializing,r=t.isLoadingData,c=t.isActive,o=t.selectedAction,s={accessibility:!0,infinite:!1,slidesToShow:(null===a||void 0===a?void 0:a.items)&&(null===a||void 0===a?void 0:a.items).length>1?1.1:1};return i.a.createElement("div",{className:k.a.wrapper},(n||r)&&i.a.createElement("div",{className:k.a.loader},i.a.createElement("div",{className:k.a.loadingSpinner})),!c&&i.a.createElement("div",{className:k.a.inactive}),i.a.createElement(g.a,s,null===a||void 0===a?void 0:a.items.map((function(t){return i.a.createElement("div",{key:t.id||t.title},i.a.createElement("div",{className:k.a.slide},i.a.createElement("div",{className:k.a.media},i.a.createElement("img",{className:k.a.img,src:t.mediaurl,alt:t.title})),i.a.createElement("div",{className:k.a.info},i.a.createElement("h3",{className:k.a.title},t.title),i.a.createElement("p",{className:k.a.description},t.description)),i.a.createElement("div",{className:k.a.actions},t.actions.map((function(t){return i.a.createElement("button",{key:t.text,className:"".concat(k.a.action," ").concat(o&&o===t.payload&&k.a.activeBtn),onClick:function(){return e.onActionClickHandler(t.type,t.payload,t.uri)}},t.text)})))))}))))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(68),a(69),a(70);c.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(C,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[29,1,2]]]);
//# sourceMappingURL=main.d3da5c72.chunk.js.map