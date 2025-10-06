
import { html, LitElement, render } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './locale-picker.js';
import './components/headers/header.js';
import './components/employee-list.js';
import './components/employee-form.js';
import { seedIfEmpty } from './storage/storage.js';

seedIfEmpty();

class Main extends LitElement {
  static properties = {
    currentView: { type: String },
    selectedId: { type: Number },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.currentView = 'list';
    this.selectedId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.handleRoute.bind(this));
    this.handleRoute();
  }

  handleRoute() {
    const hash = location.hash || '#/';
    if (hash.startsWith('#/employee')) {
      const parts = hash.split('/');
      const id = parts[2] === 'new' ? null : parts[2] || null;
      console.log('id', id);
      
      this.currentView = 'form';
      this.selectedId = id ? id : null;
    } else {
      this.currentView = 'list';
      this.selectedId = null;
    }
  }

  render() {
    return html`
      ${this.currentView === 'list'
        ? html`<employee-list></employee-list>`
        : html`<employee-form employeeId=${this.selectedId}></employee-form>`}
    `;
  }
}

customElements.define('main-lint', Main);

window.appNavigate = (path) => {
  location.hash = path;
};
