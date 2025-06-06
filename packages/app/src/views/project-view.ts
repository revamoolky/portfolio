// src/views/project-paloalto-view.ts
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import "../components/empathize-section.ts";
import "../components/empathize-section-image.ts";


export class ProjectView extends LitElement {
  @property({ attribute: "project-slug" }) slug = "";

  render() {
    switch (this.slug) {
      case "paloaltonetworks":
        return html`
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
        `;
        case "amplitude":
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
  `;
}
