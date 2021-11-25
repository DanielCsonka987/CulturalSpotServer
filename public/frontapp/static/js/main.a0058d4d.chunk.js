(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{83:function(e,t,n){},89:function(e,t,n){},92:function(e,t,n){"use strict";n.r(t);var r=n(3),s=n(60),a=n.n(s),o=(n(83),n(21)),c=n(15),i=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,97)).then((function(t){var n=t.getCLS,r=t.getFID,s=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),r(e),s(e),a(e),o(e)}))},l=n(9),u=n(16),j=n(27),d=n(96),b=n(28),p=function(e){return Date.now()+1e3*e},h=n(61),g=function(e,t){var n,r={field:[],message:[]},s=Object(h.a)(t);try{for(s.s();!(n=s.n()).done;){var a=n.value,o=x[a](e);o&&(r.field.push(a),r.message.push(o))}}catch(c){s.e(c)}finally{s.f()}return r},O=new RegExp("[a-zA-Z0-9_ ]{4,}"),f=new RegExp(".{6,}"),m=new RegExp("^[a-z0-9._]{3,}@[a-z]{3,}.{1}[a-z]{2,3}$"),x={email:function(e){var t=e.email.split(".").reverse();return t[0].length<2||t[0].length>3?"Not acceptable email!":m.test(e.email)?"":"Not acceptable email!"},username:function(e){return e.username.length>50?"Too long username!":O.test(e.username)?"":"Not acceptable username!"},password:function(e){return f.test(e.password)?"":"Not acceptable password!"},passwordconf:function(e){return e.password===e.passwordconf&&f.test(e.passwordconf)?"":"Not acceptable password confirmation!"}};var v=function(e){var t,n=e.split(".");return(24!==(t=n[0]).length||new RegExp(/[a-f0-9]{24}/).test(t))&&n[1]&&n[2]&&n[3]};function w(e,t){for(var n=0;n<e.length;n++)localStorage.setItem(e[n],t[n])}function C(){!function(e){for(var t=0;t<e.length;t++)localStorage.removeItem(e[t])}(["authToken","refreshToken","expireDate"])}var y,E=n(1),k={user:null,newContent:[]},S=Object(b.a)(y||(y=Object(j.a)(["\n    query requireClientContent{\n        requireClientContent{\n            id, email, username, registeredAt, lastLoggedAt\n        }\n    }\n    "]))),I=Object(r.createContext)({user:null,newContent:[],login:function(e){},logout:function(){}});function F(e,t){switch(t.type){case"LOGIN":return Object(o.a)(Object(o.a)({},e),{},{user:t.payload});case"LOGOUT":return Object(o.a)(Object(o.a)({},e),{},{user:null,newContent:[]});default:return e}}function T(e){var t=Object(r.useReducer)(F,k),n=Object(u.a)(t,2),s=n[0],a=n[1],o=Object(d.a)(S,{onCompleted:function(e){a({type:"LOGIN",payload:e.requireClientContent})},onError:function(e){console.log(e.message)}}),c=Object(u.a)(o,2),i=c[0],l=c[1].called;return Object(r.useEffect)((function(){!function(){var e={refreshToken:localStorage.getItem("refreshToken"),token:localStorage.getItem("authToken"),expireDate:localStorage.getItem("expireDate")};return!Object.values(e).includes(null)&&e}()||s.user||l||i()})),Object(E.jsx)(I.Provider,{value:{user:s.user,newContent:s.newContent,login:function(e){!function(e){w(["authToken","refreshToken","expireDate"],[e.token,e.refreshToken,p(e.tokenExpire)])}(e),delete e.token,delete e.tokenExpire,delete e.refreshToken,a({type:"LOGIN",payload:e})},logout:function(){C(),a({type:"LOGOUT"})}},children:e.children})}var $=n(95),L=n(42),P=function(e,t){var n=Object(r.useState)(e),s=Object(u.a)(n,2),a=s[0],c=s[1];return{values:a,onSubmit:function(e){e.preventDefault(),t()},onChange:function(e){c(Object(o.a)(Object(o.a)({},a),{},Object(L.a)({},e.target.name,e.target.value)))},clearFields:function(){c(e)}}},A=function(){var e=Object(r.useState)({field:[],message:[]}),t=Object(u.a)(e,2),n=t[0],s=t[1];return{errors:n,resetErrors:function(){s({field:[],message:[]})},setValidationErrors:function(e){s({field:e.field,message:e.message})},setGeneralErrors:function(e){s({field:[],message:[e]})}}},N=function(e,t){var n=Object(l.g)();e&&n.push(t)};var G,R=function(e){var t=e.labeling,n=e.type,r=e.name,s=e.value,a=e.funcChange,o=e.invalidInputs.field.includes(r);return Object(E.jsxs)("label",{children:[t,o?"**":"",Object(E.jsx)("input",{type:n,value:s,name:r,onChange:a})]})},U=function(e){var t=e.text;return Object(E.jsx)("p",{children:t})};var D,q=Object(b.a)(G||(G=Object(j.a)(["\n    mutation login(\n        $email: String!\n        $password: String!\n    ){\n        login(\n            email: $email\n            password: $password\n        ){\n            id, email, username, token, tokenExpire, refreshToken, registeredAt, lastLoggedAt\n        }\n    }\n"]))),z=function(){var e=["email","password"],t=A(),n=t.errors,s=t.resetErrors,a=t.setValidationErrors,o=t.setGeneralErrors,i=P({email:"",password:""},(function(){s();var t=g(j,e);0===t.field.length?f():a(t)})),j=i.values,d=i.onSubmit,b=i.onChange,p=Object(r.useContext)(I),h=Object($.a)(q,{update:function(e,t){var n=t.data.login;p.login(n),s()},onError:function(e){console.log(e),o(e.message)},variables:j}),O=Object(u.a)(h,2),f=O[0],m=O[1].loading;return Object(E.jsxs)("div",{children:[Object(E.jsx)("h3",{children:"Login page"}),p.user?Object(E.jsx)(l.a,{to:"/"}):Object(E.jsx)(E.Fragment,{}),Object(E.jsxs)("form",{children:[Object(E.jsx)(R,{labeling:"Email",type:"text",invalidInputs:n,name:"email",value:j.email,funcChange:b}),Object(E.jsx)(R,{labeling:"Password",type:"password",invalidInputs:n,name:"password",value:j.password,funcChange:b}),Object(E.jsx)("input",{type:"submit",value:"Login",onClick:d}),m&&Object(E.jsx)("p",{children:"Under process..."}),n.message.length>0&&n.message.map((function(e,t){}))]}),Object(E.jsx)("p",{children:Object(E.jsx)(c.b,{to:"/passwordresetting/email",children:"Did you forget the password?"})})]})};var V,B=Object(b.a)(D||(D=Object(j.a)(["\n    mutation registration(\n        $email: String!,\n        $username: String!,\n        $password: String!,\n        $passwordconf: String!\n    ){\n        registration(\n            email: $email,\n            username: $username,\n            password: $password,\n            passwordconf: $passwordconf\n        ){\n            id, email, username, token, tokenExpire, refreshToken, registeredAt, lastLoggedAt\n        }\n    }\n"]))),Y=function(){var e=["email","username","password","passwordconf"],t=P({email:"",username:"",password:"",passwordconf:""},(function(){i();var t=g(n,e);0===t.field.length?O():j(t)})),n=t.values,s=t.onSubmit,a=t.onChange,o=A(),c=o.errors,i=o.resetErrors,j=o.setValidationErrors,d=o.setGeneralErrors,b=Object(r.useContext)(I),p=Object($.a)(B,{update:function(e,t){var n=t.data.registration;b.login(n),i()},onError:function(e){d(e.message)},variables:n}),h=Object(u.a)(p,2),O=h[0],f=h[1].loading;return Object(E.jsxs)("div",{children:[Object(E.jsx)("h3",{children:"Registration"}),b.user?Object(E.jsx)(l.a,{to:"/"}):Object(E.jsx)(E.Fragment,{}),Object(E.jsx)("p",{children:"Please fill this form with some registration details."}),Object(E.jsxs)("form",{children:[Object(E.jsx)(R,{labeling:"Email",type:"email",invalidInputs:c,name:"email",value:n.email,funcChange:a}),Object(E.jsx)(R,{labeling:"Username",type:"text",invalidInputs:c,name:"username",value:n.username,funcChange:a}),Object(E.jsx)(R,{labeling:"Password",type:"password",invalidInputs:c,name:"password",value:n.password,funcChange:a}),Object(E.jsx)(R,{labeling:"Confrim password",type:"password",invalidInputs:c,name:"passwordconf",value:n.passwordconf,funcChange:a}),Object(E.jsx)("input",{type:"submit",value:"Send",onClick:s}),f&&Object(E.jsx)("p",{children:"Under process..."}),c.message.length>0&&c.message.map((function(e,t){return Object(E.jsx)(U,{text:e},t)}))]})]})};var J,_=function(){var e=Object(r.useContext)(I);N(e.user);var t=["email"],n=A(),s=n.errors,a=n.resetErrors,o=n.setValidationErrors,c=n.setGeneralErrors,i=P({email:""},(function(){a();var e=g(l,t);0===e.field.length?O():o(e)})),l=i.values,j=i.onSubmit,d=i.onChange,b=i.clearFields,p=Object($.a)(M,{update:function(e,t){t.data.resetPasswordStep1;b(),a()},onError:function(e){console.log(e),c(e.message)},variables:l}),h=Object(u.a)(p,2),O=h[0],f=h[1].loading;return Object(E.jsxs)("div",{children:[Object(E.jsx)("h4",{children:"Forgotten password resetting - sending authenticator email"}),Object(E.jsx)("p",{children:"For resetting forgotten password, please give your email which you have been registered to the site!"}),Object(E.jsx)("p",{children:"You will get an email with a link URL, with which you can continue the forgotten password resetting process."}),Object(E.jsxs)("form",{children:[Object(E.jsx)(R,{labeling:"Email",type:"email",invalidInputs:s,name:"email",value:l.email,funcChange:d}),Object(E.jsx)("input",{type:"submit",value:"Continue",onClick:j}),f&&Object(E.jsx)("p",{children:"Under process..."}),s.message.length>0&&s.message.map((function(e,t){}))]})]})},M=Object(b.a)(V||(V=Object(j.a)(["\n    mutation resetPasswordStep1(\n        $email: String!\n    ){\n        resetPasswordStep1(\n            email: $email\n        ){\n            resultText, id, email, username    \n        }\n    }\n"])));var W=function(){var e=Object(r.useContext)(I);N(e.user);var t=Object(l.g)(),n=Object(l.i)();v(n.token)||t.push("/");var s=["password","passwordconf"],a=A(),o=a.errors,c=a.resetErrors,i=a.setValidationErrors,j=a.setGeneralErrors,d=P({password:"",passwordconf:""},(function(){c();var e=g(b,s);0===e.field.length?x():i(e)})),b=d.values,p=d.onSubmit,h=d.onChange,O=d.clearFields,f=Object($.a)(Z,{update:function(e,n){n.data.resetPasswordStep3;c(),O(),t.push("/resetpassword/result")},onError:function(e){console.log(e),j(e.message)},variables:b,context:{headers:{resetting:n.token}}}),m=Object(u.a)(f,2),x=m[0],w=m[1].loading;return Object(E.jsxs)("div",{children:[Object(E.jsx)("h4",{children:"Forgotten password resetting - sending authenticator email"}),Object(E.jsx)("p",{children:"For resetting forgotten password, please give your email which you have been registered to the site!"}),Object(E.jsx)("p",{children:"You will get an email with a link URL, with which you can continue the forgotten password resetting process."}),Object(E.jsxs)("form",{children:[Object(E.jsx)(R,{labeling:"New Password",type:"password",invalidInputs:o,name:"password",value:b.password,funcChange:h}),Object(E.jsx)(R,{labeling:"Confirm password",type:"password",invalidInputs:o,name:"passwordconf",value:b.passwordConfirm,funcChange:h}),Object(E.jsx)("input",{type:"submit",value:"Change password",onClick:p}),w&&Object(E.jsx)("p",{children:"Under process..."}),o.message.length>0&&o.message.map((function(e,t){}))]})]})},Z=Object(b.a)(J||(J=Object(j.a)(["\n    mutation resetPasswordStep3(\n        $password: String!\n        $passwordconf: String!\n    ){\n        resetPasswordStep3(\n            newpassword: $password,\n            newconf: $passwordconf\n        ){\n            resultText, id, email, username    \n        }\n    }\n"])));var H=function(){var e=Object(r.useContext)(I);return N(e.user),Object(E.jsxs)("div",{children:[Object(E.jsx)("h4",{children:"Your Forgotten Password has been resetted!"}),Object(E.jsx)("p",{children:"A minute later you can use your new password!"})]})};var K=function(){var e=Object(l.j)(),t=e.path,n=e.url;return Object(E.jsxs)("div",{children:[Object(E.jsx)("h3",{children:"Forgotten password resetting page"}),Object(E.jsxs)(l.d,{children:[Object(E.jsx)(l.b,{path:"".concat(t,"/email"),children:Object(E.jsx)(_,{})}),Object(E.jsx)(l.b,{path:"".concat(t,"/result"),children:Object(E.jsx)(H,{})}),Object(E.jsx)(l.b,{path:"".concat(t,"/:token"),children:Object(E.jsx)(W,{})}),Object(E.jsx)(l.a,{from:"".concat(n),to:"/"})]})]})};var Q=function(){return Object(E.jsx)("div",{children:"Wellcome this site!"})};var X=function(){var e=Object(r.useContext)(I);return Object(r.useEffect)((function(){e.logout()})),Object(E.jsx)(l.a,{to:"/"})};var ee=function(){return Object(E.jsx)("div",{children:Object(E.jsx)("h3",{children:"Review content"})})};var te=function(){return Object(E.jsx)("div",{children:Object(E.jsx)("h3",{children:"Chattings"})})};var ne=function(){return Object(E.jsx)("div",{children:Object(E.jsx)("h3",{children:"Account dashboard"})})};var re=function(){return Object(E.jsx)("div",{children:Object(E.jsx)("h3",{children:"Friends"})})};var se=function(){return Object(E.jsx)("div",{children:Object(E.jsx)("h3",{children:"Posts"})})};var ae=function(){var e=Object(r.useContext)(I);return Object(E.jsx)(E.Fragment,{children:e.user?Object(E.jsxs)(l.d,{children:[Object(E.jsx)(l.b,{path:"/logout",component:X}),Object(E.jsx)(l.b,{path:"/account",component:ne}),Object(E.jsx)(l.b,{path:"/friends",component:re}),Object(E.jsx)(l.b,{path:"/posts",component:se}),Object(E.jsx)(l.b,{path:"/chats",component:te}),Object(E.jsx)(l.b,{path:"/",component:ee})]}):Object(E.jsxs)(l.d,{children:[Object(E.jsx)(l.b,{exact:!0,path:"/login",component:z}),Object(E.jsx)(l.b,{exact:!0,path:"/registration",component:Y}),Object(E.jsx)(l.b,{path:"/passwordresetting",component:K}),Object(E.jsx)(l.b,{path:"/",component:Q})]})})};var oe=function(){var e=Object(r.useContext)(I),t=Object(l.h)().pathname.split("/"),n=Object(u.a)(t,1)[0],s=Object(r.useState)({active:n.toLowerCase()}),a=Object(u.a)(s,2);return a[0],a[1],Object(E.jsx)("nav",{children:e.user?Object(E.jsxs)(E.Fragment,{children:[Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/account",children:"My account"})}),Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/friends",children:"Friends"})}),Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/posts",children:"Posts"})}),Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/chats",children:"Chatting"})}),Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/logout",children:"Logout"})})]}):Object(E.jsxs)(E.Fragment,{children:[Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/login",children:"Login"})}),Object(E.jsx)("li",{children:Object(E.jsx)(c.b,{to:"/registration",children:"Registration"})})]})})};n(89);var ce=function(){return Object(r.useEffect)((function(){i()})),Object(E.jsxs)("div",{className:"App",children:[Object(E.jsx)("header",{className:"App-header",children:Object(E.jsx)("h1",{children:"Cultural spot"})}),Object(E.jsx)(T,{children:Object(E.jsxs)(c.a,{children:[Object(E.jsx)(oe,{}),Object(E.jsx)(ae,{})]})})]})},ie=n(68),le=n(71),ue=n(19),je=n(72),de=n(94),be=Object(je.a)({uri:"http://localhost:4040/graphql"}),pe=new ue.a((function(e,t){return e.getContext("refreshing")&&e.setContext((function(e){var t=e.headers,n=void 0===t?{}:t;return{headers:Object(o.a)(Object(o.a)({},n),{},{refreshing:localStorage.getItem("refreshToken")||null})}})),e.setContext((function(e){var t=e.headers,n=void 0===t?{}:t;return{headers:Object(o.a)(Object(o.a)({},n),{},{authorization:"Bearer "+(localStorage.getItem("authToken")||"")})}})),t(e)})),he=new ue.a((function(e,t){return t(e).map((function(e){return e}))})),ge=new ie.a({link:Object(ue.c)([pe,he,be]),cache:new le.a}),Oe=Object(E.jsx)(de.a,{client:ge,children:Object(E.jsx)(ce,{})});a.a.render(Oe,document.getElementById("root")),i()}},[[92,1,2]]]);
//# sourceMappingURL=main.a0058d4d.chunk.js.map