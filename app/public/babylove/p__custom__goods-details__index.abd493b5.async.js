"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[708],{54405:function(O,T,o){o.r(T),o.d(T,{default:function(){return K}});var I=o(15009),p=o.n(I),b=o(99289),D=o.n(b),$=o(12444),m=o.n($),P=o(72004),f=o.n(P),L=o(25098),S=o.n(L),F=o(31996),C=o.n(F),A=o(26037),y=o.n(A),z=o(9783),x=o.n(z),g=o(16763),j=o(67294),N=o(47866),G=o(42912),M=o(82405),R=o(49271),t=o(85893),Z=function(u){C()(e,u);var c=y()(e);function e(r){return m()(this,e),c.call(this,r)}return f()(e,[{key:"render",value:function(){var s=this.props.addToCart;return(0,t.jsx)("div",{className:"baby-love-custom-goods-details-add-to-cart",children:(0,t.jsx)(g.zx,{color:"primary",onClick:s,children:"\u52A0\u5165\u8D2D\u7269\u8F66"})})}}]),e}(j.Component),B=Z,E=function(u){C()(e,u);var c=y()(e);function e(r){return m()(this,e),c.call(this,r)}return f()(e,[{key:"render",value:function(){var s=this.props,i=s.goodsTitle,d=s.goodsSubtitle,n=s.goodsPrice,l=s.goodsDetails;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"baby-love-custom-goods-details-base-info",children:[(0,t.jsxs)("p",{className:"baby-love-custom-goods-details-price",children:["\xA5",n||"--"]}),(0,t.jsx)("p",{className:"baby-love-custom-goods-details-title",children:i||"--"}),(0,t.jsx)("p",{className:"baby-love-custom-goods-details-subtitle",children:d})]}),(0,t.jsx)("div",{className:"baby-love-custom-goods-details-details",dangerouslySetInnerHTML:{__html:l}})]})}}]),e}(j.Component),U=E,H=o(90336),X=function(u){C()(e,u);var c=y()(e);function e(r){return m()(this,e),c.call(this,r)}return f()(e,[{key:"render",value:function(){var s=this.props,i=s.pictures,d=s.goodsInventory;return(0,t.jsxs)("div",{className:"baby-love-custom-goods-details-swiper",children:[i!=null&&i.length?(0,t.jsx)(g.tq,{autoplay:!0,loop:!0,children:(i||[]).map(function(n){return(0,t.jsx)(g.tq.Item,{children:(0,t.jsx)("div",{className:"baby-love-custom-goods-details-swiper-item",children:(0,t.jsx)("img",{src:n.pictureUrl})})},n.pictureCode)})}):(0,t.jsx)("img",{src:H}),(0,t.jsxs)("span",{className:"baby-love-custom-goods-details-inventory",children:["\u4EC5\u5269",d,"\u4EF6"]})]})}}]),e}(j.Component),Y=X,J=function(u){C()(e,u);var c=y()(e);function e(r){var s;m()(this,e),s=c.call(this,r),x()(S()(s),"setLoading",function(d){s.setState({isShowLoading:d})}),x()(S()(s),"getGoodsDetails",D()(p()().mark(function d(){var n,l;return p()().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(s.goodsCode){a.next=2;break}return a.abrupt("return");case 2:return a.next=4,G.Z.get(N.D2,{params:{goodsCode:s.goodsCode}});case 4:n=a.sent,l=n.data,l&&s.setState({goodsDetails:l}),s.setLoading(!1);case 8:case"end":return a.stop()}},d)}))),x()(S()(s),"addToCart",D()(p()().mark(function d(){var n,l,h,a;return p()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,(0,M.YX)();case 2:return n=v.sent,v.next=5,G.Z.post(N.d0,{shoppingCartCode:n,goodsCode:s.goodsCode,buyCount:1});case 5:l=v.sent,h=l.success,h&&(g.FN.show({icon:"success",content:"\u6DFB\u52A0\u6210\u529F"}),(a=s.props.ShoppingCart)===null||a===void 0||a.flushShoppingCartGoodsCount());case 8:case"end":return v.stop()}},d)}))),s.state={goodsDetails:{},isShowLoading:!0};var i=new URLSearchParams(location.search);return s.goodsCode=i.get("goodsCode"),s}return f()(e,[{key:"componentDidMount",value:function(){this.getGoodsDetails()}},{key:"render",value:function(){var s=this.state.goodsDetails||{},i=s.goodsTitle,d=s.goodsSubtitle,n=s.goodsPrice,l=s.goodsDetails,h=s.goodsInventory,a=s.pictures;return(0,t.jsx)("div",{className:"baby-love-custom-goods",children:(0,t.jsxs)("div",{className:"baby-love-custom-goods-details",children:[this.state.isShowLoading?(0,t.jsx)(g.k_,{color:"primary"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(Y,{pictures:a,goodsInventory:h}),(0,t.jsx)(U,{goodsTitle:i,goodsSubtitle:d,goodsDetails:l,goodsPrice:n}),(0,t.jsx)(B,{addToCart:this.addToCart})]}),(0,t.jsx)(R.Z,{})]})})}}]),e}(j.Component),K=J}}]);