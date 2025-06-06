import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

class HeaderElement extends LitElement {
  @state()
  isDarkMode = false;

  handleDarkModeToggle() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  render() {
    return html`
      <header>
        <nav>
          <a href="/app">Home</a>
          <a href="/app/about">About</a>
          <a href="/app/contact">Contact</a>
        </nav>
        <label class="darkmode-toggle">
          <input 
            type="checkbox" 
            .checked=${this.isDarkMode}
            @change=${this.handleDarkModeToggle}
            autocomplete="off" 
          />
          Dark mode
        </label>
      </header>
    `;
  }

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--color-background);
      border-bottom: 1px solid var(--color-border);
    }
    
    nav {
      display: flex;
      gap: 2rem;
    }
    
    nav a {
      text-decoration: none;
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
      transition: color 0.2s ease;
    }
    
    nav a:hover {
      color: var(--color-primary);
    }
    
    .darkmode-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }
    
    .darkmode-toggle input {
      cursor: pointer;
    }
  `;
}

export { HeaderElement };