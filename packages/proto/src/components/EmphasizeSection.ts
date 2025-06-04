import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class EmpathizeSectionElement extends LitElement {
    @property({ type: String }) heading = '';
    @property({ type: String }) paragraph = '';
  static styles = css`
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
  `;

  render() {
    return html`
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
    `;
  }
}

customElements.define('empathize-section', EmpathizeSectionElement);

