import { LitElement, html, css } from 'lit';
import { getLocale, setLocaleFromUrl } from './localization.js';
import { allLocales } from './generated/locale-codes.js';
import { updateWhenLocaleChanges } from '@lit/localize';

const localeNames = {
  en: 'English',
  'tr-TR': 'Türkçe',
};

const localeFlags = {
  en: 'assets/en.jpg',
  'tr-TR': 'assets/tr.jpg',
};

export class LocalePicker extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
      font-family: sans-serif;
    }

    .picker {
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .picker:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .flag {
      width: 20px;
      height: 14px;
      object-fit: cover;
      border-radius: 2px;
      margin-right: 6px;
    }

    .menu {
      position: absolute;
      top: calc(100% + 4px);
      left: -6px; /* biraz sola aldık */
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      min-width: max-content;
      animation: fadeIn 0.15s ease;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .menu-item:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .menu-item img {
      width: 20px;
      height: 14px;
      border-radius: 2px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  static properties = {
    open: { type: Boolean },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.open = false;
    
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('bb');
    
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (!this.contains(e.target)) {
        
      this.open = false;
    }
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.open = !this.open;
  }

  localeChanged(locale) {
    if (locale !== getLocale()) {
      const url = new URL(window.location.href);
      url.searchParams.set('locale', locale);
      window.history.pushState(null, '', url.toString());
      setLocaleFromUrl();
    }
    this.open = false;
  }

  render() {
    const current = getLocale();
    
    return html`
      <button class="picker" @click=${this.toggleMenu}>
        <img src=${localeFlags[current]} alt="" class="flag" />
      </button>

      ${this.open
        ? html`
            <div class="menu">
              ${allLocales.map(
                (locale) => html`
                  <div class="menu-item" @click=${() => this.localeChanged(locale)}>
                    <img src=${localeFlags[locale]} alt=${locale} />
                  </div>
                `
              )}
            </div>
          `
        : null}
    `;
  }
}

customElements.define('locale-picker', LocalePicker);
