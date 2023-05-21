"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[939],{47866:function(D,m,n){n.d(m,{Al:function(){return P},D2:function(){return R},Lk:function(){return A},M1:function(){return t},Pp:function(){return e},Vr:function(){return T},X2:function(){return I},Xh:function(){return u},aV:function(){return l},c5:function(){return o},cl:function(){return a},d0:function(){return v},gR:function(){return G},i4:function(){return p},i9:function(){return y},kP:function(){return L},nc:function(){return c},rx:function(){return F},tz:function(){return C},ws:function(){return S},x4:function(){return r}});var C="/admin/goods/addGoods",l="/admin/goods/updateGoods",u="/admin/goods/removeGoods",p="/admin/goodsPictures/addGoodsPictures",c="/admin/shoppingCarts/addGoods",o="/admin/shoppingCarts/batchRemoveGoods",a="/admin/shoppingCarts/updateBuyCount",s="/admin/shoppingCarts/addShoppingCart",y="/admin/goods/queryAllGoods",S="/admin/goods/queryGoodsDetails",T="/admin/shoppingCarts/queryAllShoppingCarts",B="/admin/shoppingCarts/queryAllGoods",L="/admin/shoppingCarts/batchUpdateSelected",G="/custom/shoppingCarts/queryAllGoods",P="/custom/shoppingCarts/updateBuyCount",A="/custom/goods/queryAllGoods",R="/custom/goods/queryGoodsDetails",I="/custom/shoppingCarts/addShoppingCart",v="/custom/shoppingCarts/addGoods",F="/custom/shoppingCarts/batchRemoveGoods",e="/custom/shoppingCarts/queryAllGoodsCount",t="/custom/shoppingCarts/batchUpdateSelected",r="/user/login",f="/user/logout"},42912:function(D,m,n){var C=n(6154),l=n(9246),u=function(a){l.FN.show({icon:"fail",content:a||"\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"})},p=function(a){if(!a){window.navigator.onLine?u("\u8BF7\u6C42\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"):u("\u7F51\u7EDC\u5DF2\u65AD\u5F00");return}var s=a.status,y=a.data;if(s){switch(s){case 401:u("\u8BF7\u5148\u767B\u5F55"),sessionStorage.removeItem("babyLoveToken");break;case 404:u("\u8BF7\u6C42\u4E0D\u5B58\u5728");break;default:u(y.message||"\u8BF7\u6C42\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5")}return Promise.reject(a)}},c=C.Z.create({timeout:12e3});c.defaults.headers.post["Content-Type"]="application/json;charset=UTF-8",c.interceptors.request.use(function(o){return o},function(o){return Promise.error(o)}),c.interceptors.response.use(function(o){var a=o.status,s=o.data;return a===200?((!s||s.code!==200||!s.success)&&u(s.message),Promise.resolve(o.data)):Promise.reject(o.data)},function(o){return p}),m.Z=c},82405:function(D,m,n){n.d(m,{JG:function(){return F},xE:function(){return v},YX:function(){return R},WF:function(){return G},GJ:function(){return B},Xn:function(){return L},YM:function(){return T},Te:function(){return I},GL:function(){return P}});var C=n(15009),l=n.n(C),u=n(99289),p=n.n(u),c=n(82188),o=n(42912),a=function(t){location.pathname!==t&&(location.href=t)},s={custom:[{title:"\u5546\u54C1",onClick:function(){return a("/view/goods/list")}},{title:"\u8D2D\u7269\u8F66",onClick:function(){return a("/view/shopping-cart")}}],admin:[{title:"\u5546\u54C1",onClick:function(){return a("/view/admin/goods/list")}},{title:"\u8D2D\u7269\u8F66",onClick:function(){return a("/view/admin/shopping-cart")}}]},y=n(9246),S=n(47866),T=!!sessionStorage.getItem("babyLoveToken"),B=location.pathname.startsWith("/view/admin"),L=["/view/admin/login","/view/custom/login","/view/login"].includes(location.pathname),G=function(t,r){t&&(location.pathname.startsWith("/view/admin/")?t="/view/admin".concat(t):t="/view".concat(t),r?location.href=t:c.m8.push(t))},P=function(){G("/login",!0)},A=function(){var e=p()(l()().mark(function t(){var r,f;return l()().wrap(function(g){for(;;)switch(g.prev=g.next){case 0:return g.next=2,o.Z.post(S.X2);case 2:return r=g.sent,f=r.data,g.abrupt("return",f?f.shoppingCartCode:null);case 5:case"end":return g.stop()}},t)}));return function(){return e.apply(this,arguments)}}(),R=function(){var e=p()(l()().mark(function t(){var r;return l()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:if(r=localStorage.getItem("babyloveShoppingCartCode"),r){d.next=5;break}return d.next=4,A();case 4:r=d.sent;case 5:if(r){d.next=7;break}return d.abrupt("return",y.FN.show({icon:"fail",content:"\u6DFB\u52A0\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"}));case 7:return localStorage.setItem("babyloveShoppingCartCode",r),d.abrupt("return",r);case 9:case"end":return d.stop()}},t)}));return function(){return e.apply(this,arguments)}}(),I=function(t){t&&localStorage.setItem("babyloveShoppingCartCode",t)},v=function(){return B?s.admin:s.custom},F=function(t){if(t)try{var r=document.createElement("input");return r.value=t,r.style.height=0,document.body.append(r),r.select(),document.execCommand("Copy"),r.remove(),!0}catch(f){return!1}}},37514:function(D,m,n){n.r(m),n.d(m,{default:function(){return f}});var C=n(15009),l=n.n(C),u=n(99289),p=n.n(u),c=n(12444),o=n.n(c),a=n(72004),s=n.n(a),y=n(25098),S=n.n(y),T=n(31996),B=n.n(T),L=n(26037),G=n.n(L),P=n(9783),A=n.n(P),R=n(47866),I=n(42912),v=n(9246),F=n(82405),e=n(67294),t=n(85893),r=function(d){B()(j,d);var g=G()(j);function j(b){var h;return o()(this,j),h=g.call(this,b),A()(S()(h),"formRef",e.createRef()),A()(S()(h),"login",p()(l()().mark(function M(){var $,U,E,Q,w,z;return l()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return h.setState({isLoading:!0}),U=($=h.formRef.current)===null||$===void 0?void 0:$.getFieldsValue(["username","password"]),E=U.username,Q=U.password,i.prev=2,i.next=5,I.Z.post(R.x4,{username:E,password:Q});case 5:if(w=i.sent,z=w.success,!z){i.next=10;break}return sessionStorage.setItem("babyLoveToken","1"),i.abrupt("return",(0,F.WF)("/"));case 10:i.next=15;break;case 12:i.prev=12,i.t0=i.catch(2),console.error(i.t0);case 15:h.setState({isLoading:!1});case 16:case"end":return i.stop()}},M,null,[[2,12]])}))),h.state={isLoading:!1},h}return s()(j,[{key:"render",value:function(){return(0,t.jsx)("div",{className:"baby-love-login",children:(0,t.jsx)("div",{className:"baby-love-login-form",children:(0,t.jsxs)(v.l0,{ref:this.formRef,layout:"horizontal",footer:(0,t.jsx)(v.zx,{block:!0,type:"submit",color:"primary",size:"large",onClick:this.login,loading:this.state.isLoading,children:"\u767B\u5F55"}),children:[(0,t.jsx)(v.l0.Item,{name:"username",label:"\u767B\u5F55\u540D",rules:[{required:!0,message:"\u767B\u5F55\u540D\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,t.jsx)(v.II,{onChange:console.log,placeholder:"\u8BF7\u8F93\u5165\u767B\u5F55\u540D"})}),(0,t.jsx)(v.l0.Item,{name:"password",label:"\u767B\u5F55\u5BC6\u7801",rules:[{required:!0,message:"\u767B\u5F55\u540D\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,t.jsx)(v.II,{type:"password",onChange:console.log,placeholder:"\u8BF7\u8F93\u5165\u767B\u5F55\u5BC6\u7801"})})]})})})}}]),j}(e.Component),f=r}}]);
