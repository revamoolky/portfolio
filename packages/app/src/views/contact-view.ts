import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

class ContactViewElement extends LitElement  {
  @state()
  responseMessage = "";

  @state()
  isSubmitting = false;

  async handleContactSubmit(e: Event) {
    e.preventDefault();
    this.isSubmitting = true;
    this.responseMessage = "";

    const form = e.target as HTMLFormElement;
    const formData = {
      name: (form.querySelector('[name="name"]') as HTMLInputElement).value,
      email: (form.querySelector('[name="email"]') as HTMLInputElement).value,
      subject: (form.querySelector('[name="subject"]') as HTMLInputElement).value,
      message: (form.querySelector('[name="message"]') as HTMLTextAreaElement).value,
    };

    try {
      const backendUrl = 'http://localhost:3000'; // Updated to match your server port
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        this.responseMessage = "Message sent! ✅";
        form.reset();
      } else {
        this.responseMessage = "Something went wrong. ❌";
      }
    } catch (err) {
      this.responseMessage = "Error sending message. ❌";
      console.error(err);
    } finally {
      this.isSubmitting = false;
    }
  }

  render() {
    return html`
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
            
            <input 
              type="text" 
              name="name" 
              placeholder="Your name" 
              required 
              ?disabled=${this.isSubmitting}
            />
            
            <input 
              type="email" 
              name="email" 
              placeholder="Your email" 
              required 
              ?disabled=${this.isSubmitting}
            />
            
            <input 
              type="text" 
              name="subject" 
              placeholder="Subject" 
              required 
              ?disabled=${this.isSubmitting}
            />
            
            <textarea 
              name="message" 
              placeholder="Your message" 
              required 
              rows="6"
              ?disabled=${this.isSubmitting}
            ></textarea>
            
            <button 
              type="submit" 
              ?disabled=${this.isSubmitting}
              class=${this.isSubmitting ? 'submitting' : ''}
            >
              ${this.isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>

          ${this.responseMessage ? html`
            <p class="response-msg ${this.responseMessage.includes('✅') ? 'success' : 'error'}">
              ${this.responseMessage}
            </p>
          ` : ''}
        </div>
      </main>
    `;
  }

  static styles = css`
    main {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .contact-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .contact-header h1 {
      font-size: 2.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: 1rem;
    }

    .contact-header h3 {
      font-size: 1.25rem;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .email-link {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .email-link a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
    }

    .email-link a:hover {
      text-decoration: underline;
    }

    .contact-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-block;
      color: var(--color-text-secondary);
      text-decoration: none;
      margin-bottom: 2rem;
      font-size: 1rem;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: var(--color-primary);
    }

    .contact-form {
      background: var(--color-background-card, #fff);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--color-border, #e0e0e0);
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .contact-form input,
    .contact-form textarea {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid var(--color-border, #e0e0e0);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      background: var(--color-background, #fff);
      color: var(--color-text);
      box-sizing: border-box;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 0, 123, 255), 0.1);
    }

    .contact-form input:disabled,
    .contact-form textarea:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .contact-form textarea {
      resize: vertical;
      min-height: 120px;
    }

    .contact-form button {
      width: 100%;
      padding: 1rem 2rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .contact-form button:hover:not(:disabled) {
      background: var(--color-primary-dark, #0056b3);
      transform: translateY(-1px);
    }

    .contact-form button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .contact-form button.submitting {
      background: var(--color-primary-light, #6c9bd1);
    }

    .response-msg {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .response-msg.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .response-msg.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .contact-form {
        background: var(--color-background-card-dark, #2a2a2a);
        border-color: var(--color-border-dark, #404040);
      }

      .contact-form input,
      .contact-form textarea {
        background: var(--color-background-dark, #1a1a1a);
        border-color: var(--color-border-dark, #404040);
        color: var(--color-text-dark, #ffffff);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }

      .contact-header h1 {
        font-size: 2rem;
      }

      .contact-header h3 {
        font-size: 1.1rem;
      }

      .contact-form {
        padding: 1.5rem;
      }
    }
      
  `;

}

export { ContactViewElement };