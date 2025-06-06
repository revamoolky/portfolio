import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

class HomeViewElement extends LitElement {
  @state()
  isLocked = true;

  @state()
  errorMessage = "";

  handlePasswordSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const password = (form.querySelector('#password-input') as HTMLInputElement).value;
    
    // Replace with your actual password
    if (password === "your-password-here") {
      this.isLocked = false;
      this.errorMessage = "";
    } else {
      this.errorMessage = "Incorrect password. Please try again.";
    }
  }

  render() {
    if (this.isLocked) {
      return html`
        <div class="lock-screen">
          <div class="card">
            <div class="icon">🔒</div>
            <p>Enter password<br />to access the site.</p>
            <form @submit=${this.handlePasswordSubmit}>
              <input type="password" id="password-input" placeholder="Password" />
              <button type="submit">Submit</button>
            </form>
            ${this.errorMessage ? html`<p class="error">${this.errorMessage}</p>` : ''}
          </div>
        </div>
      `;
    }

    return html`
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
    `;
  }

  static styles = css`
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
  `;
}

export { HomeViewElement };