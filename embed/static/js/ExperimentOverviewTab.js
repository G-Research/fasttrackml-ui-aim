(this.webpackJsonpui_v2=this.webpackJsonpui_v2||[]).push([[7],{1031:function(e,t,n){"use strict";n.d(t,"b",(function(){return d.a}));var a=n(0),i=n.n(a),c=n(856),s=n(3),o=n(8),r=n(15),l=n(11),d=n(837);var u=function(e){const{current:t}=i.a.useRef(d.a),n=t.experimentContributionsState((e=>e));return i.a.useEffect((()=>{n.data||t.fetchExperimentContributions(e)}),[n.data]),i.a.useEffect((()=>()=>{t.destroy()}),[]),{experimentContributionsState:n}},m=(n(1526),n(1));function j(e){var t,n;let{experimentId:a,experimentName:i}=e;const{experimentContributionsState:d}=u(a);let j=new Date;return Object(m.jsx)(o.a,{children:Object(m.jsxs)("div",{className:"ExperimentContributions",children:[Object(m.jsx)(s.n,{component:"h2",size:18,weight:600,tint:100,children:"Contributions"}),Object(m.jsx)("div",{className:"ExperimentContributions__HeatMap",children:Object(m.jsx)(c.a,{startDate:function(e,t){const n=new Date(e);return n.setDate(n.getDate()+t),n}(j,-300),endDate:j,onCellClick:()=>{Object(l.b)(r.a.dashboard.activityCellClick)},additionalQuery:' and run.experiment == "'.concat(i,'"'),data:Object.keys(null!==(t=null===(n=d.data)||void 0===n?void 0:n.activity_map)&&void 0!==t?t:{}).map((e=>{var t;return[new Date(e),null===(t=d.data)||void 0===t?void 0:t.activity_map[e]]}))})})]})})}var p=i.a.memo(j);t.a=p},1526:function(e,t,n){},1527:function(e,t,n){},1528:function(e,t,n){},1529:function(e,t,n){},1530:function(e,t,n){},1531:function(e,t,n){},1532:function(e,t,n){},1545:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),c=n(15),s=n(11),o=n(1031),r=n(13),l=n.n(r),d=n(91),u=n(139),m=n(3),j=(n(1527),n(1));var p=function(e){var t;let{sidebarRef:n,overviewSectionRef:a,setContainerHeight:c,overviewSectionContentRef:s,description:o}=e;const{url:r}=Object(d.j)(),p=i.a.useRef(null),[v,h]=i.a.useState(!1),[b,_]=i.a.useState(0);return i.a.useEffect((()=>{var e;_(null===p||void 0===p||null===(e=p.current)||void 0===e?void 0:e.offsetHeight)}),[null===p||void 0===p||null===(t=p.current)||void 0===t?void 0:t.offsetHeight,v]),i.a.useEffect((()=>{var e,t,a;(null===s||void 0===s||null===(e=s.current)||void 0===e?void 0:e.offsetHeight)>(null===n||void 0===n||null===(t=n.current)||void 0===t?void 0:t.childNodes[0].offsetHeight)?c("100%"):c((null===n||void 0===n||null===(a=n.current)||void 0===a?void 0:a.childNodes[0].offsetHeight)+40)}),[b]),Object(j.jsx)("div",{className:"ExperimentOverviewSidebar ScrollBar__hidden",ref:n,onScroll:function(e){var t;null===a||void 0===a||null===(t=a.current)||void 0===t||t.scrollTo(0,e.target.scrollTop)},children:Object(j.jsx)("div",{className:"ExperimentOverviewSidebar__wrapper",children:Object(j.jsxs)("div",{className:"ExperimentOverviewSidebar__section ExperimentOverviewSidebar__section__descriptionBox",children:[Object(j.jsxs)("div",{className:"ExperimentOverviewSidebar__section__descriptionBox__header",children:[Object(j.jsx)(m.n,{weight:600,size:18,tint:100,component:"h3",children:"Description"}),Object(j.jsx)(u.c,{to:"".concat(r.split("/").slice(0,-1).join("/"),"/settings"),children:Object(j.jsx)(m.c,{withOnlyIcon:!0,size:"small",color:"secondary",children:Object(j.jsx)(m.f,{name:"edit"})})})]}),Object(j.jsx)("div",{className:l()("ExperimentOverviewSidebar__section__descriptionBox__description",{showAll:v},{hasMore:b>=72&&!v}),ref:p,children:Object(j.jsx)(m.n,{tint:70,children:o||"No description"})}),b>=72&&Object(j.jsx)("div",{className:"ExperimentOverviewSidebar__section__descriptionBox__seeMoreButtonBox",onClick:function(){h(!v)},children:Object(j.jsx)(m.n,{size:12,weight:600,children:v?"See less":"See more"})})]})})})},v=n(903),h=n(907),b=n(16),_=n(837);n(1528);function x(e){let{experimentName:t}=e;const[n,i]=a.useState({source:"",id:""}),{current:c}=a.useRef(_.a),s=c.experimentContributionsState((e=>e)),{totalRunsCount:o,archivedRuns:r}=a.useMemo((()=>{var e,t;return{totalRunsCount:(null===(e=s.data)||void 0===e?void 0:e.num_runs)||0,archivedRuns:(null===(t=s.data)||void 0===t?void 0:t.num_archived_runs)||0}}),[s]),l=a.useMemo((()=>({runs:{label:"runs",icon:"runs",count:o-r,iconBgColor:"#1473E6",navLink:"/runs?select=".concat(Object(b.c)({query:"run.experiment == '".concat(t,"'")}))},archived:{label:"archived",icon:"archive",count:r,iconBgColor:"#606986",navLink:"/runs?select=".concat(Object(b.c)({query:"run.archived == True and run.experiment == '".concat(t,"'")}))}})),[o,r,t]),d=a.useMemo((()=>{var e,n;return{active:{label:"Active",count:(null===(e=s.data)||void 0===e?void 0:e.num_active_runs)||0,icon:"runs",iconBgColor:"#18AB6D",navLink:"/runs?select=".concat(Object(b.c)({query:"run.active == True and run.experiment == '".concat(t,"'")}))},finished:{label:"Finished",icon:"runs",count:o-((null===(n=s.data)||void 0===n?void 0:n.num_active_runs)||0),iconBgColor:"#83899e",navLink:"/runs?select=".concat(Object(b.c)({query:"run.active == False and run.experiment == '".concat(t,"'")}))}}}),[s,t,o]),u=a.useMemo((()=>Object.values(d).map((e=>{let{label:t,iconBgColor:a="#000",count:i}=e;return{highlighted:n.id===t,label:t,color:a,percent:0===o?0:i/o*100}}))),[d,o,n]),p=a.useCallback((function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";i({source:t,id:e})}),[]),x=a.useCallback((()=>{i({source:"",id:""})}),[]);return Object(j.jsxs)("div",{className:"ExperimentStatistics",children:[Object(j.jsxs)(m.n,{className:"ExperimentStatistics__totalRuns",component:"p",tint:100,weight:700,size:14,children:["Total runs: ",o]}),Object(j.jsx)("div",{className:"ExperimentStatistics__cards",children:Object.values(l).map((e=>{let{label:t,icon:a,count:i,iconBgColor:c,navLink:o}=e;return Object(j.jsx)(v.a,{label:t,icon:a,count:i,navLink:o,iconBgColor:c,onMouseOver:p,onMouseLeave:x,highlighted:!!o&&n.id===t,isLoading:s.loading},t)}))}),Object(j.jsx)(m.n,{className:"ExperimentStatistics__trackedSequences",component:"p",tint:100,weight:700,size:14,children:"Runs status"}),Object(j.jsx)("div",{className:"ExperimentStatistics__cards",children:Object.values(d).map((e=>{let{label:t,icon:a,count:i,iconBgColor:c,navLink:o}=e;return Object(j.jsx)(v.a,{label:t,icon:a,count:i,navLink:o,iconBgColor:c,onMouseOver:p,onMouseLeave:x,highlighted:!!o&&"card"===n.source&&n.id===t,outlined:n.id===t,isLoading:s.loading},t)}))}),Object(j.jsx)("div",{className:"ExperimentStatistics__bar",children:Object(j.jsx)(h.a,{data:u,onMouseOver:p,onMouseLeave:x})})]})}x.displayName="ExperimentStatistics";var f=a.memo(x),O=n(901),g=n(69),C=n.n(g),N=n(65),y=n(80),S=n(730),E=n(714);var w=function(){let{call:e}=Object(S.a)();const{fetchData:t,state:n,destroy:a}=Object(E.a)((async(t,n)=>await e(t,n)));return{fetchExperimentContributionsFeed:(e,n)=>t({experimentId:e,queryParams:n}),experimentContributionsFeedState:n,destroy:a}}();var R=function(e,t){var n,a;const[c,s]=i.a.useState([]),{current:o}=i.a.useRef(w),r=o.experimentContributionsFeedState((e=>e)),{current:l}=i.a.useRef(_.a),d=l.experimentContributionsState((e=>e));i.a.useEffect((()=>(N.a.isEmpty(r.data)&&o.fetchExperimentContributionsFeed(e,{limit:25}),()=>o.destroy())),[]),i.a.useEffect((()=>{var e;if(null===(e=r.data)||void 0===e?void 0:e.length){let e=[...c,...r.data];s(e)}}),[r.data]);const u=i.a.useMemo((()=>{const n={};if(c.length){(null===c||void 0===c?void 0:c.reduce(((e,t)=>{const n=C()(1e3*t.creation_time).format(y.h);return e.includes(n)||t.archived||e.push(n),e}),[])).forEach((e=>{n[e]={}})),null===c||void 0===c||c.forEach((a=>{if(!a.archived){var i,c;const s=C()(1e3*a.creation_time).format(y.h),o=C()(1e3*a.creation_time).format(y.g),r={name:a.name,date:C()(1e3*a.creation_time).format(y.i),hash:a.run_id,creation_time:a.creation_time,experiment:t,experimentId:e};(null===(i=n[s])||void 0===i||null===(c=i[o])||void 0===c?void 0:c.length)?n[s][o].push(r):n[s][o]=[r]}}))}return n}),[c,t,e]);return{isLoading:r.loading,data:u,totalRunsCount:null===(n=d.data)||void 0===n?void 0:n.num_runs,archivedRunsCount:null===(a=d.data)||void 0===a?void 0:a.num_archived_runs,fetchedCount:c.length,loadMore:function(){r.data&&!r.loading&&o.fetchExperimentContributionsFeed(e,{limit:25,offset:c[c.length-1].run_id})}}};function k(e){let{experimentId:t,experimentName:n}=e;const a=R(t,n);return Object(j.jsx)(O.a,{...a})}var M=i.a.memo(k);n(1529);var D=function(e){const t=i.a.useRef(null),n=i.a.useRef(null),a=i.a.useRef(null),[r,l]=i.a.useState(0);return i.a.useEffect((()=>{s.a(c.a.experiment.tabs.overview.tabView)}),[]),Object(j.jsxs)("div",{className:"ExperimentOverviewTab",ref:n,onScroll:function(e){var n;null===t||void 0===t||null===(n=t.current)||void 0===n||n.scrollTo(0,e.target.scrollTop)},children:[Object(j.jsx)("div",{className:"ExperimentOverviewTab__content",ref:a,style:{height:r},children:Object(j.jsxs)("div",{className:"ExperimentOverviewTab__content__section",children:[Object(j.jsx)(f,{experimentName:e.experimentName}),Object(j.jsx)(o.a,{experimentId:e.experimentId,experimentName:e.experimentName}),Object(j.jsx)(M,{experimentId:e.experimentId,experimentName:e.experimentName})]})}),Object(j.jsx)(p,{sidebarRef:t,overviewSectionRef:n,setContainerHeight:l,overviewSectionContentRef:a,description:e.description})]})};t.default=D},1547:function(e,t,n){"use strict";n.r(t),n.d(t,"experimentRunsEngine",(function(){return D}));var a=n(0),i=n.n(a),c=n(8),s=n(65),o=n(13),r=n.n(o),l=n(617),d=n(3),u=n(387),m=n(10),j=n(390),p=n(48),v=(n(1530),n(1));var h=function(e){let{experimentName:t,experimentId:n}=e;const{tableRef:a,tableColumns:i,tableData:c,loading:o,selectedRows:h,comparisonQuery:b,onRowSelect:_,loadMore:x,isInfiniteLoading:f,totalRunsCount:O}=B(t,n);return Object(v.jsxs)("div",{className:"ExperimentRunsTable",children:[Object(v.jsxs)("div",{className:"ExperimentRunsTable__header",children:[Object(v.jsxs)("div",{className:"ExperimentRunsTable__header__titleBox",children:[Object(v.jsx)(d.n,{className:"ExperimentRunsTable__header__titleBox__title",component:"h3",size:14,weight:700,tint:100,children:s.a.isEmpty(h)?"Experiment Runs":"Selected Runs (".concat(Object.values(h).length,")")}),s.a.isEmpty(h)?o?Object(v.jsx)(l.a,{variant:"rect",height:17,width:50}):Object(v.jsx)(d.n,{component:"h3",size:14,weight:700,tint:100,children:s.a.isEmpty(c)?"(0)":" (".concat(null===c||void 0===c?void 0:c.length,"/").concat(O,")")}):null]}),(null===c||void 0===c?void 0:c.length)>0?Object(v.jsx)("div",{className:"ExperimentRunsTable__header__comparisonPopover",children:Object(v.jsx)(j.a,{appName:"experiment",query:b,disabled:0===Object.keys(h).length})}):null]}),Object(v.jsxs)("div",{className:r()("ExperimentRunsTable__table",{"ExperimentRunsTable__table--loading":o,"ExperimentRunsTable__table--empty":0===c.length}),children:[s.a.isEmpty(c)&&o?Object(v.jsx)(d.l,{}):Object(v.jsx)(u.a,{custom:!0,allowInfiniteLoading:!0,isInfiniteLoading:!1,showRowClickBehaviour:!1,infiniteLoadHandler:x,showResizeContainerActionBar:!1,ref:a,data:c,columns:i,appName:p.b.RUNS,multiSelect:!0,topHeader:!0,noColumnActions:!0,hideHeaderActions:!0,isLoading:!1,height:"100%",rowHeight:m.e.sm,illustrationConfig:{size:"large",title:"No experiment runs"},selectedRows:h,onRowSelect:_}),f&&Object(v.jsx)("div",{className:"Infinite_Loader",children:Object(v.jsx)(d.l,{})})]})]})},b=n(69),_=n.n(b),x=n(216),f=n(80),O=n(1031),g=n(92),C=n(110),N=n(54),y=n(90),S=n(28),E=n(165),w=n(16),R=n(386),k=n(714),M=n(140);var D=function(){const{call:e}=Object(R.d)(),{fetchData:t,state:n,destroy:a}=Object(k.a)((async t=>Object(M.d)(await e(t))));return{fetchExperimentRuns:e=>t(e),experimentRunsState:n,destroy:a}}();var B=function(e,t){var n,a,c,o;const r=i.a.useRef(null),l=i.a.useRef(null),[u,m]=i.a.useState([]),[j,p]=i.a.useState(!1),{current:h}=i.a.useRef(D),{current:b}=i.a.useRef(O.b),R=b.experimentContributionsState((e=>e)),k=h.experimentRunsState((e=>e)),[M,B]=i.a.useState({}),[T,F]=i.a.useState("");i.a.useEffect((()=>(s.a.isEmpty(k.data)&&h.fetchExperimentRuns({limit:50,exclude_params:!0,q:"run.experiment == '".concat(e,"'")}),()=>{h.destroy(),b.destroy()})),[]),i.a.useEffect((()=>{s.a.isEmpty(R.data)&&b.fetchExperimentContributions(t)}),[R.data]),i.a.useEffect((()=>{k.data&&h.destroy(),R.data&&b.destroy()}),[t]),i.a.useEffect((()=>{var e;if(null===(e=k.data)||void 0===e?void 0:e.length){let e=[...u,...k.data];m(e),l.current=e}}),[k.data]);const H=i.a.useMemo((()=>{if(u){const e=[],t=[],n={};return u.forEach((a=>{let{hash:i,traces:c}=a;c.metric.forEach((a=>{const c=Object(g.a)(a.name,a.context);if(n.hasOwnProperty(c))n[c][i]=[a.last_value.last_step,a.last_value.last];else{n[c]={[i]:[a.last_value.last_step,a.last_value.last]};const s=Object(C.a)(a.context),o=Object(N.a)(a.name),r={key:c,content:Object(v.jsx)(d.b,{monospace:!0,size:"xSmall",label:""===s?"Empty context":s}),topHeader:o?Object(y.a)(a.name):a.name,name:a.name,context:s,isSystem:o};o?t.push(r):e.push(r)}}))})),{columns:s.a.orderBy(e,["name","context"],["asc","asc"]).concat(s.a.orderBy(t,["name","context"],["asc","asc"])),values:n}}return{columns:[],values:[]}}),[u]),I=i.a.useMemo((()=>u?u.map(((e,t)=>{let{props:n,hash:a}=e;const i=Object(w.c)({hash:a});let c={key:i,selectKey:i,index:t,run:{content:Object(v.jsx)(x.a,{run:n.name,runHash:a,active:n.active})},date:_()(1e3*n.creation_time).format(f.f),duration:Object(E.a)(1e3*n.creation_time,n.end_time?1e3*n.end_time:Date.now())};return H.columns.forEach((e=>{var t;const[n,i]=null!==(t=H.values[e.key][a])&&void 0!==t?t:[null,null];c[e.key]={content:null===n?"--":e.isSystem?Object(S.a)(i):"step: ".concat(null!==n&&void 0!==n?n:"-"," / value: ").concat(Object(S.a)(i))}})),c})):[]),[u,H]),L=i.a.useMemo((()=>[{key:"run",content:Object(v.jsx)("span",{children:"Name"}),topHeader:"Run",pin:"left"},{key:"date",content:Object(v.jsx)("span",{children:"Date"}),topHeader:"Run"},{key:"duration",content:Object(v.jsx)("span",{children:"Duration"}),topHeader:"Run"}].concat(H.columns)),[H]),z=i.a.useCallback((t=>{let{actionType:n,data:a}=t,i={...M};switch(n){case"single":M[a.key]?i=s.a.omit(M,a.key):i[a.key]=!0;break;case"selectAll":Array.isArray(a)?a.forEach((e=>{M[e.key]||(i[e.key]=!0)})):Object.values(a).reduce(((e,t)=>e.concat(t.items)),[]).forEach((e=>{M[e.selectKey]||(i[e.selectKey]=!0)}));break;case"removeAll":Array.isArray(a)&&(i={})}B(i),F("run.hash in [".concat(Object.keys(i).map((e=>'"'.concat(JSON.parse(Object(w.b)(e)).hash,'"'))).join(", "),'] and run.experiment == "').concat(e,'"'))}),[M,I]);return i.a.useEffect((()=>{var e;null===(e=r.current)||void 0===e||e.updateData({newData:I,newColumns:L})}),[I,L]),{data:u,tableData:I,tableColumns:L,tableRef:r,loading:k.loading,isInfiniteLoading:j,selectedRows:M,comparisonQuery:T,onRowSelect:z,loadMore:function(){var t;k.data&&!k.loading&&(p(!0),h.fetchExperimentRuns({limit:50,exclude_params:!0,offset:null===(t=l.current[l.current.length-1])||void 0===t?void 0:t.hash,q:"run.experiment == '".concat(e,"'")}).finally((()=>p(!1))))},totalRunsCount:(null!==(n=null===R||void 0===R||null===(a=R.data)||void 0===a?void 0:a.num_runs)&&void 0!==n?n:0)-(null!==(c=null===R||void 0===R||null===(o=R.data)||void 0===o?void 0:o.num_archived_runs)&&void 0!==c?c:0)}},T=h;n(1531);function F(e){let{experimentName:t,experimentId:n}=e;return Object(v.jsx)(c.a,{children:Object(v.jsx)("div",{className:"ExperimentRunsTab",children:Object(v.jsx)("div",{className:"ExperimentRunsTab__content",children:Object(v.jsx)(T,{experimentName:t,experimentId:n})})})})}var H=Object(a.memo)(F);t.default=H},1551:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),c=n(91),s=n(725),o=n(8),r=n(905),l=n(3),d=n(15),u=n(11),m=(n(1532),n(1));function j(e){let{experimentName:t,description:n,updateExperiment:a,deleteExperiment:j}=e;const p=Object(c.g)(),[v,h]=i.a.useState(!1);return i.a.useEffect((()=>{u.a(d.a.experiment.tabs.settings.tabView)}),[]),Object(m.jsx)(o.a,{children:Object(m.jsxs)("div",{className:"ExperimentSettingsTab",children:[Object(m.jsxs)("div",{className:"ExperimentSettingsTab__actionCardsCnt",children:[Object(m.jsx)(r.a,{title:"Experiment Properties",defaultName:null!==t&&void 0!==t?t:"",defaultDescription:null!==n&&void 0!==n?n:"",onSave:function(e,t){a(e,t)}}),Object(m.jsx)(l.a,{title:"Delete Experiment",description:"Once you delete an experiment, there is no going back. Please be certain.",btnTooltip:"Delete Experiment",btnText:"Delete",onAction:function(){h(!0)},btnProps:{variant:"contained",className:"ExperimentSettingsTab__actionCardsCnt__btn__delete"}})]}),Object(m.jsx)(s.a,{open:v,onCancel:function(){h(!1)},onSubmit:function(){j((()=>{p.push("/experiments")}))},text:"Are you sure you want to delete this experiment?",icon:Object(m.jsx)(l.f,{name:"delete"}),title:"Delete experiment",statusType:"error",confirmBtnText:"Delete"})]})})}var p=Object(a.memo)(j);t.default=p},725:function(e,t,n){"use strict";var a=n(0),i=n.n(a),c=n(693),s=n(3),o=n(175),r=(n(726),n(1));function l(e){return Object(r.jsx)(o.a,{children:Object(r.jsxs)(c.a,{open:e.open,onClose:e.onCancel,"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",PaperProps:{elevation:10},className:"ConfirmModal ConfirmModal__".concat(e.statusType),children:[Object(r.jsxs)("div",{className:"ConfirmModal__Body",children:[Object(r.jsx)(s.c,{size:"small",className:"ConfirmModal__Close__Icon",color:"secondary",withOnlyIcon:!0,onClick:e.onCancel,children:Object(r.jsx)(s.f,{name:"close"})}),Object(r.jsxs)("div",{className:"ConfirmModal__Title__Container",children:[Object(r.jsx)("div",{className:"ConfirmModal__Icon",children:e.icon}),e.title&&Object(r.jsx)(s.n,{size:16,tint:100,component:"h4",weight:600,children:e.title})]}),Object(r.jsxs)("div",{children:[e.description&&Object(r.jsx)(s.n,{className:"ConfirmModal__description",weight:400,component:"p",id:"dialog-description",children:e.description}),Object(r.jsxs)("div",{children:[e.text&&Object(r.jsx)(s.n,{className:"ConfirmModal__text",weight:400,component:"p",size:14,id:"dialog-description",children:e.text||""}),e.children&&e.children]})]})]}),Object(r.jsxs)("div",{className:"ConfirmModal__Footer",children:[Object(r.jsx)(s.c,{onClick:e.onCancel,className:"ConfirmModal__CancelButton",children:e.cancelBtnText}),Object(r.jsx)(s.c,{onClick:e.onSubmit,color:"primary",variant:"contained",className:"ConfirmModal__ConfirmButton",autoFocus:!0,children:e.confirmBtnText})]})]})})}l.defaultProps={confirmBtnText:"Confirm",cancelBtnText:"Cancel",statusType:"info"},l.displayName="ConfirmModal",t.a=i.a.memo(l)},726:function(e,t,n){},837:function(e,t,n){"use strict";var a=n(730),i=n(714);t.a=function(){const{fetchData:e,state:t,destroy:n}=Object(i.a)(a.d);return{fetchExperimentContributions:t=>e(t),experimentContributionsState:t,destroy:n}}()},856:function(e,t,n){"use strict";n(0);var a=n(69),i=n.n(a),c=n(91),s=n(353),o=n(3),r=n(8),l=n(15),d=n(80),u=n(11),m=n(16),j=(n(857),n(1));const p=[0,1,2,3,4];t.a=function(e){let{data:t,startDate:n,endDate:a,cellSize:v=12,cellSpacing:h=4,scaleRange:b=4,onCellClick:_,additionalQuery:x=""}=e;const f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],O=Object(c.g)();n=new Date(n.getFullYear(),n.getMonth(),n.getDate()),a=new Date(a.getFullYear(),a.getMonth(),a.getDate());let g=n;for(;0!==g.getDay();)g=k(g,-1);let C=a;for(;0!==C.getDay();)C=k(C,1);0===C.getDay()&&(C=k(C,7));const N=Math.floor(Math.abs((g-C)/864e5)),y=function(){let e=0;return[...Array(N).keys()].forEach((t=>{let n=S(t);e=n>e?n:e})),e}();function S(e){const n=M(e);let a=0;for(let o=0;o<t.length;o++){var i,c,s;(null===(i=t[o])||void 0===i?void 0:i[0].getFullYear())===n.getFullYear()&&(null===(c=t[o])||void 0===c?void 0:c[0].getMonth())===n.getMonth()&&(null===(s=t[o])||void 0===s?void 0:s[0].getDate())===n.getDate()&&(a+=t[o][1])}return a}const E=[...f.slice(g.getMonth()),...f.slice(0,g.getMonth())],w={width:"".concat(N/7*v+(N/7-1)*h-50,"px")},R={gridTemplateColumns:"repeat(".concat(N/7,", 1fr)"),gridTemplateRows:"repeat(7, 1fr)",width:"".concat(N/7*v+(N/7-1)*h,"px"),height:"".concat(7*v+6*h,"px"),gridColumnGap:"".concat(h,"px"),gridRowGap:"".concat(h,"px")};function k(e,t){const n=new Date(e);return n.setDate(n.getDate()+t),n}function M(e){const t=Math.floor(e/7);return k(g,7*t+e%7)}function D(e){const t=S(e),n=M(e),c=t?(o=t,Math.ceil(o/y*b)):0;var o;const p=" ".concat(t," tracked run").concat(1!==t?"s":""," on ").concat(f[n.getMonth()]," ").concat(n.getDate(),", ").concat(n.getFullYear());return Object(j.jsx)(r.a,{children:Object(j.jsx)("div",{className:"CalendarHeatmap__cell__wrapper",children:+a<+M(e)?Object(j.jsx)("div",{className:"CalendarHeatmap__cell CalendarHeatmap__cell--dummy"}):Object(j.jsx)(s.a,{title:p,children:Object(j.jsx)("div",{className:"CalendarHeatmap__cell CalendarHeatmap__cell--scale-".concat(c||0),onClick:function(e){if(e.stopPropagation(),_(),c){const e=n.getTime(),t=Object(m.c)({query:"datetime(".concat(i()(e).format(d.d),") <= run.created_at < datetime(").concat(i()(e).add(1,"day").format(d.d),") ").concat(x)});u.b(l.a.dashboard.activityCellClick),O.push("/runs?select=".concat(t))}},role:"navigation"})})})},e)}return Object(j.jsxs)("div",{className:"CalendarHeatmap",children:[Object(j.jsxs)("div",{className:"CalendarHeatmap__map",children:[Object(j.jsx)("div",{}),Object(j.jsx)("div",{className:"CalendarHeatmap__map__axis CalendarHeatmap__map__axis--x",style:w,children:E.slice(0,10).map(((e,t)=>Object(j.jsx)("div",{className:"CalendarHeatmap__map__axis__tick--x",children:e},t)))}),Object(j.jsx)("div",{className:"CalendarHeatmap__map__axis CalendarHeatmap__map__axis--y",children:["S","M","T","W","T","F","S"].map(((e,t)=>Object(j.jsx)("div",{className:"CalendarHeatmap__map__axis__tick--y",children:e},t)))}),Object(j.jsx)("div",{className:"CalendarHeatmap__map__grid",style:R,children:[...Array(N).keys()].map((e=>D(e)))})]}),Object(j.jsxs)("div",{className:"CalendarHeatmap__cell__info",children:[Object(j.jsx)(o.n,{weight:400,size:12,children:"Less"}),p.map((e=>Object(j.jsx)("div",{style:{width:v,height:v},className:"CalendarHeatmap__cell__wrapper",children:Object(j.jsx)("div",{className:"CalendarHeatmap__cell CalendarHeatmap__cell--scale-".concat(e)})},e))),Object(j.jsx)(o.n,{weight:400,size:12,children:"More"})]})]})}},857:function(e,t,n){},858:function(e,t,n){},859:function(e,t,n){},860:function(e,t,n){},861:function(e,t,n){},899:function(e,t,n){},901:function(e,t,n){"use strict";var a=n(0),i=n.n(a),c=n(65),s=n(3),o=n(139),r=n(353),l=n(616),d=n(398),u=n(214),m=n(70),j=(n(858),n(1));function p(e){return Object(j.jsxs)("div",{className:"FeedItem",children:[Object(j.jsxs)("div",{className:"FeedItem__title",children:[Object(j.jsx)(s.f,{name:"calendar",fontSize:10,box:!0}),Object(j.jsx)(s.n,{tint:50,size:10,weight:700,children:e.date.split("_").join(" ")})]}),Object(j.jsx)("div",{className:"FeedItem__content",children:e.data.map((e=>Object(j.jsxs)("div",{className:"FeedItem__content__item",children:[Object(j.jsxs)("div",{className:"FeedItem__content__item__leftBox",children:[Object(j.jsx)(s.n,{tint:50,size:12,className:"FeedItem__content__item__leftBox__date",children:e.date}),Object(j.jsx)(s.n,{size:12,tint:100,className:"FeedItem__content__item__leftBox__label",children:"Started a run:"}),Object(j.jsx)(r.a,{title:e.active?"In Progress":"Finished",children:Object(j.jsx)("div",{className:"FeedItem__content__item__leftBox__indicatorBox",children:Object(j.jsx)(d.a,{className:"Table__status_indicator",status:e.active?"success":"alert"})})})]}),Object(j.jsxs)("div",{className:"FeedItem__content__item__itemBox",children:[Object(j.jsx)(u.a,{experimentName:e.experiment,experimentId:e.experimentId}),Object(j.jsx)(s.n,{size:10,children:"/"}),Object(j.jsx)(r.a,{title:e.name,children:Object(j.jsx)("div",{className:"FeedItem__content__item__itemBox__runName",children:Object(j.jsx)(l.a,{to:m.a.Run_Detail.replace(":runHash",e.hash),component:o.b,children:e.name})})})]})]},e.name)))})]})}var v=i.a.memo(p);n(859);function h(e){let{data:t,loadMore:n,isLoading:a,totalRunsCount:i=0,fetchedCount:o=0,archivedRunsCount:r=0}=e;return i&&i!==r?Object(j.jsxs)("div",{className:"ContributionsFeed",children:[Object(j.jsx)(s.n,{size:14,component:"h3",tint:100,weight:700,children:"Activity"}),a&&c.a.isEmpty(t)?Object(j.jsx)("div",{className:"flex fac fjc",children:Object(j.jsx)(s.l,{size:"24px"})}):Object(j.jsxs)(j.Fragment,{children:[Object.keys(t).map((e=>Object(j.jsxs)("div",{className:"ContributionsFeed__content",children:[Object(j.jsx)(s.n,{className:"ContributionsFeed__content-title",component:"h3",tint:100,weight:700,children:e.split("_").join(" ")}),Object.keys(t[e]).map((n=>Object(j.jsx)(v,{date:n,data:t[e][n]},n)))]},e))),o<i-r?Object(j.jsx)(s.c,{className:"ContributionsFeed__load-more",variant:"outlined",fullWidth:!0,size:"small",onClick:a?void 0:n,children:a?"Loading...":"Show more activity"}):null]})]}):null}var b=i.a.memo(h);t.a=b},903:function(e,t,n){"use strict";var a=n(0),i=n(91),c=n(13),s=n.n(c),o=n(3);var r=function(e,t){let n=null===e||void 0===e?void 0:e.substring(1).split("");3===n.length&&(n=[n[0],n[0],n[1],n[1],n[2],n[2]]);const a=+("0x"+n.join(""));return"rgba("+[a>>16&255,a>>8&255,255&a].join(",")+","+t||!1},l=(n(860),n(1));function d(e){let{label:t,badge:n={value:""},count:c,icon:d,iconBgColor:u="#000000",cardBgColor:m=r(u,.1),onMouseOver:j,onMouseLeave:p,navLink:v,highlighted:h,outlined:b=!1,isLoading:_=!1}=e;const x=Object(i.g)(),f=a.useCallback((e=>{"function"===typeof j&&j(e,"card")}),[j]),O={card:{borderColor:b?u:"transparent",backgroundColor:h?u:m},iconWrapper:{backgroundColor:h?"#fff":u},iconColor:h?u:"#fff",label:h?{color:"#fff"}:{},count:h?{color:"#fff"}:{}};return Object(l.jsxs)("div",{onClick:()=>v&&x.push(v),onMouseLeave:p,onMouseOver:()=>f(t),className:s()("StatisticsCard",{highlighted:h}),style:O.card,children:[(null===n||void 0===n?void 0:n.value)&&Object(l.jsx)(o.n,{component:"p",className:"StatisticsCard__badge",weight:600,size:8,style:n.style,children:n.value}),d&&Object(l.jsx)("div",{className:"StatisticsCard__iconWrapper",style:O.iconWrapper,children:Object(l.jsx)(o.f,{name:d,color:O.iconColor})}),Object(l.jsxs)("div",{className:"StatisticsCard__info",children:[Object(l.jsx)(o.n,{className:"StatisticsCard__info__label",size:10,weight:600,style:O.label,children:t}),Object(l.jsx)(o.n,{className:"StatisticsCard__info__count",size:16,weight:600,style:O.count,children:Object(l.jsx)("span",{children:_?"--":c})})]})]})}d.displayName="StatisticsCard";var u=a.memo(d);t.a=u},905:function(e,t,n){"use strict";var a=n(0),i=n(1030),c=n(65),s=n(1034),o=n(691),r=n(706),l=n(3),d=n(8),u=(n(899),n(1));function m(e){let{title:t="Run Properties",defaultName:n,defaultDescription:a,onSave:m}=e;const j=Object(s.a)({initialValues:{name:null!==n&&void 0!==n?n:"",description:null!==a&&void 0!==a?a:""},onSubmit:c.a.noop,validationSchema:i.a({name:i.b().required("Name is a required field")})}),{values:p,errors:v,touched:h,setFieldValue:b,setFieldTouched:_}=j;function x(e,t){var n;b(t,null===e||void 0===e||null===(n=e.target)||void 0===n?void 0:n.value,!0).then((()=>{_(t,!0)}))}return Object(u.jsx)(d.a,{children:Object(u.jsxs)("div",{className:"NameAndDescriptionCard",children:[Object(u.jsxs)("div",{className:"NameAndDescriptionCard__header",children:[Object(u.jsx)(l.n,{component:"h4",weight:600,size:14,tint:100,children:t}),Object(u.jsx)(o.a,{onClick:function(){m(p.name,p.description)},disabled:!c.a.isEmpty(v)||p.name===n&&p.description===a,variant:"contained",color:"primary",className:"NameAndDescriptionCard__saveBtn",children:"Save"})]}),Object(u.jsxs)("div",{className:"NameAndDescriptionCard__content",children:[Object(u.jsx)("div",{className:"NameAndDescriptionCard__content__nameBox",children:Object(u.jsx)(r.a,{variant:"outlined",className:"TextField__OutLined__Medium NameAndDescriptionCard__content__nameBox__nameInput",value:p.name,onChange:e=>x(e,"name"),error:!(!h.name||!v.name),helperText:h.name&&v.name,label:"Name"})}),Object(u.jsx)("div",{className:"NameAndDescriptionCard__content__descriptionBox",children:Object(u.jsx)(r.a,{variant:"outlined",multiline:!0,label:"Description",type:"textarea",className:"NameAndDescriptionCard__content__descriptionBox__descriptionInput",value:p.description,onChange:e=>x(e,"description"),error:!(!h.description||!v.description),helperText:h.description&&v.description})})]})]})})}var j=Object(a.memo)(m);t.a=j},907:function(e,t,n){"use strict";var a=n(0),i=n(13),c=n.n(i),s=n(353),o=(n(861),n(1));function r(e){let{data:t=[],width:n="100%",height:i=8,onMouseOver:r,onMouseLeave:l}=e;const d=a.useCallback((e=>{"function"===typeof r&&r(e,"bar")}),[r]),u=a.useMemo((()=>{const e=[];for(let i=0;i<t.length;i++){var n,a;const c=t[i],s=(null===(n=e[i-1])||void 0===n?void 0:n.left)||0,o=(null===(a=t[i-1])||void 0===a?void 0:a.percent)||0,r={width:"".concat(c.percent.toFixed(2),"%"),left:0===i?0:s+o,backgroundColor:c.color};e.push(r)}return e}),[t]);return Object(o.jsx)("div",{className:"StatisticsBar",style:{width:n,height:i},children:Object.values(t).map(((e,t)=>{let{percent:n,color:a,label:i="",highlighted:r}=e;return n?Object(o.jsx)(s.a,{title:i,children:Object(o.jsx)("div",{className:c()("StatisticsBar__item",{highlighted:r}),style:{...u[t],left:u[t].left+"%"},onMouseLeave:l,onMouseOver:()=>d(i)})},"".concat(i,"-").concat(a)):null}))})}r.displayName="StatisticsBar";var l=a.memo(r);t.a=l}}]);