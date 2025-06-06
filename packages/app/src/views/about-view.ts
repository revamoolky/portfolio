import { LitElement, html, css } from 'lit';
import "../components/empathize-section.ts";
import "../components/empathize-section-image.ts";


export class AboutViewElement extends LitElement {
    render() {
        return html`
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
        `;
      }
    
      static styles = css`
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
          
      `;
    
    }
