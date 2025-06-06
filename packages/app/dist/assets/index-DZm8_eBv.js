(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var q,fe;class rt extends Error{}rt.prototype.name="InvalidTokenError";function Us(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ms(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Us(t)}catch{return atob(t)}}function Be(i,t){if(typeof i!="string")throw new rt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new rt(`Invalid token specified: missing part #${e+1}`);let r;try{r=Ms(s)}catch(o){throw new rt(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new rt(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const Ns="mu:context",Ft=`${Ns}:change`;class js{constructor(t,e){this._proxy=Ls(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Fe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new js(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Ft,t),t}detach(t){this.removeEventListener(Ft,t)}}function Ls(i,t){return new Proxy(i,{get:(s,r,o)=>{if(r==="then")return;const n=Reflect.get(s,r,o);return console.log(`Context['${r}'] => `,n),n},set:(s,r,o,n)=>{const c=i[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,n);if(a){let d=new CustomEvent(Ft,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:c,value:o}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function Hs(i,t){const e=Ye(t,i);return new Promise((s,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function Ye(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return Ye(i,r.host)}class Is extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function We(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Is(e,i))}class Gt{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function zs(i){return t=>({...t,...i})}const Yt="mu:auth:jwt",Ke=class Je extends Gt{constructor(t,e){super((s,r)=>this.update(s,r),t,Je.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(qs(s)),It(r);case"auth/signout":return e(Vs()),It(this._redirectForLogin);case"auth/redirect":return It(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};Ke.EVENT_TYPE="auth:message";let Ge=Ke;const Ze=We(Ge.EVENT_TYPE);function It(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,o])=>s.searchParams.set(r,o)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class Ds extends Fe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=W.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Ge(this.context,this.redirect).attach(this)}}class at{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Yt),t}}class W extends at{constructor(t){super();const e=Be(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new W(t);return localStorage.setItem(Yt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Yt);return t?W.authenticate(t):new at}}function qs(i){return zs({user:W.authenticate(i),token:i})}function Vs(){return i=>{const t=i.user;return{user:t&&t.authenticated?at.deauthenticate(t):t,token:""}}}function Bs(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Fs(i){return i.authenticated?Be(i.token||""):{}}const Ys=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:W,Provider:Ds,User:at,dispatch:Ze,headers:Bs,payload:Fs},Symbol.toStringTag,{value:"Module"}));function Wt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function me(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}function Qe(i,...t){const e=i.map((r,o)=>o?[t[o-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Ws=new DOMParser;function N(i,...t){const e=t.map(c),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=Ws.parseFromString(s,"text/html"),o=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,d)=>{if(a instanceof Node){const f=n.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),n;function c(a,d){if(a===null)return"";switch(typeof a){case"string":return ge(a);case"bigint":case"boolean":case"number":case"symbol":return ge(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(c);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ge(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Tt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:o};return s;function r(n){const c=n.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function o(...n){e.adoptedStyleSheets=n}}q=class extends HTMLElement{constructor(){super(),this._state={},Tt(this).template(q.template).styles(q.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Wt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},Ks(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},q.template=N`
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
  `,q.styles=Qe`
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
  `;function Ks(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!r;break;case"date":n.value=r.toISOString().substr(0,10);break;default:n.value=r;break}}}return i}const Xe=class ts extends Gt{constructor(t){super((e,s)=>this.update(e,s),t,ts.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(Gs(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(Zs(s,r));break}}}};Xe.EVENT_TYPE="history:message";let Zt=Xe;class ye extends Fe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Js(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Qt(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Zt(this.context).attach(this)}}function Js(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Gs(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Zs(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const Qt=We(Zt.EVENT_TYPE),Qs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:ye,Provider:ye,Service:Zt,dispatch:Qt},Symbol.toStringTag,{value:"Module"}));class At{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new ve(this._provider,t);this._effects.push(r),e(r)}else Hs(this._target,this._contextLabel).then(r=>{const o=new ve(r,t);this._provider=r,this._effects.push(o),r.attach(n=>this._handleChange(n)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class ve{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const es=class ss extends HTMLElement{constructor(){super(),this._state={},this._user=new at,this._authObserver=new At(this,"blazing:auth"),Tt(this).template(ss.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Xs(r,this._state,e,this.authorization).then(o=>X(o,this)).then(o=>{const n=`mu-rest-form:${s}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:r}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},X(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&_e(this.src,this.authorization).then(e=>{this._state=e,X(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&_e(this.src,this.authorization).then(r=>{this._state=r,X(r,this)});break;case"new":s&&(this._state={},X({},this));break}}};es.observedAttributes=["src","new","action"];es.template=N`
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
  `;function _e(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function X(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!r;break;default:n.value=r;break}}}return i}function Xs(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const tr=class rs extends Gt{constructor(t,e){super(e,t,rs.EVENT_TYPE,!1)}};tr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t=globalThis,Xt=$t.ShadowRoot&&($t.ShadyCSS===void 0||$t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),be=new WeakMap;let is=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Xt&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=be.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&be.set(e,t))}return t}toString(){return this.cssText}};const er=i=>new is(typeof i=="string"?i:i+"",void 0,te),sr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new is(e,i,te)},rr=(i,t)=>{if(Xt)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=$t.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},$e=Xt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return er(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ir,defineProperty:or,getOwnPropertyDescriptor:nr,getOwnPropertyNames:ar,getOwnPropertySymbols:cr,getPrototypeOf:lr}=Object,K=globalThis,we=K.trustedTypes,hr=we?we.emptyScript:"",Ae=K.reactiveElementPolyfillSupport,it=(i,t)=>i,Et={toAttribute(i,t){switch(t){case Boolean:i=i?hr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ee=(i,t)=>!ir(i,t),Ee={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:ee};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),K.litPropertyMetadata??(K.litPropertyMetadata=new WeakMap);let B=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ee){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&or(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=nr(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const c=r==null?void 0:r.call(this);o.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ee}static _$Ei(){if(this.hasOwnProperty(it("elementProperties")))return;const t=lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(it("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(it("properties"))){const e=this.properties,s=[...ar(e),...cr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift($e(r))}else t!==void 0&&e.push($e(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Et).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=r.getPropertyOptions(o),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Et;this._$Em=o,this[o]=c.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ee)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[it("elementProperties")]=new Map,B[it("finalized")]=new Map,Ae==null||Ae({ReactiveElement:B}),(K.reactiveElementVersions??(K.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,xt=St.trustedTypes,Se=xt?xt.createPolicy("lit-html",{createHTML:i=>i}):void 0,os="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,ns="?"+x,ur=`<${ns}>`,H=document,ct=()=>H.createComment(""),lt=i=>i===null||typeof i!="object"&&typeof i!="function",se=Array.isArray,dr=i=>se(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",zt=`[ 	
\f\r]`,tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,ke=/>/g,T=RegExp(`>|${zt}(?:([^\\s"'>=/]+)(${zt}*=${zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pe=/'/g,Ce=/"/g,as=/^(?:script|style|textarea|title)$/i,pr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),et=pr(1),J=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Oe=new WeakMap,U=H.createTreeWalker(H,129);function cs(i,t){if(!se(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Se!==void 0?Se.createHTML(t):t}const fr=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=tt;for(let c=0;c<e;c++){const a=i[c];let d,f,u=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===tt?f[1]==="!--"?n=xe:f[1]!==void 0?n=ke:f[2]!==void 0?(as.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=T):f[3]!==void 0&&(n=T):n===T?f[0]===">"?(n=r??tt,u=-1):f[1]===void 0?u=-2:(u=n.lastIndex-f[2].length,d=f[1],n=f[3]===void 0?T:f[3]==='"'?Ce:Pe):n===Ce||n===Pe?n=T:n===xe||n===ke?n=tt:(n=T,r=void 0);const h=n===T&&i[c+1].startsWith("/>")?" ":"";o+=n===tt?a+ur:u>=0?(s.push(d),a.slice(0,u)+os+a.slice(u)+x+h):a+x+(u===-2?c:h)}return[cs(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Kt=class ls{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[d,f]=fr(t,e);if(this.el=ls.createElement(d,s),U.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=U.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(os)){const l=f[n++],h=r.getAttribute(u).split(x),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?gr:p[1]==="?"?yr:p[1]==="@"?vr:Rt}),r.removeAttribute(u)}else u.startsWith(x)&&(a.push({type:6,index:o}),r.removeAttribute(u));if(as.test(r.tagName)){const u=r.textContent.split(x),l=u.length-1;if(l>0){r.textContent=xt?xt.emptyScript:"";for(let h=0;h<l;h++)r.append(u[h],ct()),U.nextNode(),a.push({type:2,index:++o});r.append(u[l],ct())}}}else if(r.nodeType===8)if(r.data===ns)a.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(x,u+1))!==-1;)a.push({type:7,index:o}),u+=x.length-1}o++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function G(i,t,e=i,s){var r,o;if(t===J)return t;let n=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const c=lt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==c&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(i),n._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=n:e.l=n),n!==void 0&&(t=G(i,n._$AS(i,t.values),n,s)),t}class mr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??H).importNode(e,!0);U.currentNode=r;let o=U.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new mt(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new _r(o,this,t)),this._$AV.push(d),a=s[++c]}n!==(a==null?void 0:a.index)&&(o=U.nextNode(),n++)}return U.currentNode=H,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class mt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),lt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==J&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):dr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&lt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Kt.createElement(cs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new mr(o,this),c=n.u(this.options);n.p(s),this.T(c),this._$AH=n}}_$AC(t){let e=Oe.get(t.strings);return e===void 0&&Oe.set(t.strings,e=new Kt(t)),e}k(t){se(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new mt(this.O(ct()),this.O(ct()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Rt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=G(this,t,e,0),n=!lt(t)||t!==this._$AH&&t!==J,n&&(this._$AH=t);else{const c=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=G(this,c[s+a],e,a),d===J&&(d=this._$AH[a]),n||(n=!lt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class gr extends Rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class yr extends Rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class vr extends Rt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??_)===J)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class _r{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const Te=St.litHtmlPolyfillSupport;Te==null||Te(Kt,mt),(St.litHtmlVersions??(St.litHtmlVersions=[])).push("3.2.0");const br=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new mt(t.insertBefore(ct(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Y=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=br(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return J}};Y._$litElement$=!0,Y.finalized=!0,(fe=globalThis.litElementHydrateSupport)==null||fe.call(globalThis,{LitElement:Y});const Re=globalThis.litElementPolyfillSupport;Re==null||Re({LitElement:Y});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $r={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:ee},wr=(i=$r,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.P(n,void 0,i),c}}}if(s==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function hs(i){return(t,e)=>typeof e=="object"?wr(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function us(i){return hs({...i,state:!0,attribute:!1})}function Ar(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Er(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ds={};(function(i){var t=function(){var e=function(u,l,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=l);return h},s=[1,9],r=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,p,g,m,y,Mt){var w=y.length-1;switch(m){case 1:return new g.Root({},[y[w-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[w-1],y[w]]);break;case 4:case 5:this.$=y[w];break;case 6:this.$=new g.Literal({value:y[w]});break;case 7:this.$=new g.Splat({name:y[w]});break;case 8:this.$=new g.Param({name:y[w]});break;case 9:this.$=new g.Optional({},[y[w-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:n},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(l,h)}},parse:function(l){var h=this,p=[0],g=[null],m=[],y=this.table,Mt="",w=0,ue=0,Cs=2,de=1,Os=m.slice.call(arguments,1),v=Object.create(this.lexer),C={yy:{}};for(var Nt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Nt)&&(C.yy[Nt]=this.yy[Nt]);v.setInput(l,C.yy),C.yy.lexer=v,C.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var jt=v.yylloc;m.push(jt);var Ts=v.options&&v.options.ranges;typeof C.yy.parseError=="function"?this.parseError=C.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Rs=function(){var D;return D=v.lex()||de,typeof D!="number"&&(D=h.symbols_[D]||D),D},$,O,A,Lt,z={},_t,S,pe,bt;;){if(O=p[p.length-1],this.defaultActions[O]?A=this.defaultActions[O]:(($===null||typeof $>"u")&&($=Rs()),A=y[O]&&y[O][$]),typeof A>"u"||!A.length||!A[0]){var Ht="";bt=[];for(_t in y[O])this.terminals_[_t]&&_t>Cs&&bt.push("'"+this.terminals_[_t]+"'");v.showPosition?Ht="Parse error on line "+(w+1)+`:
`+v.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[$]||$)+"'":Ht="Parse error on line "+(w+1)+": Unexpected "+($==de?"end of input":"'"+(this.terminals_[$]||$)+"'"),this.parseError(Ht,{text:v.match,token:this.terminals_[$]||$,line:v.yylineno,loc:jt,expected:bt})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+O+", token: "+$);switch(A[0]){case 1:p.push($),g.push(v.yytext),m.push(v.yylloc),p.push(A[1]),$=null,ue=v.yyleng,Mt=v.yytext,w=v.yylineno,jt=v.yylloc;break;case 2:if(S=this.productions_[A[1]][1],z.$=g[g.length-S],z._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Ts&&(z._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Lt=this.performAction.apply(z,[Mt,ue,w,C.yy,A[1],g,m].concat(Os)),typeof Lt<"u")return Lt;S&&(p=p.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),p.push(this.productions_[A[1]][0]),g.push(z.$),m.push(z._$),pe=y[p[p.length-2]][p[p.length-1]],p.push(pe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,p=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(l=this.test_match(p,m[y]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Er<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(ds);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var ps={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},fs=ds.parser;fs.yy=ps;var Sr=fs,xr=Object.keys(ps);function kr(i){return xr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var ms=kr,Pr=ms,Cr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function gs(i){this.captures=i.captures,this.re=i.re}gs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Or=Pr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Cr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new gs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Tr=Or,Rr=ms,Ur=Rr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Mr=Ur,Nr=Sr,jr=Tr,Lr=Mr;gt.prototype=Object.create(null);gt.prototype.match=function(i){var t=jr.visit(this.ast),e=t.match(i);return e||!1};gt.prototype.reverse=function(i){return Lr.visit(this.ast,i)};function gt(i){var t;if(this?t=this:t=Object.create(gt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Nr.parse(i),t}var Hr=gt,Ir=Hr,zr=Ir;const Dr=Ar(zr);var qr=Object.defineProperty,ys=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&qr(t,e,r),r};const vs=class extends Y{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>et` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Dr(r.path)})),this._historyObserver=new At(this,e),this._authObserver=new At(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),et` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Ze(this,"auth/redirect"),et` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):et` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),et` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),o=s+e;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:s,params:c,query:r}}}redirect(t){Qt(this,"history/redirect",{href:t})}};vs.styles=sr`
    :host,
    main {
      display: contents;
    }
  `;let kt=vs;ys([us()],kt.prototype,"_user");ys([us()],kt.prototype,"_match");const Vr=Object.freeze(Object.defineProperty({__proto__:null,Element:kt,Switch:kt},Symbol.toStringTag,{value:"Module"})),Br=class _s extends HTMLElement{constructor(){if(super(),Tt(this).template(_s.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Br.template=N`
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
  `;const bs=class Jt extends HTMLElement{constructor(){super(),this._array=[],Tt(this).template(Jt.template).styles(Jt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append($s("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{me(t,"button.add")?Wt(t,"input-array:add"):me(t,"button.remove")&&Wt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Fr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};bs.template=N`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;bs.styles=Qe`
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
  `;function Fr(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append($s(e)))}function $s(i,t){const e=i===void 0?N`<input />`:N`<input value="${i}" />`;return N`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Yr(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Wr=Object.defineProperty,Kr=Object.getOwnPropertyDescriptor,Jr=(i,t,e,s)=>{for(var r=Kr(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Wr(t,e,r),r};class Gr extends Y{constructor(t){super(),this._pending=[],this._observer=new At(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Jr([hs()],Gr.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,re=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ie=Symbol(),Ue=new WeakMap;let ws=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ie)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(re&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ue.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ue.set(e,t))}return t}toString(){return this.cssText}};const Zr=i=>new ws(typeof i=="string"?i:i+"",void 0,ie),oe=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new ws(e,i,ie)},Qr=(i,t)=>{if(re)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=wt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Me=re?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Zr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Xr,defineProperty:ti,getOwnPropertyDescriptor:ei,getOwnPropertyNames:si,getOwnPropertySymbols:ri,getPrototypeOf:ii}=Object,P=globalThis,Ne=P.trustedTypes,oi=Ne?Ne.emptyScript:"",Dt=P.reactiveElementPolyfillSupport,ot=(i,t)=>i,Pt={toAttribute(i,t){switch(t){case Boolean:i=i?oi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ne=(i,t)=>!Xr(i,t),je={attribute:!0,type:String,converter:Pt,reflect:!1,useDefault:!1,hasChanged:ne};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),P.litPropertyMetadata??(P.litPropertyMetadata=new WeakMap);let F=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=je){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ti(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=ei(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const c=r==null?void 0:r.call(this);o==null||o.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??je}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const t=ii(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const e=this.properties,s=[...si(e),...ri(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Me(r))}else t!==void 0&&e.push(Me(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Pt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var o,n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const c=s.getPropertyOptions(r),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((o=c.converter)==null?void 0:o.fromAttribute)!==void 0?c.converter:Pt;this._$Em=r,this[r]=a.fromAttribute(e,c.type)??((n=this._$Ej)==null?void 0:n.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const o=this.constructor,n=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??ne)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r){const{wrapped:c}=n,a=this[o];c!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[ot("elementProperties")]=new Map,F[ot("finalized")]=new Map,Dt==null||Dt({ReactiveElement:F}),(P.reactiveElementVersions??(P.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=globalThis,Ct=nt.trustedTypes,Le=Ct?Ct.createPolicy("lit-html",{createHTML:i=>i}):void 0,As="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Es="?"+k,ni=`<${Es}>`,I=document,ht=()=>I.createComment(""),ut=i=>i===null||typeof i!="object"&&typeof i!="function",ae=Array.isArray,ai=i=>ae(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",qt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,He=/-->/g,Ie=/>/g,R=RegExp(`>|${qt}(?:([^\\s"'>=/]+)(${qt}*=${qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ze=/'/g,De=/"/g,Ss=/^(?:script|style|textarea|title)$/i,ci=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),E=ci(1),Z=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),qe=new WeakMap,M=I.createTreeWalker(I,129);function xs(i,t){if(!ae(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Le!==void 0?Le.createHTML(t):t}const li=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=st;for(let c=0;c<e;c++){const a=i[c];let d,f,u=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===st?f[1]==="!--"?n=He:f[1]!==void 0?n=Ie:f[2]!==void 0?(Ss.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=R):f[3]!==void 0&&(n=R):n===R?f[0]===">"?(n=r??st,u=-1):f[1]===void 0?u=-2:(u=n.lastIndex-f[2].length,d=f[1],n=f[3]===void 0?R:f[3]==='"'?De:ze):n===De||n===ze?n=R:n===He||n===Ie?n=st:(n=R,r=void 0);const h=n===R&&i[c+1].startsWith("/>")?" ":"";o+=n===st?a+ni:u>=0?(s.push(d),a.slice(0,u)+As+a.slice(u)+k+h):a+k+(u===-2?c:h)}return[xs(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class dt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[d,f]=li(t,e);if(this.el=dt.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=M.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(As)){const l=f[n++],h=r.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?ui:p[1]==="?"?di:p[1]==="@"?pi:Ut}),r.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:o}),r.removeAttribute(u));if(Ss.test(r.tagName)){const u=r.textContent.split(k),l=u.length-1;if(l>0){r.textContent=Ct?Ct.emptyScript:"";for(let h=0;h<l;h++)r.append(u[h],ht()),M.nextNode(),a.push({type:2,index:++o});r.append(u[l],ht())}}}else if(r.nodeType===8)if(r.data===Es)a.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:o}),u+=k.length-1}o++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}}function Q(i,t,e=i,s){var n,c;if(t===Z)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=ut(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((c=r==null?void 0:r._$AO)==null||c.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=Q(i,r._$AS(i,t.values),r,s)),t}class hi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);M.currentNode=r;let o=M.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new yt(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new fi(o,this,t)),this._$AV.push(d),a=s[++c]}n!==(a==null?void 0:a.index)&&(o=M.nextNode(),n++)}return M.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class yt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),ut(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ai(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=dt.createElement(xs(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(e);else{const n=new hi(r,this),c=n.u(this.options);n.p(e),this.T(c),this._$AH=n}}_$AC(t){let e=qe.get(t.strings);return e===void 0&&qe.set(t.strings,e=new dt(t)),e}k(t){ae(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new yt(this.O(ht()),this.O(ht()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ut{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=Q(this,t,e,0),n=!ut(t)||t!==this._$AH&&t!==Z,n&&(this._$AH=t);else{const c=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=Q(this,c[s+a],e,a),d===Z&&(d=this._$AH[a]),n||(n=!ut(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ui extends Ut{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class di extends Ut{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class pi extends Ut{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??b)===Z)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class fi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const Vt=nt.litHtmlPolyfillSupport;Vt==null||Vt(dt,yt),(nt.litHtmlVersions??(nt.litHtmlVersions=[])).push("3.3.0");const mi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new yt(t.insertBefore(ht(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis;class L extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=mi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Z}}var Ve;L._$litElement$=!0,L.finalized=!0,(Ve=j.litElementHydrateSupport)==null||Ve.call(j,{LitElement:L});const Bt=j.litElementPolyfillSupport;Bt==null||Bt({LitElement:L});(j.litElementVersions??(j.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gi={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:ne},yi=(i=gi,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(s==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function vi(i){return(t,e)=>typeof e=="object"?yi(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function vt(i){return vi({...i,state:!0,attribute:!1})}var _i=Object.defineProperty,bi=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&_i(t,e,r),r};const ce=class ce extends L{constructor(){super(...arguments),this.isDarkMode=!1}handleDarkModeToggle(){this.isDarkMode=!this.isDarkMode,document.body.classList.toggle("dark",this.isDarkMode)}render(){return E`
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
    `}};ce.styles=oe`
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
  `;let Ot=ce;bi([vt()],Ot.prototype,"isDarkMode");var $i=Object.defineProperty,ks=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&$i(t,e,r),r};const le=class le extends L{constructor(){super(...arguments),this.isLocked=!0,this.errorMessage=""}handlePasswordSubmit(t){t.preventDefault(),t.target.querySelector("#password-input").value==="your-password-here"?(this.isLocked=!1,this.errorMessage=""):this.errorMessage="Incorrect password. Please try again."}render(){return this.isLocked?E`
        <div class="lock-screen">
          <div class="card">
            <div class="icon">🔒</div>
            <p>Enter password<br />to access the site.</p>
            <form @submit=${this.handlePasswordSubmit}>
              <input type="password" id="password-input" placeholder="Password" />
              <button type="submit">Submit</button>
            </form>
            ${this.errorMessage?E`<p class="error">${this.errorMessage}</p>`:""}
          </div>
        </div>
      `:E`
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
    `}};le.styles=oe`
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
  `;let pt=le;ks([vt()],pt.prototype,"isLocked");ks([vt()],pt.prototype,"errorMessage");var wi=Object.defineProperty,Ps=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&wi(t,e,r),r};const he=class he extends L{constructor(){super(...arguments),this.responseMessage="",this.isSubmitting=!1}async handleContactSubmit(t){t.preventDefault(),this.isSubmitting=!0,this.responseMessage="";const e=t.target,s={name:e.querySelector('[name="name"]').value,email:e.querySelector('[name="email"]').value,subject:e.querySelector('[name="subject"]').value,message:e.querySelector('[name="message"]').value};try{(await fetch("http://localhost:3000/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).ok?(this.responseMessage="Message sent! ✅",e.reset()):this.responseMessage="Something went wrong. ❌"}catch(r){this.responseMessage="Error sending message. ❌",console.error(r)}finally{this.isSubmitting=!1}}render(){return E`
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

          ${this.responseMessage?E`
            <p class="response-msg ${this.responseMessage.includes("✅")?"success":"error"}">
              ${this.responseMessage}
            </p>
          `:""}
        </div>
      </main>
    `}};he.styles=oe`
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
      
  `;let ft=he;Ps([vt()],ft.prototype,"responseMessage");Ps([vt()],ft.prototype,"isSubmitting");const Ai=[{path:"/app/project/:slug",view:i=>E`
        <project-view project-slug=${i.slug}></project-view>
      `},{path:"/app/about",view:()=>E`
        <about-view></about-view>
      `},{path:"/app/contact",view:()=>E`
        <contact-view></contact-view>
      `},{path:"/app",view:()=>E`
        <home-view></home-view>
      `},{path:"/",redirect:"/app"}];Yr({"mu-auth":Ys.Provider,"mu-history":Qs.Provider,"portfolio-header":Ot,"home-view":pt,"contact-view":ft,"mu-switch":class extends Vr.Element{constructor(){super(Ai,"app:history","app:auth")}}});
