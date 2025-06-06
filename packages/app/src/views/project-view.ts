// src/views/project-paloalto-view.ts
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import "../components/empathize-section.ts";
import "../components/emphasize-section-image.ts";


export class ProjectView extends LitElement {
  @property({ attribute: "project-slug" }) slug = "";

  render() {
    switch (this.slug) {
      case "paloaltonetworks":
        return html`
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
        `;
      }
    }

  static styles = css`
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
  `;
}
