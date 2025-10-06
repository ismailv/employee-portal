import {LitElement, css, html} from 'lit';
import {msg, updateWhenLocaleChanges} from '@lit/localize';

export class Header extends LitElement {
  static properties = {

  };
  static styles = css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        color: #FF6200;
        padding: 12px 24px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      header .left {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #333
      }

      header .left img {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      header .left h1 {
        font-size: 20px;
        font-weight: 600;
      }

      nav {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      nav a {
        color: #FF6200;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.2s;
      }

      nav a:hover {
        opacity: 0.8;
      }

      select {
        background: white;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 14px;
        cursor: pointer;
      }

      main {
        padding: 20px;
        max-width: 900px;
        margin: 0 auto;
      }

      .employee-icon {
        background-image: url('./assets/employee.png');
        width: 25px;
        height: 25px;
        display: block;
        background-size: contain;
      }

      .header-container{
        display: flex;
      }
      
 

      @media (max-width: 600px) {
        header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        nav {
          flex-wrap: wrap;
          gap: 10px;
        }
      }
  `;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }


  render() {
    return html`
    <header>
        <div class="left">
            <img src="/assets/ing.png" alt="Logo" />
            <h1>ING</h1>
        </div>
        <nav>
            <div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;width: 132px;">
            <a class="employee-icon"></a>
            <a href="/"> ${msg(html`<a>Employee List</a>`, { id: 'employeeList' })}</a>
        </div>
            <a href="#/employee/new" id="addEmployeeBtn">+ ${msg(html`<a>Add Employee</a>`, { id: 'addEmployee' })}</a>

            <locale-picker></locale-picker>
        </nav>
      </header>`;
  }
}
customElements.define('header-lint', Header);