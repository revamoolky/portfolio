(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();var B,Se;class at extends Error{}at.prototype.name="InvalidTokenError";function Fs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function Bs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Fs(t)}catch{return atob(t)}}function es(i,t){if(typeof i!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let s;try{s=Bs(r)}catch(o){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(s)}catch(o){throw new at(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const Gs="mu:context",Xt=`${Gs}:change`;class Ws{constructor(t,e){this._proxy=Ys(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ss extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ws(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Ys(i,t){return new Proxy(i,{get:(r,s,o)=>{if(s==="then")return;const n=Reflect.get(r,s,o);return console.log(`Context['${s}'] => `,n),n},set:(r,s,o,n)=>{const c=i[s];console.log(`Context['${s.toString()}'] <= `,o);const a=Reflect.set(r,s,o,n);if(a){let u=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:s,oldValue:c,value:o}),t.dispatchEvent(u)}else console.log(`Context['${s}] was not set to ${o}`);return a}})}function Ks(i,t){const e=rs(t,i);return new Promise((r,s)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function rs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return rs(i,s.host)}class Js extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function is(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Js(e,i))}class re{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Xs(i){return t=>({...t,...i})}const Qt="mu:auth:jwt",os=class ns extends re{constructor(t,e){super((r,s)=>this.update(r,s),t,ns.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(Zs(r)),Bt(s);case"auth/signout":return e(tr()),Bt(this._redirectForLogin);case"auth/redirect":return Bt(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};os.EVENT_TYPE="auth:message";let as=os;const cs=is(as.EVENT_TYPE);function Bt(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,o])=>r.searchParams.set(s,o)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class Qs extends ss{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=J.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new as(this.context,this.redirect).attach(this)}}class dt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Qt),t}}class J extends dt{constructor(t){super();const e=es(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(Qt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Qt);return t?J.authenticate(t):new dt}}function Zs(i){return Xs({user:J.authenticate(i),token:i})}function tr(){return i=>{const t=i.user;return{user:t&&t.authenticated?dt.deauthenticate(t):t,token:""}}}function er(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function sr(i){return i.authenticated?es(i.token||""):{}}const rr=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:Qs,User:dt,dispatch:cs,headers:er,payload:sr},Symbol.toStringTag,{value:"Module"}));function Zt(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function xe(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}function ls(i,...t){const e=i.map((s,o)=>o?[t[o-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const ir=new DOMParser;function j(i,...t){const e=t.map(c),r=i.map((a,u)=>{if(u===0)return[a];const m=e[u-1];return m instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[m,a]}).flat().join(""),s=ir.parseFromString(r,"text/html"),o=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,u)=>{if(a instanceof Node){const m=n.querySelector(`ins#mu-html-${u}`);if(m){const d=m.parentNode;d==null||d.replaceChild(a,m)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function c(a,u){if(a===null)return"";switch(typeof a){case"string":return ke(a);case"bigint":case"boolean":case"number":case"symbol":return ke(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const m=new DocumentFragment,d=a.map(c);return m.replaceChildren(...d),m}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ke(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Lt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:o};return r;function s(n){const c=n.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function o(...n){e.adoptedStyleSheets=n}}B=class extends HTMLElement{constructor(){super(),this._state={},Lt(this).template(B.template).styles(B.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Zt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},or(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},B.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,B.styles=ls`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function or(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!s;break;case"date":n.value=s.toISOString().substr(0,10);break;default:n.value=s;break}}}return i}const hs=class ds extends re{constructor(t){super((e,r)=>this.update(e,r),t,ds.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(ar(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(cr(r,s));break}}}};hs.EVENT_TYPE="history:message";let ie=hs;class Pe extends ss{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=nr(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),oe(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ie(this.context).attach(this)}}function nr(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function ar(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function cr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const oe=is(ie.EVENT_TYPE),lr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Pe,Provider:Pe,Service:ie,dispatch:oe},Symbol.toStringTag,{value:"Module"}));class Pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new Te(this._provider,t);this._effects.push(s),e(s)}else Ks(this._target,this._contextLabel).then(s=>{const o=new Te(s,t);this._provider=s,this._effects.push(o),s.attach(n=>this._handleChange(n)),e(o)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Te{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const us=class ps extends HTMLElement{constructor(){super(),this._state={},this._user=new dt,this._authObserver=new Pt(this,"blazing:auth"),Lt(this).template(ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;hr(s,this._state,e,this.authorization).then(o=>rt(o,this)).then(o=>{const n=`mu-rest-form:${r}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[r]:o,url:s}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:s,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},rt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ce(this.src,this.authorization).then(e=>{this._state=e,rt(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&Ce(this.src,this.authorization).then(s=>{this._state=s,rt(s,this)});break;case"new":r&&(this._state={},rt({},this));break}}};us.observedAttributes=["src","new","action"];us.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ce(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function rt(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!s;break;default:n.value=s;break}}}return i}function hr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const dr=class ms extends re{constructor(t,e){super(e,t,ms.EVENT_TYPE,!1)}};dr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,ne=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),Oe=new WeakMap;let gs=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ne&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Oe.set(e,t))}return t}toString(){return this.cssText}};const ur=i=>new gs(typeof i=="string"?i:i+"",void 0,ae),pr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new gs(e,i,ae)},mr=(i,t)=>{if(ne)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=xt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Re=ne?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ur(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gr,defineProperty:fr,getOwnPropertyDescriptor:yr,getOwnPropertyNames:vr,getOwnPropertySymbols:br,getPrototypeOf:_r}=Object,X=globalThis,Ne=X.trustedTypes,$r=Ne?Ne.emptyScript:"",Ie=X.reactiveElementPolyfillSupport,ct=(i,t)=>i,Tt={toAttribute(i,t){switch(t){case Boolean:i=i?$r:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ce=(i,t)=>!gr(i,t),Ue={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:ce};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ue){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&fr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=yr(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const c=s==null?void 0:s.call(this);o.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ue}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=_r(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,r=[...vr(e),...br(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Re(s))}else t!==void 0&&e.push(Re(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const n=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Tt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=s.getPropertyOptions(o),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:Tt;this._$Em=o,this[o]=c.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ce)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ct("elementProperties")]=new Map,W[ct("finalized")]=new Map,Ie==null||Ie({ReactiveElement:W}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,Ot=Ct.trustedTypes,Me=Ot?Ot.createPolicy("lit-html",{createHTML:i=>i}):void 0,fs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,ys="?"+P,wr=`<${ys}>`,H=document,ut=()=>H.createComment(""),pt=i=>i===null||typeof i!="object"&&typeof i!="function",le=Array.isArray,Ar=i=>le(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,it=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,je=/>/g,I=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ze=/'/g,He=/"/g,vs=/^(?:script|style|textarea|title)$/i,Er=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ot=Er(1),Q=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),De=new WeakMap,M=H.createTreeWalker(H,129);function bs(i,t){if(!le(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Me!==void 0?Me.createHTML(t):t}const Sr=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=it;for(let c=0;c<e;c++){const a=i[c];let u,m,d=-1,l=0;for(;l<a.length&&(n.lastIndex=l,m=n.exec(a),m!==null);)l=n.lastIndex,n===it?m[1]==="!--"?n=Le:m[1]!==void 0?n=je:m[2]!==void 0?(vs.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=I):m[3]!==void 0&&(n=I):n===I?m[0]===">"?(n=s??it,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?I:m[3]==='"'?He:ze):n===He||n===ze?n=I:n===Le||n===je?n=it:(n=I,s=void 0);const h=n===I&&i[c+1].startsWith("/>")?" ":"";o+=n===it?a+wr:d>=0?(r.push(u),a.slice(0,d)+fs+a.slice(d)+P+h):a+P+(d===-2?c:h)}return[bs(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let te=class _s{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[u,m]=Sr(t,e);if(this.el=_s.createElement(u,r),M.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=M.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(fs)){const l=m[n++],h=s.getAttribute(d).split(P),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?kr:p[1]==="?"?Pr:p[1]==="@"?Tr:jt}),s.removeAttribute(d)}else d.startsWith(P)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(vs.test(s.tagName)){const d=s.textContent.split(P),l=d.length-1;if(l>0){s.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<l;h++)s.append(d[h],ut()),M.nextNode(),a.push({type:2,index:++o});s.append(d[l],ut())}}}else if(s.nodeType===8)if(s.data===ys)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(P,d+1))!==-1;)a.push({type:7,index:o}),d+=P.length-1}o++}}static createElement(t,e){const r=H.createElement("template");return r.innerHTML=t,r}};function Z(i,t,e=i,r){var s,o;if(t===Q)return t;let n=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const c=pt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==c&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(i),n._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=n:e.l=n),n!==void 0&&(t=Z(i,n._$AS(i,t.values),n,r)),t}class xr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??H).importNode(e,!0);M.currentNode=s;let o=M.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new bt(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Cr(o,this,t)),this._$AV.push(u),a=r[++c]}n!==(a==null?void 0:a.index)&&(o=M.nextNode(),n++)}return M.currentNode=H,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),pt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ar(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=te.createElement(bs(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(r);else{const n=new xr(o,this),c=n.u(this.options);n.p(r),this.T(c),this._$AH=n}}_$AC(t){let e=De.get(t.strings);return e===void 0&&De.set(t.strings,e=new te(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new bt(this.O(ut()),this.O(ut()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class jt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=Z(this,t,e,0),n=!pt(t)||t!==this._$AH&&t!==Q,n&&(this._$AH=t);else{const c=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=Z(this,c[r+a],e,a),u===Q&&(u=this._$AH[a]),n||(n=!pt(u)||u!==this._$AH[a]),u===b?t=b:t!==b&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class kr extends jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Pr extends jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Tr extends jt{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??b)===Q)return;const r=this._$AH,s=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==b&&(r===b||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Cr{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const qe=Ct.litHtmlPolyfillSupport;qe==null||qe(te,bt),(Ct.litHtmlVersions??(Ct.litHtmlVersions=[])).push("3.2.0");const Or=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new bt(t.insertBefore(ut(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let K=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Or(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Q}};K._$litElement$=!0,K.finalized=!0,(Se=globalThis.litElementHydrateSupport)==null||Se.call(globalThis,{LitElement:K});const Ve=globalThis.litElementPolyfillSupport;Ve==null||Ve({LitElement:K});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rr={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:ce},Nr=(i=Rr,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.P(n,void 0,i),c}}}if(r==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function $s(i){return(t,e)=>typeof e=="object"?Nr(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ws(i){return $s({...i,state:!0,attribute:!1})}function Ir(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Ur(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var As={};(function(i){var t=function(){var e=function(d,l,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=l);return h},r=[1,9],s=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,p,f,g,y,Ht){var A=y.length-1;switch(g){case 1:return new f.Root({},[y[A-1]]);case 2:return new f.Root({},[new f.Literal({value:""})]);case 3:this.$=new f.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new f.Literal({value:y[A]});break;case 7:this.$=new f.Splat({name:y[A]});break;case 8:this.$=new f.Param({name:y[A]});break;case 9:this.$=new f.Optional({},[y[A-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:o,15:n},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let p=function(f,g){this.message=f,this.hash=g};throw p.prototype=Error,new p(l,h)}},parse:function(l){var h=this,p=[0],f=[null],g=[],y=this.table,Ht="",A=0,we=0,Hs=2,Ae=1,Ds=g.slice.call(arguments,1),v=Object.create(this.lexer),R={yy:{}};for(var Dt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Dt)&&(R.yy[Dt]=this.yy[Dt]);v.setInput(l,R.yy),R.yy.lexer=v,R.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var qt=v.yylloc;g.push(qt);var qs=v.options&&v.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Vs=function(){var F;return F=v.lex()||Ae,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,N,E,Vt,V={},Et,k,Ee,St;;){if(N=p[p.length-1],this.defaultActions[N]?E=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Vs()),E=y[N]&&y[N][w]),typeof E>"u"||!E.length||!E[0]){var Ft="";St=[];for(Et in y[N])this.terminals_[Et]&&Et>Hs&&St.push("'"+this.terminals_[Et]+"'");v.showPosition?Ft="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ft="Parse error on line "+(A+1)+": Unexpected "+(w==Ae?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ft,{text:v.match,token:this.terminals_[w]||w,line:v.yylineno,loc:qt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(E[0]){case 1:p.push(w),f.push(v.yytext),g.push(v.yylloc),p.push(E[1]),w=null,we=v.yyleng,Ht=v.yytext,A=v.yylineno,qt=v.yylloc;break;case 2:if(k=this.productions_[E[1]][1],V.$=f[f.length-k],V._$={first_line:g[g.length-(k||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(k||1)].first_column,last_column:g[g.length-1].last_column},qs&&(V._$.range=[g[g.length-(k||1)].range[0],g[g.length-1].range[1]]),Vt=this.performAction.apply(V,[Ht,we,A,R.yy,E[1],f,g].concat(Ds)),typeof Vt<"u")return Vt;k&&(p=p.slice(0,-1*k*2),f=f.slice(0,-1*k),g=g.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),f.push(V.$),g.push(V._$),Ee=y[p[p.length-2]][p[p.length-1]],p.push(Ee);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,p=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===f.length?this.yylloc.first_column:0)+f[f.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var p,f,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),f=l[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,p,f;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,f=y,this.options.backtrack_lexer){if(l=this.test_match(p,g[y]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,g[f]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,f,g){switch(f){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function m(){this.yy={}}return m.prototype=a,a.Parser=m,new m}();typeof Ur<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(As);function G(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Es={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ss=As.parser;Ss.yy=Es;var Mr=Ss,Lr=Object.keys(Es);function jr(i){return Lr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var xs=jr,zr=xs,Hr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function ks(i){this.captures=i.captures,this.re=i.re}ks.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var Dr=zr({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Hr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new ks({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),qr=Dr,Vr=xs,Fr=Vr({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Br=Fr,Gr=Mr,Wr=qr,Yr=Br;_t.prototype=Object.create(null);_t.prototype.match=function(i){var t=Wr.visit(this.ast),e=t.match(i);return e||!1};_t.prototype.reverse=function(i){return Yr.visit(this.ast,i)};function _t(i){var t;if(this?t=this:t=Object.create(_t.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Gr.parse(i),t}var Kr=_t,Jr=Kr,Xr=Jr;const Qr=Ir(Xr);var Zr=Object.defineProperty,Ps=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Zr(t,e,s),s};const Ts=class extends K{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ot` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new Qr(s.path)})),this._historyObserver=new Pt(this,e),this._authObserver=new Pt(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ot` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),ot` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ot` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ot` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),o=r+e;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:r,params:c,query:s}}}redirect(t){oe(this,"history/redirect",{href:t})}};Ts.styles=pr`
    :host,
    main {
      display: contents;
    }
  `;let Rt=Ts;Ps([ws()],Rt.prototype,"_user");Ps([ws()],Rt.prototype,"_match");const ti=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),ei=class Cs extends HTMLElement{constructor(){if(super(),Lt(this).template(Cs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ei.template=j`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Os=class ee extends HTMLElement{constructor(){super(),this._array=[],Lt(this).template(ee.template).styles(ee.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Rs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{xe(t,"button.add")?Zt(t,"input-array:add"):xe(t,"button.remove")&&Zt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],si(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};Os.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Os.styles=ls`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function si(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Rs(e)))}function Rs(i,t){const e=i===void 0?j`<input />`:j`<input value="${i}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ri(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ii=Object.defineProperty,oi=Object.getOwnPropertyDescriptor,ni=(i,t,e,r)=>{for(var s=oi(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&ii(t,e,s),s};class ai extends K{constructor(t){super(),this._pending=[],this._observer=new Pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}ni([$s()],ai.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,he=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),Fe=new WeakMap;let Ns=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(he&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Fe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Fe.set(e,t))}return t}toString(){return this.cssText}};const ci=i=>new Ns(typeof i=="string"?i:i+"",void 0,de),q=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new Ns(e,i,de)},li=(i,t)=>{if(he)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=kt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Be=he?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ci(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:hi,defineProperty:di,getOwnPropertyDescriptor:ui,getOwnPropertyNames:pi,getOwnPropertySymbols:mi,getPrototypeOf:gi}=Object,C=globalThis,Ge=C.trustedTypes,fi=Ge?Ge.emptyScript:"",Wt=C.reactiveElementPolyfillSupport,lt=(i,t)=>i,Nt={toAttribute(i,t){switch(t){case Boolean:i=i?fi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!hi(i,t),We={attribute:!0,type:String,converter:Nt,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=We){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&di(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=ui(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){const c=s==null?void 0:s.call(this);o==null||o.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??We}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=gi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,r=[...pi(e),...mi(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Be(s))}else t!==void 0&&e.push(Be(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return li(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var o;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:Nt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var o,n;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const c=r.getPropertyOptions(s),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((o=c.converter)==null?void 0:o.fromAttribute)!==void 0?c.converter:Nt;this._$Em=s,this[s]=a.fromAttribute(e,c.type)??((n=this._$Ej)==null?void 0:n.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const o=this.constructor,n=this[t];if(r??(r=o.getPropertyOptions(t)),!((r.hasChanged??ue)(n,e)||r.useDefault&&r.reflect&&n===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s){const{wrapped:c}=n,a=this[o];c!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[lt("elementProperties")]=new Map,Y[lt("finalized")]=new Map,Wt==null||Wt({ReactiveElement:Y}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,It=ht.trustedTypes,Ye=It?It.createPolicy("lit-html",{createHTML:i=>i}):void 0,Is="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Us="?"+T,yi=`<${Us}>`,D=document,mt=()=>D.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",pe=Array.isArray,vi=i=>pe(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Je=/>/g,U=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,Qe=/"/g,Ms=/^(?:script|style|textarea|title)$/i,bi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),$=bi(1),tt=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ze=new WeakMap,L=D.createTreeWalker(D,129);function Ls(i,t){if(!pe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}const _i=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=nt;for(let c=0;c<e;c++){const a=i[c];let u,m,d=-1,l=0;for(;l<a.length&&(n.lastIndex=l,m=n.exec(a),m!==null);)l=n.lastIndex,n===nt?m[1]==="!--"?n=Ke:m[1]!==void 0?n=Je:m[2]!==void 0?(Ms.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=U):m[3]!==void 0&&(n=U):n===U?m[0]===">"?(n=s??nt,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?U:m[3]==='"'?Qe:Xe):n===Qe||n===Xe?n=U:n===Ke||n===Je?n=nt:(n=U,s=void 0);const h=n===U&&i[c+1].startsWith("/>")?" ":"";o+=n===nt?a+yi:d>=0?(r.push(u),a.slice(0,d)+Is+a.slice(d)+T+h):a+T+(d===-2?c:h)}return[Ls(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class ft{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[u,m]=_i(t,e);if(this.el=ft.createElement(u,r),L.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=L.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Is)){const l=m[n++],h=s.getAttribute(d).split(T),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?wi:p[1]==="?"?Ai:p[1]==="@"?Ei:zt}),s.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(Ms.test(s.tagName)){const d=s.textContent.split(T),l=d.length-1;if(l>0){s.textContent=It?It.emptyScript:"";for(let h=0;h<l;h++)s.append(d[h],mt()),L.nextNode(),a.push({type:2,index:++o});s.append(d[l],mt())}}}else if(s.nodeType===8)if(s.data===Us)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:o}),d+=T.length-1}o++}}static createElement(t,e){const r=D.createElement("template");return r.innerHTML=t,r}}function et(i,t,e=i,r){var n,c;if(t===tt)return t;let s=r!==void 0?(n=e._$Co)==null?void 0:n[r]:e._$Cl;const o=gt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((c=s==null?void 0:s._$AO)==null||c.call(s,!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=et(i,s._$AS(i,t.values),s,r)),t}class $i{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??D).importNode(e,!0);L.currentNode=s;let o=L.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new $t(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Si(o,this,t)),this._$AV.push(u),a=r[++c]}n!==(a==null?void 0:a.index)&&(o=L.nextNode(),n++)}return L.currentNode=D,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class $t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),gt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ft.createElement(Ls(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{const n=new $i(s,this),c=n.u(this.options);n.p(e),this.T(c),this._$AH=n}}_$AC(t){let e=Ze.get(t.strings);return e===void 0&&Ze.set(t.strings,e=new ft(t)),e}k(t){pe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new $t(this.O(mt()),this.O(mt()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=et(this,t,e,0),n=!gt(t)||t!==this._$AH&&t!==tt,n&&(this._$AH=t);else{const c=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=et(this,c[r+a],e,a),u===tt&&(u=this._$AH[a]),n||(n=!gt(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class wi extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ai extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Ei extends zt{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??_)===tt)return;const r=this._$AH,s=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Si{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Kt=ht.litHtmlPolyfillSupport;Kt==null||Kt(ft,$t),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.3.0");const xi=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new $t(t.insertBefore(mt(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=globalThis;class S extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}}var ts;S._$litElement$=!0,S.finalized=!0,(ts=z.litElementHydrateSupport)==null||ts.call(z,{LitElement:S});const Jt=z.litElementPolyfillSupport;Jt==null||Jt({LitElement:S});(z.litElementVersions??(z.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ki={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:ue},Pi=(i=ki,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(r==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function x(i){return(t,e)=>typeof e=="object"?Pi(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function wt(i){return x({...i,state:!0,attribute:!1})}var Ti=Object.defineProperty,Ci=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ti(t,e,s),s};const ge=class ge extends S{constructor(){super(...arguments),this.isDarkMode=!1}handleDarkModeToggle(){this.isDarkMode=!this.isDarkMode,document.body.classList.toggle("dark",this.isDarkMode)}render(){return $`
      <header>
        <nav>
          <a href="/app">Home</a>
          <a href="/app/about">About</a>
          <a href="/app/contact">Contact</a>
        </nav>
        <label class="darkmode-toggle">
          <input 
            type="checkbox" 
            .checked=${this.isDarkMode}
            @change=${this.handleDarkModeToggle}
            autocomplete="off" 
          />
          Dark mode
        </label>
      </header>
    `}};ge.styles=q`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--color-background);
      border-bottom: 1px solid var(--color-border);
    }
    
    nav {
      display: flex;
      gap: 2rem;
    }
    
    nav a {
      text-decoration: none;
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
      transition: color 0.2s ease;
    }
    
    nav a:hover {
      color: var(--color-primary);
    }
    
    .darkmode-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }
    
    .darkmode-toggle input {
      cursor: pointer;
    }
  `;let Ut=ge;Ci([wt()],Ut.prototype,"isDarkMode");var Oi=Object.defineProperty,js=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Oi(t,e,s),s};const fe=class fe extends S{constructor(){super(...arguments),this.isLocked=sessionStorage.getItem("unlocked")!=="true",this.errorMessage=""}handlePasswordSubmit(t){t.preventDefault(),t.target.querySelector("#password-input").value==="open"?(this.isLocked=!1,this.errorMessage="",sessionStorage.setItem("unlocked","true")):this.errorMessage="Incorrect password. Please try again."}render(){return this.isLocked?$`
        <div class="lock-screen">
          <div class="card">
            <div class="icon">🔒</div>
            <p>Enter password<br />to access the site.</p>
            <form @submit=${this.handlePasswordSubmit}>
              <input type="password" id="password-input" placeholder="Password" />
              <button type="submit">Submit</button>
            </form>
            ${this.errorMessage?$`<p class="error">${this.errorMessage}</p>`:""}
          </div>
        </div>
      `:$`
      <main>
        <!-- Hero Section -->
        <header class="hero">
          <section class="case-study-intro">
            <div class="intro-content">
              <h1>Hi, I'm Reva</h1>
              <p class="description">UX Researcher & Designer crafting thoughtful experiences.</p>
              <h3>View my work below ⬇️ </h3>
            </div>
          </section>
        </header>

        
          
          <section class="project-list">
            <ul>
              <li class="project-list-item">
                <article class="logo">
                  <img src="/images/palo-alto-networks-1.svg" alt="Palo Alto Networks" width="32" height="32" loading="lazy">
                  <p>Palo Alto Networks</p>
                </article>
                <ul class="proj_description">
                  <li>
                    <h3>Building a Research Toolkit for Designer-Led Discovery and PM Collaboration</h3>
                    <p class="proj_pos">Internship, 2024</p>
                  </li>
                  <li>
                    <p>I co-founded Inko Cat - a productivity tool that provides the building blocks to create your ideal workspace. I designed every feature and branding in the product.</p>
                  </li>
                </ul>
                <article class="grid">
                  <figure class="column-12">
                    <a href="/app/project/paloaltonetworks">
                      <div class="img-mid bg-ic img border">
                        <img src="/images/panwheader.png" alt="Palo Alto Networks project">
                      </div>
                    </a>
                  </figure>
                </article>
              </li>
              <li class="project-list-item">
                <article class="logo">
                  <img src="/images/amplitude_logo_icon.png" alt="Amplitude" width="32" height="32" loading="lazy">
                  <p>Amplitude</p>
                </article>
                <ul class="proj_description">
                  <li>
                    <h3>Streamlining the Chart to Dashboard Creation Experience</h3>
                    <p class="proj_pos">Consulting Project, 2025</p>
                  </li>
                  <li>
                    <p>I co-founded Inko Cat - a productivity tool that provides the building blocks to create your ideal workspace. I designed every feature and branding in the product.</p>
                  </li>
                </ul>
                <article class="grid">
                  <figure class="column-12">
                    <a href="/app/project/amplitude">
                      <div class="img-mid bg-ic img border">
                        <img src="/images/panw1.png" alt="Amplitude project">
                      </div>
                    </a>
                  </figure>
                </article>
              </li>
            </ul>
          </section>
        </section>

        <!-- Call to Action -->
        <section class="cta">
          <div class="intro-content">
            <h2>Let's create something amazing together</h2>
            <p class="description">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <a href="/app/contact" class="cta-button">
              Get in touch
            </a>
          </div>
        </section>
      </main>
    `}};fe.styles=q`
    .lock-screen {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: var(--color-background);
    }

    .card {
      background: var(--color-background-card);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
    }

    .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .card form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .card input {
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;
    }

    .card button {
      padding: 0.75rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .error {
      color: var(--color-error);
      margin-top: 1rem;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 0;
    }

    .intro-content h1 {
      font-size: 3rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: 1rem;
      color: var(--color-text);
    }

    .description {
      font-size: 1.25rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    .portfolio-header h3 {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: 2rem;
    }

    .subtitle {
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-reg);
    }

    .project-list ul {
      list-style: none;
      padding: 0;
    }

    .project-list-item {
      margin-bottom: 4rem;
      padding: 2rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .logo img {
      border-radius: 4px;
    }

    .proj_description {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }

    .proj_description h3 {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: 0.5rem;
    }

    .proj_pos {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .grid figure {
      margin: 0;
    }

    .img-mid {
      border-radius: 8px;
      overflow: hidden;
    }

    .img-mid img {
      width: 100%;
      height: auto;
      display: block;
    }

    .cta {
      background-color: var(--color-primary);
      color: white;
      text-align: center;
      padding: 4rem 2rem;
      border-radius: 8px;
      margin: 4rem 0;
    }

    .cta .description {
      color: rgba(255, 255, 255, 0.8);
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .cta-button {
      display: inline-block;
      background: white;
      color: var(--color-primary);
      padding: 1rem 2rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      transition: transform 0.2s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
    }
  `;let yt=fe;js([wt()],yt.prototype,"isLocked");js([wt()],yt.prototype,"errorMessage");var Ri=Object.defineProperty,me=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ri(t,e,s),s};const ye=class ye extends S{constructor(){super(...arguments),this.heading="",this.subheading="",this.paragraph=""}render(){return $`
      <section class="block">
        <h6>${this.subheading}</h6>
        <ul class="grid text-d-banner">
          <li class="column-6"><h2>${this.heading}</h2></li>
          <li class="column-6"><p>${this.paragraph}</p></li>
        </ul>
      </section>
    `}};ye.styles=q`
    :host {
      display: block;
      margin-block-end: 5rem;
    }

    h6 {
      font-size: var(--font-size-md);
      color: var(--color-secondary);
      margin-block: 0.2rem;
    }

    ul.grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      row-gap: 0;
      margin-block-end: 1rem;
      list-style: none;
      padding: 0;
    }

    li.column-6 {
      grid-column: span 6;
    }

    h2 {
      font-size: var(--font-size-lg);
      color: var(--color-primary);
    }
      li {
  list-style-type: none;
  display: list-item;
  text-align: -webkit-match-parent;
  unicode-bidi: isolate;
}

    p {
      margin-block: 0.5rem;
    }
  `;let st=ye;me([x({type:String})],st.prototype,"heading");me([x({type:String})],st.prototype,"subheading");me([x({type:String})],st.prototype,"paragraph");customElements.define("empathize-section",st);var Ni=Object.defineProperty,At=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ni(t,e,s),s};const ve=class ve extends S{constructor(){super(...arguments),this.heading="",this.subheading="",this.paragraph="",this.imgSrc="",this.imgAlt=""}render(){return $`
      <section class="block">
        <h6>${this.subheading}</h6>
        <ul class="grid text-d-banner">
          <li class="column-6">
            <h2>${this.heading}</h2>
          </li>
          <li class="column-6">
            <p>${this.paragraph}</p>
          </li>
        </ul>
        <article class="grid">
          <figure class="column-12">
            <div class="img-mid bg-ic img border">
              ${this.imgSrc?$`<img src=${this.imgSrc} alt=${this.imgAlt} />`:null}
            </div>
          </figure>
        </article>
      </section>
    `}};ve.styles=q`
    :host {
      display: block;
      margin-block-end: 5rem;
    }

    img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-medium, 8px);
  }

    h6 {
      font-size: var(--font-size-md);
      color: var(--color-secondary);
      margin-block: .2rem;
    }

    ul.grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      row-gap: 0;
      margin-block-end: 1rem;
      list-style: none;
      padding: 0;
    }

    li.column-6 {
      grid-column: span 6;
    }

    h2 {
      font-size: var(--font-size-lg);
      color: var(--color-primary);
    }

    p {
      margin-block: .5rem;
    }
    .img-mid {
      padding: clamp(1.5rem, 2.5vw + 1rem, 4rem);
      background-color: var(--color-background-tertiary);
      border-radius: var(--border-radius-medium);
      border: 1px solid var(--color-border-light);
      overflow: hidden;
    }

    .img-border img {
      border-radius: var(--border-radius-medium);
      border: 1px solid var(--color-border-light);
    }

    figure img {
      transition: transform .3s ease
    }
  `;let O=ve;At([x({type:String})],O.prototype,"heading");At([x({type:String})],O.prototype,"subheading");At([x({type:String})],O.prototype,"paragraph");At([x({type:String})],O.prototype,"imgSrc");At([x({type:String})],O.prototype,"imgAlt");customElements.define("empathize-section-image",O);const be=class be extends S{render(){return $`
          <main class="about">
           <header class="hero">
             <section class="case-study-intro">
                <div class="intro-content">
                <empathize-section-image
                    heading="Hello! I'm Reva!"
                    paragraph="Hi! I'm Reva and I'm currently a student at Cal Poly SLO (go mustangs!!). My studies at Cal Poly blend design and computer science, giving me the skills to design for humans while also understanding the development side of things. My background in both design and computer science allows me to bring a unique mix of analytical thinking and creative problem-solving to my projects. Outside of class, I'm involved in all things product design (design lead @iter8, director of product design @hack4impact, graphics & ux/ui assistant @robert e kennedy library, ux consultant @mustang consulting)."
                    imgSrc="/images/headshot.jpg"
                ></empathize-section-image>

                </div>
            </section>
            </header>
          </main>
        `}};be.styles=q`
        main {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }


        img {
            display: block;
            width: 100%;
            height: auto;
            max-width: 100%;
            border-radius: 8px;
            }

      media screen and (max-width: 1200px) {
  nav, footer, #project-list, header, .panw, .amplitude, .about {
      padding-left: 1rem;
      padding-right: 1rem;
  }
}
  .panw,.amplitude, .about{
  section {
      margin-block-end: 5rem;
      margin-block-start: 5rem;
  }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .contact-form {
            background: var(--color-background-card-dark, #2a2a2a);
            border-color: var(--color-border-dark, #404040);
          }


    
        /* Responsive design */
        @media (max-width: 768px) {
          main {
            padding: 1rem;
          }
    
          }
        }
          
      `;let se=be;var Ii=Object.defineProperty,zs=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ii(t,e,s),s};const _e=class _e extends S{constructor(){super(...arguments),this.responseMessage="",this.isSubmitting=!1}async handleContactSubmit(t){t.preventDefault(),this.isSubmitting=!0,this.responseMessage="";const e=t.target,r={name:e.querySelector('[name="name"]').value,email:e.querySelector('[name="email"]').value,subject:e.querySelector('[name="subject"]').value,message:e.querySelector('[name="message"]').value};try{(await fetch("http://localhost:3000/api/contacts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).ok?(this.responseMessage="Message sent! ✅",e.reset()):this.responseMessage="Something went wrong. ❌"}catch(s){this.responseMessage="Error sending message. ❌",console.error(s)}finally{this.isSubmitting=!1}}render(){return $`
      <main>
        <div class="contact-header">
          <h1>Get in Touch</h1>
          <h3>Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.</h3>
          <p class="email-link">
            Email: <a href="mailto:rmoolky@gmail.com">rmoolky@gmail.com</a>
          </p>
        </div>

        <div class="contact-content">
          <a href="/app" class="back-link">← Back to Portfolio</a>
          
          <form class="contact-form" @submit=${this.handleContactSubmit}>
            <h2 class="form-title">Let's get in touch</h2>
            
            <input 
              type="text" 
              name="name" 
              placeholder="Your name" 
              required 
              ?disabled=${this.isSubmitting}
            />
            
            <input 
              type="email" 
              name="email" 
              placeholder="Your email" 
              required 
              ?disabled=${this.isSubmitting}
            />
            
            <input 
              type="text" 
              name="subject" 
              placeholder="Subject" 
              required 
              ?disabled=${this.isSubmitting}
            />
            
            <textarea 
              name="message" 
              placeholder="Your message" 
              required 
              rows="6"
              ?disabled=${this.isSubmitting}
            ></textarea>
            
            <button 
              type="submit" 
              ?disabled=${this.isSubmitting}
              class=${this.isSubmitting?"submitting":""}
            >
              ${this.isSubmitting?"Sending...":"Send"}
            </button>
          </form>

          ${this.responseMessage?$`
            <p class="response-msg ${this.responseMessage.includes("✅")?"success":"error"}">
              ${this.responseMessage}
            </p>
          `:""}
        </div>
      </main>
    `}};_e.styles=q`
    main {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .contact-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .contact-header h1 {
      font-size: 2.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: 1rem;
    }

    .contact-header h3 {
      font-size: 1.25rem;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }


    .email-link {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .email-link a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
    }

    .email-link a:hover {
      text-decoration: underline;
    }

    .contact-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-block;
      color: var(--color-text-secondary);
      text-decoration: none;
      margin-bottom: 2rem;
      font-size: 1rem;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: var(--color-primary);
    }

    .contact-form {
      background: var(--color-background-card, #fff);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--color-border, #e0e0e0);
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-background-secondary:);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .contact-form input,
    .contact-form textarea {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid var(--color-border, #e0e0e0);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      background: var(--color-background, #fff);
      color: var(--color-text);
      box-sizing: border-box;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 0, 123, 255), 0.1);
    }

    .contact-form input:disabled,
    .contact-form textarea:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .contact-form textarea {
      resize: vertical;
      min-height: 120px;
    }

    .contact-form button {
      width: 100%;
      padding: 1rem 2rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .contact-form button:hover:not(:disabled) {
      background: var(--color-primary-dark, #0056b3);
      transform: translateY(-1px);
    }

    .contact-form button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .contact-form button.submitting {
      background: var(--color-primary-light, #6c9bd1);
    }

    .response-msg {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .response-msg.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .response-msg.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .contact-form {
        background: var(--color-background-card-dark, #2a2a2a);
        border-color: var(--color-border-dark, #404040);
      }

      .contact-form input,
      .contact-form textarea {
        background: var(--color-background-dark, #1a1a1a);
        border-color: var(--color-border-dark, #404040);
        color: var(--color-text-dark, #ffffff);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }

      .contact-header h1 {
        font-size: 2rem;
      }

      .contact-header h3 {
        font-size: 1.1rem;
      }

      .contact-form {
        padding: 1.5rem;
      }
    }
      
  `;let vt=_e;zs([wt()],vt.prototype,"responseMessage");zs([wt()],vt.prototype,"isSubmitting");var Ui=Object.defineProperty,Mi=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ui(t,e,s),s};const $e=class $e extends S{constructor(){super(...arguments),this.slug=""}render(){switch(this.slug){case"paloaltonetworks":return $`
          <main class="panw">
            <section class="hero">
              <h1>Building a Research Toolkit for Designer-Led Discovery and PM Collaboration</h1>
              <ul class="tag-list">
                <li class="tag">UX Research</li>
                <li class="tag">Interaction Design</li>
                <li class="tag">Prototyping</li>
              </ul>
              <img src="/images/panwheader.png" alt="Palo Alto image" />
              <p>
                The UX design process at NetSec currently lacks sufficient and timely user insights...
              </p>
            </section>

            <empathize-section
              subheading="Empathize"
              heading="UNDERSTANDING DESIGNERS & THEIR RESEARCH CHALLENGES"
              paragraph="I started by conducting a thorough literature review..."
            ></empathize-section>

            <empathize-section-image
              subheading="Qualitative Research"
              heading="I RAN 9 QUALITATIVE INTERVIEWS"
              paragraph="To tailor the toolkit to their specific needs, I embarked on a series of nine in-depth user interviews with designers across various teams. I focused on evaluating three key personas"
              imgSrc="/images/affinitymap.png"
            ></empathize-section-image>

            <empathize-section-image
              subheading="Synthesis"
              heading="THREE ROUNDS OF AFFINITY MAPPING & WORKSHOPPING TO GET KEY INSIGHTS"
              imgSrc="/images/synthesis.png"
            ></empathize-section-image>

            <empathize-section
              subheading="Ideation"
              heading="BUILDING RESEARCH TOOLKIT VERSION 1 IN FIGJAM"
              paragraph="With a clearer understanding of user needs, I began developing the first iteration of the toolkit in **FigJam**. This platform was chosen initially for its collaborative nature and because it would easily integrate with a variety of pre-existing templates I had designed."
            ></empathize-section>

            <empathize-section
              subheading="Pivot!"
              heading="TESTING RESEARCH TOOLKIT VERSION 1"
              paragraph="During the first usability testing session, I watched as designers struggled to navigate the toolkit. What was meant to be a seamless experience turned into a cumbersome process. The interaction felt tedious, and users had difficulty managing the templates and steps."
            ></empathize-section>

            <empathize-section-image
              subheading="Ideation+Prototyping"
              heading="BUILDING RESEARCH TOOLKIT VERSION 2 IN FIGJAM"
              paragraph="I pivoted to **Figma**, a tool that offered more robust prototyping capabilities. With Figma, I could create a more cohesive experience, embedding interactive step-by-step guides that made the process feel intuitive. I rebuilt the toolkit, focusing on simplifying navigation and ensuring each component was logically laid out."
              imgSrc="/images/panw1.png"
            ></empathize-section-image>

            <section class="cta">
              <h2>Let's create something amazing together</h2>
              <p>
                I'm always open to discussing new projects, creative ideas...
              </p>
              <a href="/app/contact">Get in touch</a>
            </section>
          </main>
        `;case"amplitude":return $`
            <main>
              <section class="hero">
                <h1>Building a Research Toolkit for Designer-Led Discovery and PM Collaboration</h1>
                <ul class="tag-list">
                  <li class="tag">UX Research</li>
                  <li class="tag">Interaction Design</li>
                  <li class="tag">Prototyping</li>
                </ul>
                <img src="/images/panw1.png" alt="Palo Alto image" />
                <p>
                  The UX design process at NetSec currently lacks sufficient and timely user insights due to limited availability and accessibility of research resources. Additionally, there is a need for a streamlined process to onboard Product Managers (PMs) into research activities to garner their support and enhance collaboration. To address these issues, a comprehensive UX Research Toolkit is needed to enable designers to conduct effective research.
                </p>
              </section>
  
              <empathize-section
                heading="UNDERSTANDING DESIGNERS & THEIR RESEARCH CHALLENGES"
                paragraph="I started by conducting a thorough literature review, examining existing templates and frameworks to see what tools were already out there and how they could inspire my approach."
              ></empathize-section>
  
              <empathize-section-image
                heading="I RAN 9 QUALITATIVE INTERVIEWS"
                paragraph="To tailor the toolkit to their specific needs, I embarked on a series of nine in-depth user interviews with designers across various teams. I focused on evaluating three key personas"
              ></empathize-section-image>
  
              <section class="cta">
                <h2>Let's create something amazing together</h2>
                <p>
                  I'm always open to discussing new projects, creative ideas...
                </p>
                <a href="/app/contact">Get in touch</a>
              </section>
            </main>
          `}}};$e.styles=q`
    /* Put your layout styles here */
    .tag-list {
      list-style: none;
      display: flex;
      gap: 1rem;
      padding: 0;
    }


    
    .tag {
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-reg);
  font-size: var(--font-size-small);
  line-height: var(--lh-xlarge);
  color: var(--color-text-secondary);
  padding: .125rem .375rem;
  background-color: var(--color-background-secondary);
  border-radius: var(--border-radius-small);
  display: inline-block;
  margin-right: .25rem;
}

    .cta {
      margin-top: 4rem;
      background: var(--color-primary);
      color: white;
      padding: 2rem;
      text-align: center;
      border-radius: 8px;
    }

    .cta a {
      color: var(--color-primary);
      background: white;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
    }

    img {
      width: 100%;
      max-width: 6000px;
      border-radius: 8px;
    }
    .panw p {
    margin-block: .5rem;
}
    @media screen and (max-width: 1200px) {
  nav, footer, #project-list, header, .panw, .amplitude {
      padding-left: 1rem;
      padding-right: 1rem;
  }
}
  .panw,.amplitude{
  section {
      margin-block-end: 5rem;
      margin-block-start: 5rem;
  }
}
  `;let Mt=$e;Mi([x({attribute:"project-slug"})],Mt.prototype,"slug");const Li=[{path:"/app/project/:slug",view:i=>$`
        <project-view project-slug=${i.slug}></project-view>
      `},{path:"/app/about",view:()=>$`
        <about-view></about-view>
      `},{path:"/app/contact",view:()=>$`
        <contact-view></contact-view>
      `},{path:"/app",view:()=>$`
        <home-view></home-view>
      `},{path:"/",redirect:"/app"}];ri({"mu-auth":rr.Provider,"mu-history":lr.Provider,"portfolio-header":Ut,"home-view":yt,"about-view":se,"contact-view":vt,"project-view":Mt,"mu-switch":class extends ti.Element{constructor(){super(Li,"app:history","app:auth")}}});
