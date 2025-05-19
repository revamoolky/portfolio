import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class UxCaseHeaderElement extends LitElement {
  @property({ type: String }) imgSrc = "";
  @property({ type: String }) alt = "";
  @property({ type: String }) category = "";

  static styles = css`
    section {
      text-align: center;
      padding: 2rem;
    }
    img {
      width: 100%;
      max-width: 600px;
      height: auto;
      border-radius: 1rem;
    }
    h1 {
      font-size: 2rem;
      margin-top: 1rem;
    }
    h2 {
      font-size: 1.25rem;
      color: #666;
    }
    .category {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #999;
    }
  `;

  override render() {
    return html`
      <section class="case-header">
        <img src=${this.imgSrc} alt=${this.alt} />
        <slot name="title"></slot>
        <slot name="subtitle"></slot>
        <p class="category">${this.category}</p>
      </section>
    `;
  }
}
