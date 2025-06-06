import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class EmpathizeSectionImageElement extends LitElement {
    @property({ type: String }) heading = '';
    @property({ type: String }) subheading = '';
    @property({ type: String }) paragraph = '';
    @property({ type: String }) imgSrc = '';
    @property({ type: String }) imgAlt = '';

  static styles = css`
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
  `;

  render() {
    return html`
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
              ${this.imgSrc
                ? html`<img src=${this.imgSrc} alt=${this.imgAlt} />`
                : null}
            </div>
          </figure>
        </article>
      </section>
    `;
  }
  
}

customElements.define('empathize-section-image', EmpathizeSectionImageElement);

