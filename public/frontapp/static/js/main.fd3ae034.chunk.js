(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{83:function(e,t,n){},89:function(e,t,n){},92:function(e,t,n){"use strict";n.r(t);var r=n(3),s=n(60),a=n.n(s),o=(n(83),n(18)),c=n(15),i=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,97)).then((function(t){var n=t.getCLS,r=t.getFID,s=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),r(e),s(e),a(e),o(e)}))},l=n(9),u=n(16),j=n(37),d=n(27),b=n(96),p=n(28),O=function(e){return Date.now()+1e3*e},h=n(61),g=function(e,t){var n,r={field:[],message:[]},s=Object(h.a)(t);try{for(s.s();!(n=s.n()).done;){var a=n.value,o=v[a](e);o&&(r.field.push(a),r.message.push(o))}}catch(c){s.e(c)}finally{s.f()}return r},f=new RegExp("[a-zA-Z0-9_ ]{4,}"),m=new RegExp(".{6,}"),x=new RegExp("^[a-z0-9._]{3,}@[a-z]{3,}.{1}[a-z]{2,3}$"),v={email:function(e){var t=e.email.split(".").reverse();return t[0].length<2||t[0].length>3?"Not acceptable email!":x.test(e.email)?"":"Not acceptable email!"},username:function(e){return e.username.length>50?"Too long username!":f.test(e.username)?"":"Not acceptable username!"},password:function(e){return m.test(e.password)?"":"Not acceptable password!"},passwordconf:function(e){return e.password===e.passwordconf&&m.test(e.passwordconf)?"":"Not acceptable password confirmation!"}};var w=function(e){var t,n=e.split(".");return(24!==(t=n[0]).length||new RegExp(/[a-f0-9]{24}/).test(t))&&n[1]&&n[2]&&n[3]};function E(e,t){for(var n=0;n<e.length;n++)localStorage.setItem(e[n],t[n])}function C(){!function(e){for(var t=0;t<e.length;t++)localStorage.removeItem(e[t])}(["authToken","refreshToken","expireDate"])}var y,k=n(1),S={user:null,newContent:[]},T=Object(p.a)(y||(y=Object(d.a)(["\n    query requireClientContent{\n        requireClientContent{\n            id, email, username, registeredAt, lastLoggedAt\n        }\n    }\n    "]))),I=Object(r.createContext)(Object(j.a)({user:null,newContent:[],srvError:"",login:function(e){},logout:function(){}},"srvError",(function(e){})));function L(e,t){switch(t.type){case"LOGIN":return Object(o.a)(Object(o.a)({},e),{},{user:t.payload});case"LOGOUT":return Object(o.a)(Object(o.a)({},e),{},{user:null,newContent:[]});case"ERROR":return Object(o.a)(Object(o.a)({},e),{},{srvError:t.payload});default:return e}}function D(e){var t=Object(r.useReducer)(L,S),n=Object(u.a)(t,2),s=n[0],a=n[1],o=Object(b.a)(T,{onCompleted:function(e){a({type:"LOGIN",payload:e.requireClientContent})},onError:function(e){console.log(e.message)}}),c=Object(u.a)(o,2),i=c[0],l=c[1].called;return Object(r.useEffect)((function(){!function(){var e={refreshToken:localStorage.getItem("refreshToken"),token:localStorage.getItem("authToken"),expireDate:localStorage.getItem("expireDate")};return!Object.values(e).includes(null)&&e}()||s.user||l||i()})),Object(k.jsx)(I.Provider,{value:{user:s.user,newContent:s.newContent,login:function(e){!function(e){E(["authToken","refreshToken","expireDate"],[e.token,e.refreshToken,O(e.tokenExpire)])}(e),delete e.token,delete e.tokenExpire,delete e.refreshToken,a({type:"LOGIN",payload:e})},logout:function(){C(),a({type:"LOGOUT"})},srvError:function(e){a({type:"ERROR",payload:e})}},children:e.children})}var F=n(95),N=function(e,t){var n=Object(r.useState)(e),s=Object(u.a)(n,2),a=s[0],c=s[1];return{values:a,onSubmit:function(e){e.preventDefault(),t()},onChange:function(e){c(Object(o.a)(Object(o.a)({},a),{},Object(j.a)({},e.target.name,e.target.value)))},clearFields:function(){c(e)}}},$=function(){var e=Object(r.useState)({field:[],message:[]}),t=Object(u.a)(e,2),n=t[0],s=t[1];return{errors:n,resetErrors:function(){s({field:[],message:[]})},setValidationErrors:function(e){s({field:e.field,message:e.message})},setGeneralErrors:function(e){s({field:[],message:[e]})}}},G=function(e,t){var n=Object(l.g)(),s=Object(r.useContext)(I);(s.user&&"LOGOUT_NEEDED"===e||!s.user&&"LOGIN_NEEDED"===e)&&n.push(t)};var P,R=function(e){var t=e.labeling,n=e.type,r=e.name,s=e.value,a=e.funcChange,o=e.invalidInputs.field.includes(r);return Object(k.jsxs)("label",{children:[t,o?"**":"",Object(k.jsx)("input",{type:n,value:s,name:r,onChange:a})]})},U=function(e){var t=e.text;return Object(k.jsx)("p",{children:t})};var A,_=Object(p.a)(P||(P=Object(d.a)(["\n    mutation login(\n        $email: String!\n        $password: String!\n    ){\n        login(\n            email: $email\n            password: $password\n        ){\n            id, email, username, token, tokenExpire, refreshToken, registeredAt, lastLoggedAt\n        }\n    }\n"]))),q=function(){G("LOGOUT_NEEDED","/");var e=["email","password"],t=$(),n=t.errors,s=t.resetErrors,a=t.setValidationErrors,o=t.setGeneralErrors,i=N({email:"",password:""},(function(){s();var t=g(j,e);0===t.field.length?f():a(t)})),j=i.values,d=i.onSubmit,b=i.onChange,p=Object(r.useContext)(I),O=Object(F.a)(_,{update:function(e,t){var n=t.data.login;p.login(n),s()},onError:function(e){console.log(e),o(e.message)},variables:j}),h=Object(u.a)(O,2),f=h[0],m=h[1].loading;return Object(k.jsxs)("div",{children:[Object(k.jsx)("h3",{children:"Login page"}),p.user?Object(k.jsx)(l.a,{to:"/"}):Object(k.jsx)(k.Fragment,{}),Object(k.jsxs)("form",{children:[Object(k.jsx)(R,{labeling:"Email",type:"text",invalidInputs:n,name:"email",value:j.email,funcChange:b}),Object(k.jsx)(R,{labeling:"Password",type:"password",invalidInputs:n,name:"password",value:j.password,funcChange:b}),Object(k.jsx)("input",{type:"submit",value:"Login",onClick:d}),m&&Object(k.jsx)("p",{children:"Under process..."}),n.message.length>0&&n.message.map((function(e,t){return Object(k.jsx)(U,{text:e},t)}))]}),Object(k.jsx)("p",{children:Object(k.jsx)(c.b,{to:"/passwordresetting/email",children:"Did you forget the password?"})})]})};var z,V=Object(p.a)(A||(A=Object(d.a)(["\n    mutation registration(\n        $email: String!,\n        $username: String!,\n        $password: String!,\n        $passwordconf: String!\n    ){\n        registration(\n            email: $email,\n            username: $username,\n            password: $password,\n            passwordconf: $passwordconf\n        ){\n            id, email, username, token, tokenExpire, refreshToken, registeredAt, lastLoggedAt\n        }\n    }\n"]))),B=function(){G("LOGOUT_NEEDED","/");var e=["email","username","password","passwordconf"],t=N({email:"",username:"",password:"",passwordconf:""},(function(){i();var t=g(n,e);0===t.field.length?h():j(t)})),n=t.values,s=t.onSubmit,a=t.onChange,o=$(),c=o.errors,i=o.resetErrors,j=o.setValidationErrors,d=o.setGeneralErrors,b=Object(r.useContext)(I),p=Object(F.a)(V,{update:function(e,t){var n=t.data.registration;b.login(n),i()},onError:function(e){d(e.message)},variables:n}),O=Object(u.a)(p,2),h=O[0],f=O[1].loading;return Object(k.jsxs)("div",{children:[Object(k.jsx)("h3",{children:"Registration"}),b.user?Object(k.jsx)(l.a,{to:"/"}):Object(k.jsx)(k.Fragment,{}),Object(k.jsx)("p",{children:"Please fill this form with some registration details."}),Object(k.jsxs)("form",{children:[Object(k.jsx)(R,{labeling:"Email",type:"email",invalidInputs:c,name:"email",value:n.email,funcChange:a}),Object(k.jsx)(R,{labeling:"Username",type:"text",invalidInputs:c,name:"username",value:n.username,funcChange:a}),Object(k.jsx)(R,{labeling:"Password",type:"password",invalidInputs:c,name:"password",value:n.password,funcChange:a}),Object(k.jsx)(R,{labeling:"Confrim password",type:"password",invalidInputs:c,name:"passwordconf",value:n.passwordconf,funcChange:a}),Object(k.jsx)("input",{type:"submit",value:"Send",onClick:s}),f&&Object(k.jsx)("p",{children:"Under process..."}),c.message.length>0&&c.message.map((function(e,t){return Object(k.jsx)(U,{text:e},t)}))]})]})};var J,W=function(){G("LOGOUT_NEEDED","/");var e=["email"],t=$(),n=t.errors,r=t.resetErrors,s=t.setValidationErrors,a=t.setGeneralErrors,o=N({email:""},(function(){r();var t=g(c,e);0===t.field.length?p():s(t)})),c=o.values,i=o.onSubmit,l=o.onChange,j=o.clearFields,d=Object(F.a)(Y,{update:function(e,t){t.data.resetPasswordStep1;j(),r()},onError:function(e){console.log(e),a(e.message)},variables:c}),b=Object(u.a)(d,2),p=b[0],O=b[1].loading;return Object(k.jsxs)("div",{children:[Object(k.jsx)("h4",{children:"Forgotten password resetting - sending authenticator email"}),Object(k.jsx)("p",{children:"For resetting forgotten password, please give your email which you have been registered to the site!"}),Object(k.jsx)("p",{children:"You will get an email with a link URL, with which you can continue the forgotten password resetting process."}),Object(k.jsxs)("form",{children:[Object(k.jsx)(R,{labeling:"Email",type:"email",invalidInputs:n,name:"email",value:c.email,funcChange:l}),Object(k.jsx)("input",{type:"submit",value:"Continue",onClick:i}),O&&Object(k.jsx)("p",{children:"Under process..."}),n.message.length>0&&n.message.map((function(e,t){return Object(k.jsx)(U,{text:e},t)}))]})]})},Y=Object(p.a)(z||(z=Object(d.a)(["\n    mutation resetPasswordStep1(\n        $email: String!\n    ){\n        resetPasswordStep1(\n            email: $email\n        ){\n            resultText, id, email, username    \n        }\n    }\n"])));var M=function(){G("LOGOUT_NEEDED","/"),function(e){var t=Object(r.useContext)(I),n=Object(l.g)(),s=document.cookie,a=s?s.split(";").find((function(e){return e.startsWith("erverror=")})).split("=")[1]:"";a&&(t.srvError(a),n.push(e))}("/error");var e=Object(l.g)(),t=Object(l.i)();w(t.token)||e.push("/");var n=["password","passwordconf"],s=$(),a=s.errors,o=s.resetErrors,c=s.setValidationErrors,i=s.setGeneralErrors,j=N({password:"",passwordconf:""},(function(){o();var e=g(d,n);0===e.field.length?m():c(e)})),d=j.values,b=j.onSubmit,p=j.onChange,O=j.clearFields,h=Object(F.a)(Z,{update:function(t,n){n.data.resetPasswordStep3;o(),O(),e.push("/passwordresetting/result")},onError:function(e){console.log(e),i(e.message)},variables:d,context:{headers:{resetting:t.token}}}),f=Object(u.a)(h,2),m=f[0],x=f[1].loading;return Object(k.jsxs)("div",{children:[Object(k.jsx)("h4",{children:"Forgotten password resetting - new password setting"}),Object(k.jsx)("p",{children:"Please give a new password to your account and its repeat as confirmation!."}),Object(k.jsxs)("form",{children:[Object(k.jsx)(R,{labeling:"New Password",type:"password",invalidInputs:a,name:"password",value:d.password,funcChange:p}),Object(k.jsx)(R,{labeling:"Confirm password",type:"password",invalidInputs:a,name:"passwordconf",value:d.passwordConfirm,funcChange:p}),Object(k.jsx)("input",{type:"submit",value:"Change password",onClick:b}),x&&Object(k.jsx)("p",{children:"Under process..."}),a.message.length>0&&a.message.map((function(e,t){return Object(k.jsx)(U,{text:e},t)}))]})]})},Z=Object(p.a)(J||(J=Object(d.a)(["\n    mutation resetPasswordStep3(\n        $password: String!\n        $passwordconf: String!\n    ){\n        resetPasswordStep3(\n            newpassword: $password,\n            newconf: $passwordconf\n        ){\n            resultText, id, email, username    \n        }\n    }\n"])));var H=function(){return G("LOGOUT_NEEDED","/"),Object(k.jsxs)("div",{children:[Object(k.jsx)("h4",{children:"Your Forgotten Password has been resetted!"}),Object(k.jsx)("p",{children:"A minute later you can use your new password!"})]})};var K=function(){var e=Object(l.j)(),t=e.path,n=e.url;return Object(k.jsxs)("div",{children:[Object(k.jsx)("h3",{children:"Forgotten password resetting page"}),Object(k.jsxs)(l.d,{children:[Object(k.jsx)(l.b,{path:"".concat(t,"/email"),children:Object(k.jsx)(W,{})}),Object(k.jsx)(l.b,{path:"".concat(t,"/result"),children:Object(k.jsx)(H,{})}),Object(k.jsx)(l.b,{path:"".concat(t,"/:token"),children:Object(k.jsx)(M,{})}),Object(k.jsx)(l.a,{from:"".concat(n),to:"/"})]})]})};var Q=function(){return Object(k.jsx)("div",{children:"Wellcome this site!"})};var X=function(){var e=Object(r.useContext)(I);return Object(r.useEffect)((function(){e.logout()})),Object(k.jsx)(l.a,{to:"/"})};var ee=function(){return Object(k.jsx)("div",{children:Object(k.jsx)("h3",{children:"Review content"})})};var te=function(){return Object(k.jsx)("div",{children:Object(k.jsx)("h3",{children:"Chattings"})})};var ne=function(){return Object(k.jsx)("div",{children:Object(k.jsx)("h3",{children:"Account dashboard"})})};var re=function(){return Object(k.jsx)("div",{children:Object(k.jsx)("h3",{children:"Friends"})})};var se=function(){return Object(k.jsx)("div",{children:Object(k.jsx)("h3",{children:"Posts"})})};var ae=function(){var e=Object(r.useContext)(I);return Object(k.jsx)(k.Fragment,{children:e.user?Object(k.jsxs)(l.d,{children:[Object(k.jsx)(l.b,{path:"/logout",component:X}),Object(k.jsx)(l.b,{path:"/account",component:ne}),Object(k.jsx)(l.b,{path:"/friends",component:re}),Object(k.jsx)(l.b,{path:"/posts",component:se}),Object(k.jsx)(l.b,{path:"/chats",component:te}),Object(k.jsx)(l.b,{path:"/",component:ee})]}):Object(k.jsxs)(l.d,{children:[Object(k.jsx)(l.b,{exact:!0,path:"/login",component:q}),Object(k.jsx)(l.b,{exact:!0,path:"/registration",component:B}),Object(k.jsx)(l.b,{path:"/passwordresetting",component:K}),Object(k.jsx)(l.b,{path:"/",component:Q})]})})};var oe=function(){var e=Object(r.useContext)(I),t=Object(l.h)().pathname.split("/"),n=Object(u.a)(t,1)[0],s=Object(r.useState)({active:n.toLowerCase()}),a=Object(u.a)(s,2);return a[0],a[1],Object(k.jsx)("nav",{children:e.user?Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/account",children:"My account"})}),Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/friends",children:"Friends"})}),Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/posts",children:"Posts"})}),Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/chats",children:"Chatting"})}),Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/logout",children:"Logout"})})]}):Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/login",children:"Login"})}),Object(k.jsx)("li",{children:Object(k.jsx)(c.b,{to:"/registration",children:"Registration"})})]})})};n(89);var ce=function(){return Object(r.useEffect)((function(){i()})),Object(k.jsxs)("div",{className:"App",children:[Object(k.jsx)("header",{className:"App-header",children:Object(k.jsx)("h1",{children:"Cultural spot"})}),Object(k.jsx)(D,{children:Object(k.jsxs)(c.a,{children:[Object(k.jsx)(oe,{}),Object(k.jsx)(ae,{})]})})]})},ie=n(68),le=n(71),ue=n(20),je=n(72),de=n(94),be=Object(je.a)({uri:"http://localhost:4040/graphql"}),pe=new ue.a((function(e,t){return e.getContext("refreshing")&&e.setContext((function(e){var t=e.headers,n=void 0===t?{}:t;return{headers:Object(o.a)(Object(o.a)({},n),{},{refreshing:localStorage.getItem("refreshToken")||null})}})),e.setContext((function(e){var t=e.headers,n=void 0===t?{}:t;return{headers:Object(o.a)(Object(o.a)({},n),{},{authorization:"Bearer "+(localStorage.getItem("authToken")||"")})}})),t(e)})),Oe=new ue.a((function(e,t){return t(e).map((function(e){return e}))})),he=new ie.a({link:Object(ue.c)([pe,Oe,be]),cache:new le.a}),ge=Object(k.jsx)(de.a,{client:he,children:Object(k.jsx)(ce,{})});a.a.render(ge,document.getElementById("root")),i()}},[[92,1,2]]]);
//# sourceMappingURL=main.fd3ae034.chunk.js.map