(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var B,Se;class at extends Error{}at.prototype.name="InvalidTokenError";function Fs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function Bs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Fs(t)}catch{return atob(t)}}function es(r,t){if(typeof r!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=r.split(".")[e];if(typeof i!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let s;try{s=Bs(i)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Gs="mu:context",Xt=`${Gs}:change`;class Ws{constructor(t,e){this._proxy=Ys(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ss extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ws(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Ys(r,t){return new Proxy(r,{get:(i,s,n)=>{if(s==="then")return;const o=Reflect.get(i,s,n);return console.log(`Context['${s}'] => `,o),o},set:(i,s,n,o)=>{const l=r[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(i,s,n,o);if(a){let d=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function Ks(r,t){const e=is(t,r);return new Promise((i,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function is(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return is(r,s.host)}class Js extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function rs(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Js(e,r))}class ie{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Xs(r){return t=>({...t,...r})}const Qt="mu:auth:jwt",ns=class os extends ie{constructor(t,e){super((i,s)=>this.update(i,s),t,os.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:s}=t[1];return e(Zs(i)),Bt(s);case"auth/signout":return e(ti()),Bt(this._redirectForLogin);case"auth/redirect":return Bt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ns.EVENT_TYPE="auth:message";let as=ns;const ls=rs(as.EVENT_TYPE);function Bt(r,t={}){if(!r)return;const e=window.location.href,i=new URL(r,e);return Object.entries(t).forEach(([s,n])=>i.searchParams.set(s,n)),()=>{console.log("Redirecting to ",r),window.location.assign(i)}}class Qs extends ss{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=J.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new as(this.context,this.redirect).attach(this)}}class ut{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Qt),t}}class J extends ut{constructor(t){super();const e=es(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(Qt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Qt);return t?J.authenticate(t):new ut}}function Zs(r){return Xs({user:J.authenticate(r),token:r})}function ti(){return r=>{const t=r.user;return{user:t&&t.authenticated?ut.deauthenticate(t):t,token:""}}}function ei(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function si(r){return r.authenticated?es(r.token||""):{}}const ii=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:Qs,User:ut,dispatch:ls,headers:ei,payload:si},Symbol.toStringTag,{value:"Module"}));function Zt(r,t,e){const i=r.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,s),i.dispatchEvent(s),r.stopPropagation()}function xe(r,t="*"){return r.composedPath().find(i=>{const s=i;return s.tagName&&s.matches(t)})}function cs(r,...t){const e=r.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let i=new CSSStyleSheet;return i.replaceSync(e),i}const ri=new DOMParser;function j(r,...t){const e=t.map(l),i=r.map((a,d)=>{if(d===0)return[a];const m=e[d-1];return m instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[m,a]}).flat().join(""),s=ri.parseFromString(i,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const m=o.querySelector(`ins#mu-html-${d}`);if(m){const u=m.parentNode;u==null||u.replaceChild(a,m)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return ke(a);case"bigint":case"boolean":case"number":case"symbol":return ke(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const m=new DocumentFragment,u=a.map(l);return m.replaceChildren(...u),m}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ke(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Mt(r,t={mode:"open"}){const e=r.attachShadow(t),i={template:s,styles:n};return i;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),i}function n(...o){e.adoptedStyleSheets=o}}B=class extends HTMLElement{constructor(){super(),this._state={},Mt(this).template(B.template).styles(B.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,i=t.value;e&&(this._state[e]=i)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Zt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},ni(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},B.template=j`
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
  `,B.styles=cs`
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
  `;function ni(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return r}const hs=class us extends ie{constructor(t){super((e,i)=>this.update(e,i),t,us.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];e(ai(i,s));break}case"history/redirect":{const{href:i,state:s}=t[1];e(li(i,s));break}}}};hs.EVENT_TYPE="history:message";let re=hs;class Pe extends ss{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=oi(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ne(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new re(this.context).attach(this)}}function oi(r){const t=r.currentTarget,e=i=>i.tagName=="A"&&i.href;if(r.button===0)if(r.composed){const s=r.composedPath().find(e);return s||void 0}else{for(let i=r.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function ai(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function li(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ne=rs(re.EVENT_TYPE),ci=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Pe,Provider:Pe,Service:re,dispatch:ne},Symbol.toStringTag,{value:"Module"}));class xt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new Te(this._provider,t);this._effects.push(s),e(s)}else Ks(this._target,this._contextLabel).then(s=>{const n=new Te(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Te{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ds=class ps extends HTMLElement{constructor(){super(),this._state={},this._user=new ut,this._authObserver=new xt(this,"blazing:auth"),Mt(this).template(ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;hi(s,this._state,e,this.authorization).then(n=>it(n,this)).then(n=>{const o=`mu-rest-form:${i}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[i]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},it(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ce(this.src,this.authorization).then(e=>{this._state=e,it(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Ce(this.src,this.authorization).then(s=>{this._state=s,it(s,this)});break;case"new":i&&(this._state={},it({},this));break}}};ds.observedAttributes=["src","new","action"];ds.template=j`
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
  `;function Ce(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function it(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return r}function hi(r,t,e="PUT",i={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const ui=class ms extends ie{constructor(t,e){super(e,t,ms.EVENT_TYPE,!1)}};ui.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,oe=Et.ShadowRoot&&(Et.ShadyCSS===void 0||Et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),Oe=new WeakMap;let gs=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(oe&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Oe.set(e,t))}return t}toString(){return this.cssText}};const di=r=>new gs(typeof r=="string"?r:r+"",void 0,ae),pi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new gs(e,r,ae)},mi=(r,t)=>{if(oe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=Et.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Re=oe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return di(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gi,defineProperty:fi,getOwnPropertyDescriptor:yi,getOwnPropertyNames:vi,getOwnPropertySymbols:_i,getPrototypeOf:bi}=Object,X=globalThis,Ne=X.trustedTypes,$i=Ne?Ne.emptyScript:"",Ie=X.reactiveElementPolyfillSupport,lt=(r,t)=>r,kt={toAttribute(r,t){switch(t){case Boolean:r=r?$i:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},le=(r,t)=>!gi(r,t),Ue={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:le};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ue){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&fi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=yi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ue}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=bi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,i=[...vi(e),..._i(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(Re(s))}else t!==void 0&&e.push(Re(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:kt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)==null?void 0:i.fromAttribute)!==void 0?o.converter:kt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??le)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[lt("elementProperties")]=new Map,W[lt("finalized")]=new Map,Ie==null||Ie({ReactiveElement:W}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,Tt=Pt.trustedTypes,Me=Tt?Tt.createPolicy("lit-html",{createHTML:r=>r}):void 0,fs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,ys="?"+P,wi=`<${ys}>`,z=document,dt=()=>z.createComment(""),pt=r=>r===null||typeof r!="object"&&typeof r!="function",ce=Array.isArray,Ai=r=>ce(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,je=/>/g,I=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),He=/'/g,ze=/"/g,vs=/^(?:script|style|textarea|title)$/i,Ei=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),nt=Ei(1),Q=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),De=new WeakMap,M=z.createTreeWalker(z,129);function _s(r,t){if(!ce(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Me!==void 0?Me.createHTML(t):t}const Si=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=r[l];let d,m,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,m=o.exec(a),m!==null);)c=o.lastIndex,o===rt?m[1]==="!--"?o=Le:m[1]!==void 0?o=je:m[2]!==void 0?(vs.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=I):m[3]!==void 0&&(o=I):o===I?m[0]===">"?(o=s??rt,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?I:m[3]==='"'?ze:He):o===ze||o===He?o=I:o===Le||o===je?o=rt:(o=I,s=void 0);const h=o===I&&r[l+1].startsWith("/>")?" ":"";n+=o===rt?a+wi:u>=0?(i.push(d),a.slice(0,u)+fs+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[_s(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};let te=class bs{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,m]=Si(t,e);if(this.el=bs.createElement(d,i),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=M.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(fs)){const c=m[o++],h=s.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?ki:p[1]==="?"?Pi:p[1]==="@"?Ti:Lt}),s.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(vs.test(s.tagName)){const u=s.textContent.split(P),c=u.length-1;if(c>0){s.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],dt()),M.nextNode(),a.push({type:2,index:++n});s.append(u[c],dt())}}}else if(s.nodeType===8)if(s.data===ys)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}};function Z(r,t,e=r,i){var s,n;if(t===Q)return t;let o=i!==void 0?(s=e.o)==null?void 0:s[i]:e.l;const l=pt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,i)),i!==void 0?(e.o??(e.o=[]))[i]=o:e.l=o),o!==void 0&&(t=Z(r,o._$AS(r,t.values),o,i)),t}class xi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??z).importNode(e,!0);M.currentNode=s;let n=M.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new vt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ci(n,this,t)),this._$AV.push(d),a=i[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class vt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,i,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),pt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ai(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=te.createElement(_s(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(i);else{const o=new xi(n,this),l=o.u(this.options);o.p(i),this.T(l),this._$AH=o}}_$AC(t){let e=De.get(t.strings);return e===void 0&&De.set(t.strings,e=new te(t)),e}k(t){ce(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new vt(this.O(dt()),this.O(dt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!pt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Z(this,l[i+a],e,a),d===Q&&(d=this._$AH[a]),o||(o=!pt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ki extends Lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Pi extends Lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Ti extends Lt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??_)===Q)return;const i=this._$AH,s=t===_&&i!==_||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==_&&(i===_||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ci{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const qe=Pt.litHtmlPolyfillSupport;qe==null||qe(te,vt),(Pt.litHtmlVersions??(Pt.litHtmlVersions=[])).push("3.2.0");const Oi=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new vt(t.insertBefore(dt(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let K=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Q}};K._$litElement$=!0,K.finalized=!0,(Se=globalThis.litElementHydrateSupport)==null||Se.call(globalThis,{LitElement:K});const Ve=globalThis.litElementPolyfillSupport;Ve==null||Ve({LitElement:K});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ri={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:le},Ni=(r=Ri,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function $s(r){return(t,e)=>typeof e=="object"?Ni(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ws(r){return $s({...r,state:!0,attribute:!1})}function Ii(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Ui(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var As={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},i=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,f,g,y,zt){var A=y.length-1;switch(g){case 1:return new f.Root({},[y[A-1]]);case 2:return new f.Root({},[new f.Literal({value:""})]);case 3:this.$=new f.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new f.Literal({value:y[A]});break;case 7:this.$=new f.Splat({name:y[A]});break;case 8:this.$=new f.Param({name:y[A]});break;case 9:this.$=new f.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(f,g){this.message=f,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],f=[null],g=[],y=this.table,zt="",A=0,we=0,zs=2,Ae=1,Ds=g.slice.call(arguments,1),v=Object.create(this.lexer),R={yy:{}};for(var Dt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Dt)&&(R.yy[Dt]=this.yy[Dt]);v.setInput(c,R.yy),R.yy.lexer=v,R.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var qt=v.yylloc;g.push(qt);var qs=v.options&&v.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Vs=function(){var F;return F=v.lex()||Ae,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,N,E,Vt,V={},wt,k,Ee,At;;){if(N=p[p.length-1],this.defaultActions[N]?E=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Vs()),E=y[N]&&y[N][w]),typeof E>"u"||!E.length||!E[0]){var Ft="";At=[];for(wt in y[N])this.terminals_[wt]&&wt>zs&&At.push("'"+this.terminals_[wt]+"'");v.showPosition?Ft="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+At.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ft="Parse error on line "+(A+1)+": Unexpected "+(w==Ae?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ft,{text:v.match,token:this.terminals_[w]||w,line:v.yylineno,loc:qt,expected:At})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(E[0]){case 1:p.push(w),f.push(v.yytext),g.push(v.yylloc),p.push(E[1]),w=null,we=v.yyleng,zt=v.yytext,A=v.yylineno,qt=v.yylloc;break;case 2:if(k=this.productions_[E[1]][1],V.$=f[f.length-k],V._$={first_line:g[g.length-(k||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(k||1)].first_column,last_column:g[g.length-1].last_column},qs&&(V._$.range=[g[g.length-(k||1)].range[0],g[g.length-1].range[1]]),Vt=this.performAction.apply(V,[zt,we,A,R.yy,E[1],f,g].concat(Ds)),typeof Vt<"u")return Vt;k&&(p=p.slice(0,-1*k*2),f=f.slice(0,-1*k),g=g.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),f.push(V.$),g.push(V._$),Ee=y[p[p.length-2]][p[p.length-1]],p.push(Ee);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===f.length?this.yylloc.first_column:0)+f[f.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,f,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),f=c[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,f;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,f=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[f]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,f,g){switch(f){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function m(){this.yy={}}return m.prototype=a,a.Parser=m,new m}();typeof Ui<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(As);function G(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Es={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ss=As.parser;Ss.yy=Es;var Mi=Ss,Li=Object.keys(Es);function ji(r){return Li.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var xs=ji,Hi=xs,zi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function ks(r){this.captures=r.captures,this.re=r.re}ks.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var Di=Hi({Concat:function(r){return r.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(zi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new ks({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),qi=Di,Vi=xs,Fi=Vi({Concat:function(r,t){var e=r.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Bi=Fi,Gi=Mi,Wi=qi,Yi=Bi;_t.prototype=Object.create(null);_t.prototype.match=function(r){var t=Wi.visit(this.ast),e=t.match(r);return e||!1};_t.prototype.reverse=function(r){return Yi.visit(this.ast,r)};function _t(r){var t;if(this?t=this:t=Object.create(_t.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Gi.parse(r),t}var Ki=_t,Ji=Ki,Xi=Ji;const Qi=Ii(Xi);var Zi=Object.defineProperty,Ps=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Zi(t,e,s),s};const Ts=class extends K{constructor(t,e,i=""){super(),this._cases=[],this._fallback=()=>nt` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new Qi(s.path)})),this._historyObserver=new xt(this,e),this._authObserver=new xt(this,i)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),nt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ls(this,"auth/redirect"),nt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):nt` <h1>Authenticating</h1> `;if("redirect"in e){const i=e.redirect;if(typeof i=="string")return this.redirect(i),nt` <h1>Redirecting to ${i}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),n=i+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:i,params:l,query:s}}}redirect(t){ne(this,"history/redirect",{href:t})}};Ts.styles=pi`
    :host,
    main {
      display: contents;
    }
  `;let Ct=Ts;Ps([ws()],Ct.prototype,"_user");Ps([ws()],Ct.prototype,"_match");const tr=Object.freeze(Object.defineProperty({__proto__:null,Element:Ct,Switch:Ct},Symbol.toStringTag,{value:"Module"})),er=class Cs extends HTMLElement{constructor(){if(super(),Mt(this).template(Cs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};er.template=j`
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
  `;const Os=class ee extends HTMLElement{constructor(){super(),this._array=[],Mt(this).template(ee.template).styles(ee.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Rs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{xe(t,"button.add")?Zt(t,"input-array:add"):xe(t,"button.remove")&&Zt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],sr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};Os.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Os.styles=cs`
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
  `;function sr(r,t){t.replaceChildren(),r.forEach((e,i)=>t.append(Rs(e)))}function Rs(r,t){const e=r===void 0?j`<input />`:j`<input value="${r}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ir(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var rr=Object.defineProperty,nr=Object.getOwnPropertyDescriptor,or=(r,t,e,i)=>{for(var s=nr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&rr(t,e,s),s};class Ns extends K{constructor(t){super(),this._pending=[],this._observer=new xt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}or([$s()],Ns.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,he=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ue=Symbol(),Fe=new WeakMap;let Is=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ue)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(he&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Fe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Fe.set(e,t))}return t}toString(){return this.cssText}};const ar=r=>new Is(typeof r=="string"?r:r+"",void 0,ue),q=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new Is(e,r,ue)},lr=(r,t)=>{if(he)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=St.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Be=he?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return ar(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cr,defineProperty:hr,getOwnPropertyDescriptor:ur,getOwnPropertyNames:dr,getOwnPropertySymbols:pr,getPrototypeOf:mr}=Object,C=globalThis,Ge=C.trustedTypes,gr=Ge?Ge.emptyScript:"",Wt=C.reactiveElementPolyfillSupport,ct=(r,t)=>r,Ot={toAttribute(r,t){switch(t){case Boolean:r=r?gr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},de=(r,t)=>!cr(r,t),We={attribute:!0,type:String,converter:Ot,reflect:!1,useDefault:!1,hasChanged:de};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=We){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&hr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=ur(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??We}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=mr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,i=[...dr(e),...pr(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(Be(s))}else t!==void 0&&e.push(Be(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){var n;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const o=(((n=i.converter)==null?void 0:n.toAttribute)!==void 0?i.converter:Ot).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n,o;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const l=i.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Ot;this._$Em=s,this[s]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(t,e,i){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(i??(i=n.getPropertyOptions(t)),!((i.hasChanged??de)(o,e)||i.useDefault&&i.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ct("elementProperties")]=new Map,Y[ct("finalized")]=new Map,Wt==null||Wt({ReactiveElement:Y}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,Rt=ht.trustedTypes,Ye=Rt?Rt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Us="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ms="?"+T,fr=`<${Ms}>`,D=document,mt=()=>D.createComment(""),gt=r=>r===null||typeof r!="object"&&typeof r!="function",pe=Array.isArray,yr=r=>pe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Je=/>/g,U=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,Qe=/"/g,Ls=/^(?:script|style|textarea|title)$/i,vr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),$=vr(1),tt=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ze=new WeakMap,L=D.createTreeWalker(D,129);function js(r,t){if(!pe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}const _r=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=r[l];let d,m,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,m=o.exec(a),m!==null);)c=o.lastIndex,o===ot?m[1]==="!--"?o=Ke:m[1]!==void 0?o=Je:m[2]!==void 0?(Ls.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=U):m[3]!==void 0&&(o=U):o===U?m[0]===">"?(o=s??ot,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?U:m[3]==='"'?Qe:Xe):o===Qe||o===Xe?o=U:o===Ke||o===Je?o=ot:(o=U,s=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===ot?a+fr:u>=0?(i.push(d),a.slice(0,u)+Us+a.slice(u)+T+h):a+T+(u===-2?l:h)}return[js(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class ft{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,m]=_r(t,e);if(this.el=ft.createElement(d,i),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=L.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Us)){const c=m[o++],h=s.getAttribute(u).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?$r:p[1]==="?"?wr:p[1]==="@"?Ar:jt}),s.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Ls.test(s.tagName)){const u=s.textContent.split(T),c=u.length-1;if(c>0){s.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],mt()),L.nextNode(),a.push({type:2,index:++n});s.append(u[c],mt())}}}else if(s.nodeType===8)if(s.data===Ms)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(t,e){const i=D.createElement("template");return i.innerHTML=t,i}}function et(r,t,e=r,i){var o,l;if(t===tt)return t;let s=i!==void 0?(o=e._$Co)==null?void 0:o[i]:e._$Cl;const n=gt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=et(r,s._$AS(r,t.values),s,i)),t}class br{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??D).importNode(e,!0);L.currentNode=s;let n=L.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new bt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Er(n,this,t)),this._$AV.push(d),a=i[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=D,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),gt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ft.createElement(js(i.h,i.h[0]),this.options)),i);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new br(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ze.get(t.strings);return e===void 0&&Ze.set(t.strings,e=new ft(t)),e}k(t){pe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new bt(this.O(mt()),this.O(mt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class jt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=b}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=et(this,l[i+a],e,a),d===tt&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class $r extends jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class wr extends jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ar extends jt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??b)===tt)return;const i=this._$AH,s=t===b&&i!==b||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==b&&(i===b||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Er{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Kt=ht.litHtmlPolyfillSupport;Kt==null||Kt(ft,bt),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.3.0");const Sr=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new bt(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis;class S extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Sr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}}var ts;S._$litElement$=!0,S.finalized=!0,(ts=H.litElementHydrateSupport)==null||ts.call(H,{LitElement:S});const Jt=H.litElementPolyfillSupport;Jt==null||Jt({LitElement:S});(H.litElementVersions??(H.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xr={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:de},kr=(r=xr,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function x(r){return(t,e)=>typeof e=="object"?kr(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ht(r){return x({...r,state:!0,attribute:!1})}var Pr=Object.defineProperty,Tr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Pr(t,e,s),s};const ge=class ge extends S{constructor(){super(...arguments),this.isDarkMode=!1}handleDarkModeToggle(){this.isDarkMode=!this.isDarkMode,document.body.classList.toggle("dark",this.isDarkMode)}render(){return $`
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
  `;let Nt=ge;Tr([Ht()],Nt.prototype,"isDarkMode");var Cr=Object.defineProperty,Hs=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Cr(t,e,s),s};const fe=class fe extends S{constructor(){super(...arguments),this.isLocked=sessionStorage.getItem("unlocked")!=="true",this.errorMessage=""}handlePasswordSubmit(t){t.preventDefault(),t.target.querySelector("#password-input").value==="open"?(this.isLocked=!1,this.errorMessage="",sessionStorage.setItem("unlocked","true")):this.errorMessage="Incorrect password. Please try again."}render(){return this.isLocked?$`
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
  `;let yt=fe;Hs([Ht()],yt.prototype,"isLocked");Hs([Ht()],yt.prototype,"errorMessage");var Or=Object.defineProperty,me=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Or(t,e,s),s};const ye=class ye extends S{constructor(){super(...arguments),this.heading="",this.subheading="",this.paragraph=""}render(){return $`
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
  `;let st=ye;me([x({type:String})],st.prototype,"heading");me([x({type:String})],st.prototype,"subheading");me([x({type:String})],st.prototype,"paragraph");customElements.define("empathize-section",st);var Rr=Object.defineProperty,$t=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Rr(t,e,s),s};const ve=class ve extends S{constructor(){super(...arguments),this.heading="",this.subheading="",this.paragraph="",this.imgSrc="",this.imgAlt=""}render(){return $`
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
  `;let O=ve;$t([x({type:String})],O.prototype,"heading");$t([x({type:String})],O.prototype,"subheading");$t([x({type:String})],O.prototype,"paragraph");$t([x({type:String})],O.prototype,"imgSrc");$t([x({type:String})],O.prototype,"imgAlt");customElements.define("empathize-section-image",O);const _e=class _e extends S{render(){return $`
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
        `}};_e.styles=q`
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
          
      `;let se=_e;var Nr=Object.defineProperty,Ir=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Nr(t,e,s),s};const be=class be extends Ns{constructor(){super("app:model"),this.isSubmitting=!1}get status(){return this.model.contactSubmissionStatus}async handleContactSubmit(t){t.preventDefault(),this.isSubmitting=!0,this.dispatchMessage(["contact/status",{status:""}]);const e=t.target,i={name:e.querySelector('[name="name"]').value,email:e.querySelector('[name="email"]').value,subject:e.querySelector('[name="subject"]').value,message:e.querySelector('[name="message"]').value};this.dispatchMessage(["contact/submit",{contact:i}]),setTimeout(()=>{this.isSubmitting=!1},1e3),e.reset()}render(){return $`
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
            <input name="name" placeholder="Your name" required ?disabled=${this.isSubmitting} />
            <input name="email" placeholder="Your email" required ?disabled=${this.isSubmitting} />
            <input name="subject" placeholder="Subject" required ?disabled=${this.isSubmitting} />
            <textarea name="message" placeholder="Your message" rows="6" required ?disabled=${this.isSubmitting}></textarea>
            <button type="submit" ?disabled=${this.isSubmitting}>
              ${this.isSubmitting?"Sending...":"Send"}
            </button>
          </form>

          ${this.status?$`
            <p class="response-msg ${this.status==="success"?"success":"error"}">
              ${this.status==="success"?"Message sent! ✅":"Something went wrong. ❌"}
            </p>
          `:""}
        </div>
      </main>
    `}};be.styles=q`/* (use your existing styles here) */`;let It=be;Ir([Ht()],It.prototype,"isSubmitting");var Ur=Object.defineProperty,Mr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Ur(t,e,s),s};const $e=class $e extends S{constructor(){super(...arguments),this.slug=""}render(){switch(this.slug){case"paloaltonetworks":return $`
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
  `;let Ut=$e;Mr([x({attribute:"project-slug"})],Ut.prototype,"slug");const Lr=[{path:"/app/project/:slug",view:r=>$`
        <project-view project-slug=${r.slug}></project-view>
      `},{path:"/app/about",view:()=>$`
        <about-view></about-view>
      `},{path:"/app/contact",view:()=>$`
        <contact-view></contact-view>
      `},{path:"/app",view:()=>$`
        <home-view></home-view>
      `},{path:"/",redirect:"/app"},{path:"/app/contact",view:()=>$`<contact-view></contact-view>`}];ir({"mu-auth":ii.Provider,"mu-history":ci.Provider,"portfolio-header":Nt,"home-view":yt,"about-view":se,"contact-view":It,"project-view":Ut,"mu-switch":class extends tr.Element{constructor(){super(Lr,"app:history","app:auth")}}});
