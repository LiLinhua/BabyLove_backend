"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[63],{47866:function(V,G,e){e.d(G,{Al:function(){return n},D2:function(){return C},Dz:function(){return s},Gs:function(){return M},Ir:function(){return N},Lk:function(){return v},M1:function(){return K},OM:function(){return o},Pp:function(){return a},Qc:function(){return T},Vr:function(){return O},X2:function(){return i},XZ:function(){return k},Xh:function(){return I},aV:function(){return g},c5:function(){return u},c9:function(){return l},cl:function(){return E},d0:function(){return R},f9:function(){return j},g7:function(){return $},gR:function(){return r},i4:function(){return t},i9:function(){return m},kL:function(){return Z},kP:function(){return U},mL:function(){return W},nc:function(){return y},o6:function(){return L},pV:function(){return p},re:function(){return c},rx:function(){return Q},tz:function(){return d},ws:function(){return B},x4:function(){return h},xc:function(){return D},yV:function(){return P}});var d="/admin/goods/addGoods",g="/admin/goods/updateGoods",I="/admin/goods/removeGoods",t="/admin/goodsPictures/addGoodsPictures",y="/admin/shoppingCarts/addGoods",u="/admin/shoppingCarts/batchRemoveGoods",E="/admin/shoppingCarts/updateBuyCount",c="/admin/shoppingCarts/queryAllGoodsCount",A="/admin/shoppingCarts/addShoppingCart",m="/admin/goods/queryAllGoods",B="/admin/goods/queryGoodsDetails",O="/admin/shoppingCarts/queryAllShoppingCarts",T="/admin/shoppingCarts/queryAllGoods",U="/admin/shoppingCarts/batchUpdateSelected",M="/admin/orders/queryAllOrders",W="/admin/orders/queryOrderDetails",$="/admin/orders/addOrder",P="/admin/orders/updateOrderBaseInfo",s="/admin/orders/updateOrderGoodsBuyCount",j="/admin/orders/addOrderGoods",k="/admin/orders/removeOrder",N="/admin/catalogs/queryAllCatalogs",Z="/admin/catalogs/createCatalog",L="/admin/catalogs/updateCatalog",o="/admin/catalogs/removeCatalog",r="/custom/shoppingCarts/queryAllGoods",n="/custom/shoppingCarts/updateBuyCount",v="/custom/goods/queryAllGoods",C="/custom/goods/queryGoodsDetails",i="/custom/shoppingCarts/addShoppingCart",R="/custom/shoppingCarts/addGoods",Q="/custom/shoppingCarts/batchRemoveGoods",a="/custom/shoppingCarts/queryAllGoodsCount",K="/custom/shoppingCarts/batchUpdateSelected",D="/custom/orders/queryAllOrders",p="/custom/orders/queryOrderDetails",l="/custom/orders/cancelOrder",h="/user/login",f="/user/logout"},12860:function(V,G,e){e.d(G,{T:function(){return g},x:function(){return I}});var d=e(61544),g=function(y){return[{title:"\u5546\u54C1",className:"baby-love-admin-home-item-goods",onClick:function(){return(0,d.WF)("/goods/list",!0)}},{title:"\u8D2D\u7269",className:"baby-love-admin-home-item-cart",onClick:function(){return(0,d.WF)("/shopping-cart?shoppingCartCode=".concat(y||""),!0)}},{title:"\u8BA2\u5355",className:"baby-love-admin-home-item-order",onClick:function(){return(0,d.WF)("/order/list",!0)}},{title:"\u5206\u7C7B",className:"baby-love-admin-home-item-catalog",onClick:function(){return(0,d.WF)("/catalog/list",!0)}}]},I=function(y){return{custom:[{title:"\u5546\u54C1",onClick:function(){return(0,d.WF)("/goods/list",!0)}},{title:"\u8D2D\u7269\u8F66",onClick:function(){return(0,d.WF)("/shopping-cart?shoppingCartCode=".concat(y||""),!0)}},{title:"\u8BA2\u5355",onClick:function(){return(0,d.WF)("/order/list?shoppingCartCode=".concat(y||""),!0)}}],admin:[{title:"\u5546\u54C1",onClick:function(){return(0,d.WF)("/goods/list",!0)}},{title:"\u8D2D\u7269\u8F66",onClick:function(){return(0,d.WF)("/shopping-cart?shoppingCartCode=".concat(y||""),!0)}},{title:"\u8BA2\u5355",onClick:function(){return(0,d.WF)("/order/list",!0)}}]}}},42912:function(V,G,e){var d=e(6154),g=e(34202),I=e(61544),t=function(A){g.FN.show({icon:"fail",content:A||"\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"})};function y(c){console.log("===========http===========",c);var A=c||{},m=A.data;return m?((!m||m.code!==200||!m.success)&&t(m.message||"\u7CFB\u7EDF\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\uFF01"),Promise.resolve(m)):(t("\u7CFB\u7EDF\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\uFF01"),Promise.reject(m))}function u(c){if(!window.navigator.onLine)return t("\u7F51\u7EDC\u5DF2\u65AD\u5F00"),Promise.reject(c.response||{});var A=c.response,m=A.status,B=A.data;if(m){switch(m){case 401:t("\u8BF7\u5148\u767B\u5F55"),(0,I.f9)(),(0,I.GL)();break;case 404:t("\u8BF7\u6C42\u4E0D\u5B58\u5728");break;default:t(B.message||"\u8BF7\u6C42\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5")}return Promise.reject(c.response||{})}}var E=d.Z.create({timeout:12e3});E.defaults.headers.post["Content-Type"]="application/json;charset=UTF-8",E.interceptors.request.use(function(c){return c},function(c){return Promise.error(c)}),E.interceptors.response.use(y,u),G.Z=E},61544:function(V,G,e){e.d(G,{F3:function(){return N},GJ:function(){return m},GL:function(){return T},JG:function(){return L},Te:function(){return s},V2:function(){return U},WF:function(){return O},YX:function(){return P},f9:function(){return M},hf:function(){return j},on:function(){return k},xE:function(){return Z},y7:function(){return W},yV:function(){return B}});var d=e(15009),g=e.n(d),I=e(99289),t=e.n(I),y=e(82188),u=e(42912),E=e(12860),c=e(34202),A=e(47866),m=location.pathname.startsWith("/view/admin"),B=function(){return["/view/admin/login","/view/custom/login","/view/login"].includes(location.pathname)},O=function(r,n,v){r&&(v||(location.pathname.startsWith("/view/admin")?r="/view/admin".concat(r):r="/view".concat(r)),n?location.href=r:y.m8.push(r))},T=function(){O("/login?callback=".concat(location.pathname),!0)},U=function(){sessionStorage.setItem("babyLoveToken","1")},M=function(){sessionStorage.removeItem("babyLoveToken")},W=function(){return!!sessionStorage.getItem("babyLoveToken")},$=function(){var o=t()(g()().mark(function r(){var n,v;return g()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,u.Z.post(A.X2);case 2:return n=i.sent,v=n.data,i.abrupt("return",v?v.shoppingCartCode:null);case 5:case"end":return i.stop()}},r)}));return function(){return o.apply(this,arguments)}}(),P=function(){var o=t()(g()().mark(function r(){var n;return g()().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:if(n=localStorage.getItem("babyloveShoppingCartCode"),n){C.next=5;break}return C.next=4,$();case 4:n=C.sent;case 5:if(n){C.next=7;break}return C.abrupt("return",c.FN.show({icon:"fail",content:"\u6DFB\u52A0\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"}));case 7:return localStorage.setItem("babyloveShoppingCartCode",n),C.abrupt("return",n);case 9:case"end":return C.stop()}},r)}));return function(){return o.apply(this,arguments)}}(),s=function(r){r&&localStorage.setItem("babyloveShoppingCartCode",r)},j=function(r){r&&localStorage.setItem("babyloveAdminShoppingCartCode",r)},k=function(){return localStorage.getItem("babyloveAdminShoppingCartCode")},N=function(){localStorage.removeItem("babyloveAdminShoppingCartCode")},Z=function(){var o=t()(g()().mark(function r(){var n,v;return g()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,P();case 2:if(n=i.sent,v=(0,E.x)(n),!m){i.next=6;break}return i.abrupt("return",v.admin);case 6:return i.abrupt("return",v.custom);case 7:case"end":return i.stop()}},r)}));return function(){return o.apply(this,arguments)}}(),L=function(r){if(!r)return!1;try{var n=document.createElement("input");return n.value=r,n.style.height=0,document.body.append(n),n.select(),document.execCommand("Copy"),n.remove(),!0}catch(v){return!1}}},57590:function(V,G,e){e.r(G),e.d(G,{default:function(){return v}});var d=e(97857),g=e.n(d),I=e(15009),t=e.n(I),y=e(99289),u=e.n(y),E=e(12444),c=e.n(E),A=e(72004),m=e.n(A),B=e(25098),O=e.n(B),T=e(31996),U=e.n(T),M=e(26037),W=e.n(M),$=e(9783),P=e.n($),s=e(34202),j=e(67294),k=e(71167),N=e.n(k),Z=e(40190),L=e(47866),o=e(42912),r=e(85893),n=function(C){U()(R,C);var i=W()(R);function R(Q){var a;c()(this,R),a=i.call(this,Q),P()(O()(a),"formRef",j.createRef()),P()(O()(a),"getCatalogList",u()(t()().mark(function D(){var p,l;return t()().wrap(function(f){for(;;)switch(f.prev=f.next){case 0:return f.next=2,o.Z.post(L.Ir);case 2:p=f.sent,l=p.data,Array.isArray(l)&&a.setState({catalogList:l});case 5:case"end":return f.stop()}},D)}))),P()(O()(a),"getGoodsDetails",u()(t()().mark(function D(){var p,l,h,f;return t()().wrap(function(S){for(;;)switch(S.prev=S.next){case 0:if(a.goodsCode){S.next=2;break}return S.abrupt("return");case 2:return S.next=4,o.Z.get(L.ws,{params:{goodsCode:a.goodsCode}});case 4:p=S.sent,l=p.data,l&&(f=g()({},l),Array.isArray(l.pictures)&&(f.pictures=f.pictures.map(function(b){return g()(g()({},b),{},{url:b.pictureUrl})})),(h=a.formRef.current)===null||h===void 0||h.setFieldsValue(f));case 7:case"end":return S.stop()}},D)}))),P()(O()(a),"uploadImgFile",function(){var D=u()(t()().mark(function p(l){var h,f,F;return t()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return h=new FormData,h.append("files",l),b.next=4,o.Z.post(L.i4,h,{headers:{"Content-Type":"multipart/form-data"}});case 4:if(f=b.sent,F=f.data,!(F&&F[0])){b.next=10;break}return b.abrupt("return",{pictureCode:F[0].pictureCode,url:F[0].pictureUrl});case 10:return b.abrupt("return",{});case 11:case"end":return b.stop()}},p)}));return function(p){return D.apply(this,arguments)}}()),P()(O()(a),"save",u()(t()().mark(function D(){var p,l,h,f,F,S;return t()().wrap(function(w){for(;;)switch(w.prev=w.next){case 0:return l=(p=a.formRef.current)===null||p===void 0?void 0:p.getFieldsValue(),l.goodsPictureCodes=l.pictures.map(function(x){return x.pictureCode}),h=L.tz,a.goodsCode&&(l.goodsCode=a.goodsCode,h=L.aV),w.next=6,o.Z.post(h,l);case 6:f=w.sent,F=f.success,F&&(s.FN.show({content:"\u4FDD\u5B58\u6210\u529F",icon:"success"}),!a.goodsCode&&((S=a.formRef.current)===null||S===void 0||S.resetFields()));case 9:case"end":return w.stop()}},D)}))),a.state={catalogList:[]};var K=new URLSearchParams(location.search);return a.goodsCode=K.get("goodsCode"),a}return m()(R,[{key:"componentDidMount",value:function(){this.getCatalogList(),this.getGoodsDetails()}},{key:"render",value:function(){var a=this.state,K=a.goodsDetails,D=a.catalogList;return(0,r.jsx)("div",{className:"baby-love-goods-edit",children:(0,r.jsx)("div",{className:"baby-love-goods-edit-form",children:(0,r.jsxs)(s.l0,{ref:this.formRef,footer:(0,r.jsx)(s.zx,{block:!0,type:"submit",color:"primary",size:"large",onClick:this.save,children:"\u4FDD\u5B58"}),children:[(0,r.jsx)(s.l0.Item,{name:"goodsCatalog",label:"\u5546\u54C1\u5206\u7C7B",rules:[{required:!0,message:"\u5546\u54C1\u5206\u7C7B\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(s.Y8.Group,{children:D.map(function(p){return(0,r.jsx)(s.Y8,{value:p.catalogCode,children:p.catalogName})})})}),(0,r.jsx)(s.l0.Item,{name:"goodsTitle",label:"\u5546\u54C1\u6807\u9898",rules:[{required:!0,message:"\u5546\u54C1\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(s.II,{placeholder:"\u8BF7\u8F93\u5165\u5546\u54C1\u6807\u9898"})}),(0,r.jsx)(s.l0.Item,{name:"goodsSubtitle",label:"\u5546\u54C1\u526F\u6807\u9898",rules:[{required:!1,message:"\u5546\u54C1\u526F\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(s.II,{placeholder:"\u8BF7\u8F93\u5165\u5546\u54C1\u526F\u6807\u9898"})}),(0,r.jsx)(s.l0.Item,{name:"pictures",label:"\u5546\u54C1\u56FE\u7247",rules:[{required:!0,message:"\u5546\u54C1\u56FE\u7247\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(s.wA,{upload:this.uploadImgFile})}),(0,r.jsx)(s.l0.Item,{name:"goodsPrice",label:"\u5546\u54C1\u4EF7\u683C",rules:[{required:!0,message:"\u5546\u54C1\u4EF7\u683C\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(s.II,{min:0,type:"number",placeholder:"\u8BF7\u8F93\u5165\u5546\u54C1\u4EF7\u683C"})}),(0,r.jsx)(s.l0.Item,{name:"goodsInventory",label:"\u5546\u54C1\u5E93\u5B58",rules:[{required:!0,message:"\u5546\u54C1\u5E93\u5B58\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(s.II,{min:0,type:"number",placeholder:"\u8BF7\u8F93\u5165\u5546\u54C1\u5E93\u5B58"})}),(0,r.jsx)(s.l0.Item,{name:"goodsDetails",label:"\u5546\u54C1\u8BE6\u60C5",rules:[{required:!1,message:"\u5546\u54C1\u8BE6\u60C5\u4E0D\u80FD\u4E3A\u7A7A"}],children:(0,r.jsx)(N(),{theme:"snow",value:K,onChange:this.setGoodsDetails})})]})})})}}]),R}(j.Component),v=n}}]);
