import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface UxCaseData {
  imgSrc: string;
  alt: string;
  category: string;
  title: string;
  subtitle: string;
}

@customElement('ux-case-wrapper')
export class UxCaseWrapper extends LitElement {
  @property()
  src?: string;

  @state()
  cases: UxCaseData[] = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) {
      this.hydrate(this.src);
    }
  }

  async hydrate(src: string) {
    try {
      const res = await fetch(src);
      const data = await res.json();
      this.cases = data as UxCaseData[];
    } catch (e) {
      console.error('Failed to load UX case data', e);
    }
  }

  renderUxCaseHeader(c: UxCaseData) {
    return html`
      <ux-case-header 
        img-src=${c.imgSrc}
        alt=${c.alt}
        category=${c.category}
      >
        <h1 slot="title">${c.title}</h1>
        <h2 slot="subtitle">${c.subtitle}</h2>
      </ux-case-header>
    `;
  }

  render() {
    return html`
      ${this.cases.map(this.renderUxCaseHeader)}
    `;
  }
}

