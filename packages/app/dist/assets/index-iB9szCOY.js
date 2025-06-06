(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();var B,we;class nt extends Error{}nt.prototype.name="InvalidTokenError";function qs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function Vs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return qs(t)}catch{return atob(t)}}function Qe(i,t){if(typeof i!="string")throw new nt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new nt(`Invalid token specified: missing part #${e+1}`);let s;try{s=Vs(r)}catch(o){throw new nt(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(s)}catch(o){throw new nt(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const Bs="mu:context",Xt=`${Bs}:change`;class Fs{constructor(t,e){this._proxy=Ws(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Ze extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Fs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Ws(i,t){return new Proxy(i,{get:(r,s,o)=>{if(s==="then")return;const n=Reflect.get(r,s,o);return console.log(`Context['${s}'] => `,n),n},set:(r,s,o,n)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,o);const a=Reflect.set(r,s,o,n);if(a){let d=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:o}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${o}`);return a}})}function Ys(i,t){const e=ts(t,i);return new Promise((r,s)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function ts(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return ts(i,s.host)}class Gs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function es(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Gs(e,i))}class se{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Ks(i){return t=>({...t,...i})}const Qt="mu:auth:jwt",ss=class rs extends se{constructor(t,e){super((r,s)=>this.update(r,s),t,rs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(Xs(r)),Ft(s);case"auth/signout":return e(Qs()),Ft(this._redirectForLogin);case"auth/redirect":return Ft(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};ss.EVENT_TYPE="auth:message";let is=ss;const os=es(is.EVENT_TYPE);function Ft(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,o])=>r.searchParams.set(s,o)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class Js extends Ze{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=K.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new is(this.context,this.redirect).attach(this)}}class ht{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Qt),t}}class K extends ht{constructor(t){super();const e=Qe(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new K(t);return localStorage.setItem(Qt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Qt);return t?K.authenticate(t):new ht}}function Xs(i){return Ks({user:K.authenticate(i),token:i})}function Qs(){return i=>{const t=i.user;return{user:t&&t.authenticated?ht.deauthenticate(t):t,token:""}}}function Zs(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function tr(i){return i.authenticated?Qe(i.token||""):{}}const er=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:K,Provider:Js,User:ht,dispatch:os,headers:Zs,payload:tr},Symbol.toStringTag,{value:"Module"}));function Zt(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function Ae(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}function ns(i,...t){const e=i.map((s,o)=>o?[t[o-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const sr=new DOMParser;function I(i,...t){const e=t.map(l),r=i.map((a,d)=>{if(d===0)return[a];const m=e[d-1];return m instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[m,a]}).flat().join(""),s=sr.parseFromString(r,"text/html"),o=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,d)=>{if(a instanceof Node){const m=n.querySelector(`ins#mu-html-${d}`);if(m){const u=m.parentNode;u==null||u.replaceChild(a,m)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),n;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ee(a);case"bigint":case"boolean":case"number":case"symbol":return Ee(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const m=new DocumentFragment,u=a.map(l);return m.replaceChildren(...u),m}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ee(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function jt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:o};return r;function s(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function o(...n){e.adoptedStyleSheets=n}}B=class extends HTMLElement{constructor(){super(),this._state={},jt(this).template(B.template).styles(B.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Zt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},rr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},B.template=I`
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
  `,B.styles=ns`
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
  `;function rr(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!s;break;case"date":n.value=s.toISOString().substr(0,10);break;default:n.value=s;break}}}return i}const as=class ls extends se{constructor(t){super((e,r)=>this.update(e,r),t,ls.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(or(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(nr(r,s));break}}}};as.EVENT_TYPE="history:message";let re=as;class Se extends Ze{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ir(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ie(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new re(this.context).attach(this)}}function ir(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function or(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function nr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ie=es(re.EVENT_TYPE),ar=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Se,Provider:Se,Service:re,dispatch:ie},Symbol.toStringTag,{value:"Module"}));class Pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new xe(this._provider,t);this._effects.push(s),e(s)}else Ys(this._target,this._contextLabel).then(s=>{const o=new xe(s,t);this._provider=s,this._effects.push(o),s.attach(n=>this._handleChange(n)),e(o)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class xe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const cs=class hs extends HTMLElement{constructor(){super(),this._state={},this._user=new ht,this._authObserver=new Pt(this,"blazing:auth"),jt(this).template(hs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;lr(s,this._state,e,this.authorization).then(o=>st(o,this)).then(o=>{const n=`mu-rest-form:${r}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[r]:o,url:s}});this.dispatchEvent(l)}).catch(o=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},st(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ke(this.src,this.authorization).then(e=>{this._state=e,st(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&ke(this.src,this.authorization).then(s=>{this._state=s,st(s,this)});break;case"new":r&&(this._state={},st({},this));break}}};cs.observedAttributes=["src","new","action"];cs.template=I`
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
  `;function ke(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function st(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!s;break;default:n.value=s;break}}}return i}function lr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const cr=class us extends se{constructor(t,e){super(e,t,us.EVENT_TYPE,!1)}};cr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,oe=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ne=Symbol(),Pe=new WeakMap;let ds=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==ne)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(oe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Pe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Pe.set(e,t))}return t}toString(){return this.cssText}};const hr=i=>new ds(typeof i=="string"?i:i+"",void 0,ne),ur=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new ds(e,i,ne)},dr=(i,t)=>{if(oe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=xt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Ce=oe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return hr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:pr,defineProperty:mr,getOwnPropertyDescriptor:fr,getOwnPropertyNames:gr,getOwnPropertySymbols:yr,getPrototypeOf:vr}=Object,J=globalThis,Te=J.trustedTypes,_r=Te?Te.emptyScript:"",Oe=J.reactiveElementPolyfillSupport,at=(i,t)=>i,Ct={toAttribute(i,t){switch(t){case Boolean:i=i?_r:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ae=(i,t)=>!pr(i,t),Re={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&mr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=fr(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const l=s==null?void 0:s.call(this);o.call(this,n),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Re}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;const t=vr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){const e=this.properties,r=[...gr(e),...yr(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Ce(s))}else t!==void 0&&e.push(Ce(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return dr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const n=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Ct).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=s.getPropertyOptions(o),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:Ct;this._$Em=o,this[o]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ae)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[at("elementProperties")]=new Map,W[at("finalized")]=new Map,Oe==null||Oe({ReactiveElement:W}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Ot=Tt.trustedTypes,Ne=Ot?Ot.createPolicy("lit-html",{createHTML:i=>i}):void 0,ps="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,ms="?"+P,br=`<${ms}>`,H=document,ut=()=>H.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",le=Array.isArray,$r=i=>le(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Wt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ue=/-->/g,Me=/>/g,U=RegExp(`>|${Wt}(?:([^\\s"'>=/]+)(${Wt}*=${Wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Le=/'/g,je=/"/g,fs=/^(?:script|style|textarea|title)$/i,wr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),it=wr(1),X=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ie=new WeakMap,L=H.createTreeWalker(H,129);function gs(i,t){if(!le(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ne!==void 0?Ne.createHTML(t):t}const Ar=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=rt;for(let l=0;l<e;l++){const a=i[l];let d,m,u=-1,c=0;for(;c<a.length&&(n.lastIndex=c,m=n.exec(a),m!==null);)c=n.lastIndex,n===rt?m[1]==="!--"?n=Ue:m[1]!==void 0?n=Me:m[2]!==void 0?(fs.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=U):m[3]!==void 0&&(n=U):n===U?m[0]===">"?(n=s??rt,u=-1):m[1]===void 0?u=-2:(u=n.lastIndex-m[2].length,d=m[1],n=m[3]===void 0?U:m[3]==='"'?je:Le):n===je||n===Le?n=U:n===Ue||n===Me?n=rt:(n=U,s=void 0);const h=n===U&&i[l+1].startsWith("/>")?" ":"";o+=n===rt?a+br:u>=0?(r.push(d),a.slice(0,u)+ps+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[gs(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let te=class ys{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[d,m]=Ar(t,e);if(this.el=ys.createElement(d,r),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=L.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(ps)){const c=m[n++],h=s.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?Sr:p[1]==="?"?xr:p[1]==="@"?kr:It}),s.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:o}),s.removeAttribute(u));if(fs.test(s.tagName)){const u=s.textContent.split(P),c=u.length-1;if(c>0){s.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],ut()),L.nextNode(),a.push({type:2,index:++o});s.append(u[c],ut())}}}else if(s.nodeType===8)if(s.data===ms)a.push({type:2,index:o});else{let u=-1;for(;(u=s.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:o}),u+=P.length-1}o++}}static createElement(t,e){const r=H.createElement("template");return r.innerHTML=t,r}};function Q(i,t,e=i,r){var s,o;if(t===X)return t;let n=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const l=dt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),l===void 0?n=void 0:(n=new l(i),n._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=n:e.l=n),n!==void 0&&(t=Q(i,n._$AS(i,t.values),n,r)),t}class Er{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=s;let o=L.nextNode(),n=0,l=0,a=r[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new _t(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new Pr(o,this,t)),this._$AV.push(d),a=r[++l]}n!==(a==null?void 0:a.index)&&(o=L.nextNode(),n++)}return L.currentNode=H,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),dt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$r(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=te.createElement(gs(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(r);else{const n=new Er(o,this),l=n.u(this.options);n.p(r),this.T(l),this._$AH=n}}_$AC(t){let e=Ie.get(t.strings);return e===void 0&&Ie.set(t.strings,e=new te(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new _t(this.O(ut()),this.O(ut()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class It{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=Q(this,t,e,0),n=!dt(t)||t!==this._$AH&&t!==X,n&&(this._$AH=t);else{const l=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=Q(this,l[r+a],e,a),d===X&&(d=this._$AH[a]),n||(n=!dt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Sr extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class xr extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class kr extends It{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??_)===X)return;const r=this._$AH,s=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Pr{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ze=Tt.litHtmlPolyfillSupport;ze==null||ze(te,_t),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Cr=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new _t(t.insertBefore(ut(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let G=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Cr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return X}};G._$litElement$=!0,G.finalized=!0,(we=globalThis.litElementHydrateSupport)==null||we.call(globalThis,{LitElement:G});const He=globalThis.litElementPolyfillSupport;He==null||He({LitElement:G});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tr={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ae},Or=(i=Tr,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.P(n,void 0,i),l}}}if(r==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function vs(i){return(t,e)=>typeof e=="object"?Or(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _s(i){return vs({...i,state:!0,attribute:!1})}function Rr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Nr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var bs={};(function(i){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},r=[1,9],s=[1,10],o=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,f,y,Ht){var A=y.length-1;switch(f){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:o,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,f){this.message=g,this.hash=f};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],f=[],y=this.table,Ht="",A=0,_e=0,Is=2,be=1,zs=f.slice.call(arguments,1),v=Object.create(this.lexer),R={yy:{}};for(var Dt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Dt)&&(R.yy[Dt]=this.yy[Dt]);v.setInput(c,R.yy),R.yy.lexer=v,R.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var qt=v.yylloc;f.push(qt);var Hs=v.options&&v.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ds=function(){var V;return V=v.lex()||be,typeof V!="number"&&(V=h.symbols_[V]||V),V},w,N,E,Vt,q={},Et,x,$e,St;;){if(N=p[p.length-1],this.defaultActions[N]?E=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Ds()),E=y[N]&&y[N][w]),typeof E>"u"||!E.length||!E[0]){var Bt="";St=[];for(Et in y[N])this.terminals_[Et]&&Et>Is&&St.push("'"+this.terminals_[Et]+"'");v.showPosition?Bt="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Bt="Parse error on line "+(A+1)+": Unexpected "+(w==be?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Bt,{text:v.match,token:this.terminals_[w]||w,line:v.yylineno,loc:qt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(v.yytext),f.push(v.yylloc),p.push(E[1]),w=null,_e=v.yyleng,Ht=v.yytext,A=v.yylineno,qt=v.yylloc;break;case 2:if(x=this.productions_[E[1]][1],q.$=g[g.length-x],q._$={first_line:f[f.length-(x||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(x||1)].first_column,last_column:f[f.length-1].last_column},Hs&&(q._$.range=[f[f.length-(x||1)].range[0],f[f.length-1].range[1]]),Vt=this.performAction.apply(q,[Ht,_e,A,R.yy,E[1],g,f].concat(zs)),typeof Vt<"u")return Vt;x&&(p=p.slice(0,-1*x*2),g=g.slice(0,-1*x),f=f.slice(0,-1*x)),p.push(this.productions_[E[1]][0]),g.push(q.$),f.push(q._$),$e=y[p[p.length-2]][p[p.length-1]],p.push($e);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in f)this[y]=f[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),y=0;y<f.length;y++)if(p=this._input.match(this.rules[f[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,f[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,f[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,f){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function m(){this.yy={}}return m.prototype=a,a.Parser=m,new m}();typeof Nr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(bs);function F(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var $s={Root:F("Root"),Concat:F("Concat"),Literal:F("Literal"),Splat:F("Splat"),Param:F("Param"),Optional:F("Optional")},ws=bs.parser;ws.yy=$s;var Ur=ws,Mr=Object.keys($s);function Lr(i){return Mr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var As=Lr,jr=As,Ir=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Es(i){this.captures=i.captures,this.re=i.re}Es.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var zr=jr({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Ir,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Es({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Hr=zr,Dr=As,qr=Dr({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Vr=qr,Br=Ur,Fr=Hr,Wr=Vr;bt.prototype=Object.create(null);bt.prototype.match=function(i){var t=Fr.visit(this.ast),e=t.match(i);return e||!1};bt.prototype.reverse=function(i){return Wr.visit(this.ast,i)};function bt(i){var t;if(this?t=this:t=Object.create(bt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Br.parse(i),t}var Yr=bt,Gr=Yr,Kr=Gr;const Jr=Rr(Kr);var Xr=Object.defineProperty,Ss=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Xr(t,e,s),s};const xs=class extends G{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>it` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new Jr(s.path)})),this._historyObserver=new Pt(this,e),this._authObserver=new Pt(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),it` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(os(this,"auth/redirect"),it` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):it` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),it` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),o=r+e;for(const n of this._cases){const l=n.route.match(o);if(l)return{...n,path:r,params:l,query:s}}}redirect(t){ie(this,"history/redirect",{href:t})}};xs.styles=ur`
    :host,
    main {
      display: contents;
    }
  `;let Rt=xs;Ss([_s()],Rt.prototype,"_user");Ss([_s()],Rt.prototype,"_match");const Qr=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),Zr=class ks extends HTMLElement{constructor(){if(super(),jt(this).template(ks.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Zr.template=I`
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
  `;const Ps=class ee extends HTMLElement{constructor(){super(),this._array=[],jt(this).template(ee.template).styles(ee.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Cs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{Ae(t,"button.add")?Zt(t,"input-array:add"):Ae(t,"button.remove")&&Zt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ti(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};Ps.template=I`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ps.styles=ns`
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
  `;function ti(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Cs(e)))}function Cs(i,t){const e=i===void 0?I`<input />`:I`<input value="${i}" />`;return I`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ei(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var si=Object.defineProperty,ri=Object.getOwnPropertyDescriptor,ii=(i,t,e,r)=>{for(var s=ri(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&si(t,e,s),s};class oi extends G{constructor(t){super(),this._pending=[],this._observer=new Pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}ii([vs()],oi.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,ce=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),De=new WeakMap;let Ts=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=De.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&De.set(e,t))}return t}toString(){return this.cssText}};const ni=i=>new Ts(typeof i=="string"?i:i+"",void 0,he),et=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new Ts(e,i,he)},ai=(i,t)=>{if(ce)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=kt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},qe=ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ni(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:li,defineProperty:ci,getOwnPropertyDescriptor:hi,getOwnPropertyNames:ui,getOwnPropertySymbols:di,getPrototypeOf:pi}=Object,T=globalThis,Ve=T.trustedTypes,mi=Ve?Ve.emptyScript:"",Yt=T.reactiveElementPolyfillSupport,lt=(i,t)=>i,Nt={toAttribute(i,t){switch(t){case Boolean:i=i?mi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!li(i,t),Be={attribute:!0,type:String,converter:Nt,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&ci(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=hi(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){const l=s==null?void 0:s.call(this);o==null||o.call(this,n),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=pi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,r=[...ui(e),...di(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(qe(s))}else t!==void 0&&e.push(qe(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var o;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:Nt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var o,n;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const l=r.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Nt;this._$Em=s,this[s]=a.fromAttribute(e,l.type)??((n=this._$Ej)==null?void 0:n.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const o=this.constructor,n=this[t];if(r??(r=o.getPropertyOptions(t)),!((r.hasChanged??ue)(n,e)||r.useDefault&&r.reflect&&n===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s){const{wrapped:l}=n,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[lt("elementProperties")]=new Map,Y[lt("finalized")]=new Map,Yt==null||Yt({ReactiveElement:Y}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct=globalThis,Ut=ct.trustedTypes,Fe=Ut?Ut.createPolicy("lit-html",{createHTML:i=>i}):void 0,Os="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Rs="?"+C,fi=`<${Rs}>`,D=document,pt=()=>D.createComment(""),mt=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,gi=i=>de(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Ye=/>/g,M=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Ke=/"/g,Ns=/^(?:script|style|textarea|title)$/i,yi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),$=yi(1),Z=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Je=new WeakMap,j=D.createTreeWalker(D,129);function Us(i,t){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(t):t}const vi=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=ot;for(let l=0;l<e;l++){const a=i[l];let d,m,u=-1,c=0;for(;c<a.length&&(n.lastIndex=c,m=n.exec(a),m!==null);)c=n.lastIndex,n===ot?m[1]==="!--"?n=We:m[1]!==void 0?n=Ye:m[2]!==void 0?(Ns.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=M):m[3]!==void 0&&(n=M):n===M?m[0]===">"?(n=s??ot,u=-1):m[1]===void 0?u=-2:(u=n.lastIndex-m[2].length,d=m[1],n=m[3]===void 0?M:m[3]==='"'?Ke:Ge):n===Ke||n===Ge?n=M:n===We||n===Ye?n=ot:(n=M,s=void 0);const h=n===M&&i[l+1].startsWith("/>")?" ":"";o+=n===ot?a+fi:u>=0?(r.push(d),a.slice(0,u)+Os+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[Us(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class ft{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[d,m]=vi(t,e);if(this.el=ft.createElement(d,r),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=j.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Os)){const c=m[n++],h=s.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?bi:p[1]==="?"?$i:p[1]==="@"?wi:zt}),s.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(u));if(Ns.test(s.tagName)){const u=s.textContent.split(C),c=u.length-1;if(c>0){s.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],pt()),j.nextNode(),a.push({type:2,index:++o});s.append(u[c],pt())}}}else if(s.nodeType===8)if(s.data===Rs)a.push({type:2,index:o});else{let u=-1;for(;(u=s.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:o}),u+=C.length-1}o++}}static createElement(t,e){const r=D.createElement("template");return r.innerHTML=t,r}}function tt(i,t,e=i,r){var n,l;if(t===Z)return t;let s=r!==void 0?(n=e._$Co)==null?void 0:n[r]:e._$Cl;const o=mt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=tt(i,s._$AS(i,t.values),s,r)),t}class _i{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??D).importNode(e,!0);j.currentNode=s;let o=j.nextNode(),n=0,l=0,a=r[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new $t(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new Ai(o,this,t)),this._$AV.push(d),a=r[++l]}n!==(a==null?void 0:a.index)&&(o=j.nextNode(),n++)}return j.currentNode=D,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class $t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),mt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ft.createElement(Us(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{const n=new _i(s,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new ft(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new $t(this.O(pt()),this.O(pt()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=tt(this,t,e,0),n=!mt(t)||t!==this._$AH&&t!==Z,n&&(this._$AH=t);else{const l=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=tt(this,l[r+a],e,a),d===Z&&(d=this._$AH[a]),n||(n=!mt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class bi extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class $i extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class wi extends zt{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??b)===Z)return;const r=this._$AH,s=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==b&&(r===b||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ai{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Kt=ct.litHtmlPolyfillSupport;Kt==null||Kt(ft,$t),(ct.litHtmlVersions??(ct.litHtmlVersions=[])).push("3.3.0");const Ei=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new $t(t.insertBefore(pt(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=globalThis;class S extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ei(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Z}}var Xe;S._$litElement$=!0,S.finalized=!0,(Xe=z.litElementHydrateSupport)==null||Xe.call(z,{LitElement:S});const Jt=z.litElementPolyfillSupport;Jt==null||Jt({LitElement:S});(z.litElementVersions??(z.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Si={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:ue},xi=(i=Si,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(r==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function k(i){return(t,e)=>typeof e=="object"?xi(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function wt(i){return k({...i,state:!0,attribute:!1})}var ki=Object.defineProperty,Pi=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&ki(t,e,s),s};const pe=class pe extends S{constructor(){super(...arguments),this.isDarkMode=!1}handleDarkModeToggle(){this.isDarkMode=!this.isDarkMode,document.body.classList.toggle("dark",this.isDarkMode)}render(){return $`
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
    `}};pe.styles=et`
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
  `;let Mt=pe;Pi([wt()],Mt.prototype,"isDarkMode");var Ci=Object.defineProperty,Ms=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ci(t,e,s),s};const me=class me extends S{constructor(){super(...arguments),this.isLocked=!0,this.errorMessage=""}handlePasswordSubmit(t){t.preventDefault(),t.target.querySelector("#password-input").value==="your-password-here"?(this.isLocked=!1,this.errorMessage=""):this.errorMessage="Incorrect password. Please try again."}render(){return this.isLocked?$`
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
            </div>
          </section>
        </header>

        <!-- Portfolio Section -->
        <section class="portfolio">
          <header class="portfolio-header">
            <h3>
              Reva Moolky
              <span class="subtitle">
                is a product designer who loves to turn complex challenges into simple, empowering experiences
              </span>
            </h3>
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
                        <img src="/images/panw1.png" alt="Palo Alto Networks project">
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
    `}};me.styles=et`
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
  `;let gt=me;Ms([wt()],gt.prototype,"isLocked");Ms([wt()],gt.prototype,"errorMessage");var Ti=Object.defineProperty,Ls=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ti(t,e,s),s};const fe=class fe extends S{constructor(){super(...arguments),this.responseMessage="",this.isSubmitting=!1}async handleContactSubmit(t){t.preventDefault(),this.isSubmitting=!0,this.responseMessage="";const e=t.target,r={name:e.querySelector('[name="name"]').value,email:e.querySelector('[name="email"]').value,subject:e.querySelector('[name="subject"]').value,message:e.querySelector('[name="message"]').value};try{(await fetch("http://localhost:3000/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).ok?(this.responseMessage="Message sent! ✅",e.reset()):this.responseMessage="Something went wrong. ❌"}catch(s){this.responseMessage="Error sending message. ❌",console.error(s)}finally{this.isSubmitting=!1}}render(){return $`
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
    `}};fe.styles=et`
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
      color: var(--color-text);
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
      
  `;let yt=fe;Ls([wt()],yt.prototype,"responseMessage");Ls([wt()],yt.prototype,"isSubmitting");var Oi=Object.defineProperty,js=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Oi(t,e,s),s};const ge=class ge extends S{constructor(){super(...arguments),this.heading="",this.paragraph=""}render(){return $`
      <section class="block">
        <h6>Empathize</h6>
        <ul class="grid text-d-banner">
          <li class="column-6"><h2>${this.heading}</h2></li>
          <li class="column-6"><p>${this.paragraph}</p></li>
        </ul>
      </section>
    `}};ge.styles=et`
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

    p {
      margin-block: 0.5rem;
    }
  `;let vt=ge;js([k({type:String})],vt.prototype,"heading");js([k({type:String})],vt.prototype,"paragraph");customElements.define("empathize-section",vt);var Ri=Object.defineProperty,At=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ri(t,e,s),s};const ye=class ye extends S{constructor(){super(...arguments),this.heading="",this.subheading="",this.paragraph="",this.imgSrc="",this.imgAlt=""}render(){return $`
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
    `}};ye.styles=et`
    :host {
      display: block;
      margin-block-end: 5rem;
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
  `;let O=ye;At([k({type:String})],O.prototype,"heading");At([k({type:String})],O.prototype,"subheading");At([k({type:String})],O.prototype,"paragraph");At([k({type:String})],O.prototype,"imgSrc");At([k({type:String})],O.prototype,"imgAlt");customElements.define("empathize-section-image",O);var Ni=Object.defineProperty,Ui=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ni(t,e,s),s};const ve=class ve extends S{constructor(){super(...arguments),this.slug=""}render(){switch(this.slug){case"paloaltonetworks":return $`
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
                The UX design process at NetSec currently lacks sufficient and timely user insights...
              </p>
            </section>

            <empathize-section
              heading="UNDERSTANDING DESIGNERS & THEIR RESEARCH CHALLENGES"
              paragraph="I started by conducting a thorough literature review..."
            ></empathize-section>

            <empathize-section
              heading="I RAN 9 QUALITATIVE INTERVIEWS"
              paragraph="To tailor the toolkit to their specific needs..."
            ></empathize-section>

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
                  The UX design process at NetSec currently lacks sufficient and timely user insights...
                </p>
              </section>
  
              <empathize-section
                heading="UNDERSTANDING DESIGNERS & THEIR RESEARCH CHALLENGES"
                paragraph="I started by conducting a thorough literature review..."
              ></empathize-section>
  
              <empathize-section
                heading="I RAN 9 QUALITATIVE INTERVIEWS"
                paragraph="To tailor the toolkit to their specific needs..."
              ></empathize-section>
  
              <section class="cta">
                <h2>Let's create something amazing together</h2>
                <p>
                  I'm always open to discussing new projects, creative ideas...
                </p>
                <a href="/app/contact">Get in touch</a>
              </section>
            </main>
          `}}};ve.styles=et`
    /* Put your layout styles here */
    .tag-list {
      list-style: none;
      display: flex;
      gap: 1rem;
      padding: 0;
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
      max-width: 600px;
      border-radius: 8px;
    }
  `;let Lt=ve;Ui([k({attribute:"project-slug"})],Lt.prototype,"slug");const Mi=[{path:"/app/project/:slug",view:i=>$`
        <project-view project-slug=${i.slug}></project-view>
      `},{path:"/app/about",view:()=>$`
        <about-view></about-view>
      `},{path:"/app/contact",view:()=>$`
        <contact-view></contact-view>
      `},{path:"/app",view:()=>$`
        <home-view></home-view>
      `},{path:"/",redirect:"/app"}];ei({"mu-auth":er.Provider,"mu-history":ar.Provider,"portfolio-header":Mt,"home-view":gt,"contact-view":yt,"project-view":Lt,"mu-switch":class extends Qr.Element{constructor(){super(Mi,"app:history","app:auth")}}});
