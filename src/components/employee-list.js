import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import {loadEmployees, deleteEmployeeById, getEmployeeById, addOrUpdateEmployee, saveEmployees} from './../storage/storage.js'
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      background-color: #faf9f7;
      color: #333;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    h2 {
      color: #d65a1f;
      font-size: 20px;
      margin: 0;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-toggle button {
      border: none;
      background: none;
      cursor: pointer;
      color: #d65a1f;
      font-size: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
    }

    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid #f0f0f0;
      text-align: left;
    }

    th {
      color: #d65a1f;
      font-weight: 600;
      background-color: #fff7f3;
    }

    tr:hover {
      background-color: #fff4ec;
    }

    button.icon {
      border: none;
      background: none;
      cursor: pointer;
      color: #d65a1f;
      font-size: 16px;
      margin-right: 8px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      margin-top: 16px;
    }

    .pagination button {
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 500;
      color: #d65a1f;
      padding: 6px 10px;
      border-radius: 6px;
    }

    .pagination button.active {
      background-color: #d65a1f;
      color: white;
    }

    .pagination button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 16px;
    }

    .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    }


    .card h4 {
      margin: 0 0 8px 0;
      color: #d65a1f;
    }

    .card small {
      display: block;
      color: #777;
      margin-bottom: 4px;
    }

    .icon-svg{
        width: 20px;
        height: 20px;
        display: block;
        background-size: contain;
        background-repeat: no-repeat;
        margin-top:3px;}

    .dot-btn {
        background-image: url('./assets/dots-grid.svg');
    }
       
    .edit-btn {
        background-image: url('./assets/edit-square.svg');
    }

    .delete-btn {
        background-image: url('./assets/delete.svg');
    }

    .edit-btn-white {
        background-image: url('./assets/edit-square-white.svg');
    }

    .delete-btn-white {
        background-image: url('./assets/delete-white.svg');
    }

    .card-content {
  margin-bottom: 12px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.grid-btn {
    display: flex;
    justify-content: space-around;
    width: 57px;
    align-items: center;
    color: white;
    padding: 6px;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
}

.grid-btn .icon-svg {
    fill: white;
    width: 20px;
    height:20px;
}

.col {
  width: 48%;
}

.label {
  color: #aaa;
  font-size: 13px;
  margin: 0;
}

p {
  margin: 2px 0;
  font-size: 14px;
  color: #222;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 280px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.modal h3 {
  margin-top: 0;
  font-size: 1.2em;
}

.modal p {
  color: #666;
  font-size: 0.9em;
}

.modal button {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.modal .proceed {
  background-color: #ff7043;
  color: white;
}

.modal .cancel {
  background-color: #ddd;
  color: #333;
}


  `;

  static properties = {
    employees: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    viewMode: { type: String },
    showModal: { type: Boolean },
    selectedEmployee: { type: Object },
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.viewMode = 'list';
    this.employees = loadEmployees();
    this.showModal = false;
    this.selectedEmployee = null;
    updateWhenLocaleChanges(this);
  }

  refresh() {
    this.employees = loadEmployees();
    const totalPages = Math.max(1, Math.ceil(this.employees.length / this.itemsPerPage));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    this.requestUpdate();
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.employees || []).slice(start, start + this.itemsPerPage);
  }

  gotoAdd() {
    window.appNavigate('#/employee/new');
  }

  edit(emp) {
    window.appNavigate(`#/employee/${emp.id}`);
  }

  changePage(page) {
    this.currentPage = page;
  }

  changePage(page) {
    this.currentPage = page;
  }

  openDeleteModal(employee) {
    this.selectedEmployee = employee;
    this.showModal = true;
  }
  
  closeDeleteModal() {
    this.showModal = false;
    this.selectedEmployee = null;
  }
  
  confirmDelete() {
    if (this.selectedEmployee) {
      const items =  deleteEmployeeById(this.selectedEmployee.id);
      this.employees = items;
    }
    this.closeDeleteModal();
  }
  
  renderDeleteModal() {
    if (!this.showModal) return null;
    return html`
      <div class="modal-overlay" @click=${this.closeDeleteModal}>
        <div class="modal" @click=${(e) => e.stopPropagation()}>
          <h3>${ msg('Are you sure', { id: 'sureMessage' })}?</h3>
          <p>${ msg('This action will permanently delete this employee', { id: 'deleteWarning' })}.</p>
          <button class="proceed" @click=${this.confirmDelete}>${ msg('Proceed', { id: 'proceed' })}</button>
          <button class="cancel" @click=${this.closeDeleteModal}>${ msg('Cancel', { id: 'cancel' })}</button>
        </div>
      </div>
    `;
  }


  renderPagination() {
    const total = Math.ceil((this.employees || []).length / this.itemsPerPage);
    const pages = Array.from({ length: total }, (_, i) => i + 1);
    return html`
      <div class="pagination">
        <button ?disabled=${this.currentPage === 1} @click=${() => this.changePage(this.currentPage - 1)}>&lt;</button>
        ${pages.map(p => html`<button class=${p === this.currentPage ? 'active' : ''} @click=${() => this.changePage(p)}>${p}</button>`)}
        <button ?disabled=${this.currentPage === total} @click=${() => this.changePage(this.currentPage + 1)}>&gt;</button>
      </div>
    `;
  }

  renderListView() {
    return html`
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>${msg(html`First Name`, { id: 'firstName' })}</th>
            <th>${msg(html`Last Name`, { id: 'lastName' })}</th>
            <th>${msg(html`Date of Employment`, { id: 'dateOfEmployment' })}</th>
            <th>${msg(html`Date of Birth`, { id: 'dateOfEmployment' })}</th>
            <th>${msg(html`Phone`, { id: 'phone' })}</th>
            <th>${msg(html`Email`, { id: 'email' })}</th>
            <th>${msg(html`Department`, { id: 'department' })}</th>
            <th>${msg(html`Position`, { id: 'position' })}</th>
            <th>${msg(html`Actions`, { id: 'actions' })}</th>
          </tr>
        </thead>
        <tbody>
          ${repeat(
            this.paginatedEmployees,
            e => e.id,
            e => html`
              <tr>
                <td><input type="checkbox" /></td>
                <td>${e.firstName}</td>
                <td>${e.lastName}</td>
                <td>${formatDate(e.dateOfEmployment)}</td>
                <td>${formatDate(e.dateOfBirth)}</td>
                <td>${e.phone}</td>
                <td>${e.email}</td>
                <td>${e.department}</td>
                <td>${e.position}</td>
                <td>
                  <button class="icon" @click=${() => this.edit(e)}><span class="edit-btn icon-svg"></span></button>
                  <button class="icon" @click=${() => this.openDeleteModal(e)}><span class="delete-btn icon-svg"></span></button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>

    ${this.renderDeleteModal()}
      ${this.renderPagination()}
    `;
  }

  renderGridView() {
    return html`
      <div class="grid">
        ${repeat(
          this.paginatedEmployees,
          e => e.id,
          e => html`
            <div class="card">
              <div class="card-content">
                <div class="row">
                  <div class="col">
                    <p class="label">${msg(html`First Name`, { id: 'firstName' })}:</p>
                    <p>${e.firstName}</p>
                  </div>
                  <div class="col">
                    <p class="label">${msg(html`Last Name`, { id: 'lastName' })}:</p>
                    <p>${e.lastName}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p class="label">${msg(html`Date of Employment`, { id: 'dateOfEmployment' })}:</p>
                    <p>${formatDate(e.dateOfEmployment)}</p>
                  </div>
                  <div class="col">
                    <p class="label">${msg(html`Date of Birth`, { id: 'dateOfEmployment' })}:</p>
                    <p>${formatDate(e.dateOfBirth)}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p class="label">${msg(html`Phone`, { id: 'phone' })}:</p>
                    <p>${e.phone}</p>
                  </div>
                  <div class="col">
                    <p class="label">${msg(html`Email`, { id: 'email' })}:</p>
                    <p>${e.email}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p class="label">${msg(html`Department`, { id: 'department' })}:</p>
                    <p>${e.department}</p>
                  </div>
                  <div class="col">
                    <p class="label">${msg(html`Position`, { id: 'position' })}:</p>
                    <p>${e.position}</p>
                  </div>
                </div>
              </div>
  
              <div class="actions">
                <div class="grid-btn" style="background-color: #525199;"  @click=${() => this.edit(e)}>
                 <span class="edit-btn-white icon-svg"></span> <span> ${msg(html`Edit`, { id: 'edit' })}</span>
                </div>
                <div class="grid-btn" style="background-color: #ff6200;" @click=${() => this.openDeleteModal(e)}>
                   <span class="delete-btn-white icon-svg"></span> <span> ${msg(html`Delete`, { id: 'delete' })}</span>
                </div>
              </div>
            </div>
          `
        )}
      </div>
      ${this.renderPagination()}
    `;
  }
  
  render() {
    return html`
      <header>
        <h2>${msg(html`<a>Employee List</a>`, { id: 'employeeList' })}</h2>
        <div class="view-toggle">
          <button @click=${() => (this.viewMode = 'list')} title="List view">☰</button>
          <button @click=${() => (this.viewMode = 'grid')} title="Grid view"><span class="dot-btn icon-svg"></span></button>
        </div>
      </header>

      ${this.viewMode === 'list' ? this.renderListView() : this.renderGridView()}
    `;
  }
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) {
      const parts = (iso || '').split('-');
      if (parts.length >= 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return iso;
    }
    return d.toLocaleDateString('en-GB'); 
  }

customElements.define('employee-list', EmployeeList);
