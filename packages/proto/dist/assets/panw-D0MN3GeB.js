import{i as p,a as h,x as c,n as s}from"./property-CwQAhMXo.js";/* empty css             */var f=Object.defineProperty,u=(o,a,l,b)=>{for(var r=void 0,e=o.length-1,n;e>=0;e--)(n=o[e])&&(r=n(a,l,r)||r);return r&&f(a,l,r),r};const g=class g extends p{constructor(){super(...arguments),this.heading="",this.paragraph=""}render(){return c`
      <section class="block">
        <h6>Empathize</h6>
        <ul class="grid text-d-banner">
          <li class="column-6">
            <h2>${this.heading}</h2>
          </li>
          <li class="column-6">
            <p>${this.paragraph}</p>
          </li>
        </ul>
      </section>
    `}};g.styles=h`
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
  `;let t=g;u([s({type:String})],t.prototype,"heading");u([s({type:String})],t.prototype,"paragraph");customElements.define("empathize-section",t);customElements.define("empathize-section",t);var v=Object.defineProperty,d=(o,a,l,b)=>{for(var r=void 0,e=o.length-1,n;e>=0;e--)(n=o[e])&&(r=n(a,l,r)||r);return r&&v(a,l,r),r};const m=class m extends p{constructor(){super(...arguments),this.heading="",this.subheading="",this.paragraph="",this.imgSrc="",this.imgAlt=""}render(){return c`
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
              ${this.imgSrc?c`<img src=${this.imgSrc} alt=${this.imgAlt} />`:null}
            </div>
          </figure>
        </article>
      </section>
    `}};m.styles=h`
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
  `;let i=m;d([s({type:String})],i.prototype,"heading");d([s({type:String})],i.prototype,"subheading");d([s({type:String})],i.prototype,"paragraph");d([s({type:String})],i.prototype,"imgSrc");d([s({type:String})],i.prototype,"imgAlt");customElements.define("empathize-section-image",i);customElements.define("empathize-section-image",i);
