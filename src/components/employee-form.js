
import { LitElement, html, css } from 'lit';
import { getEmployeeById, addOrUpdateEmployee } from './../storage/storage';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

class EmployeeForm extends LitElement {
    static properties = {
        employeeId: { type: String | null }
      };
  static styles = css`
    .card { background:white; padding:18px; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.06); padding:40px; }
    .header {padding:20px;}
    .grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:18px; }
    label { display:block; color:#666; font-size:13px; margin-bottom:6px; }
    input, select { width:93%; padding:10px 12px; border:1px solid #ccc; border-radius:6px; font-size:14px; }
    .actions { display:flex; gap:16px; justify-content:center; margin-top:22px; }
    .save { background:#f26b3a; color:white; border:none; padding:12px 30px; border-radius:8px; cursor:pointer; }
    .cancel { background:transparent; border:2px solid #4b3eff; color:#4b3eff; padding:10px 26px; border-radius:8px; cursor:pointer; }
      h2 {
      color: #d65a1f;
      font-size: 20px;
      margin: 0;
    }
    @media (max-width:900px) { .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width:600px) { .grid { grid-template-columns: 1fr; } }
  `;

  constructor() {
    super();
    this.employeeId=null;
    
    this.form = {
      firstName: '', lastName: '', dateOfEmployment: '', dateOfBirth: '',
      phone: '', email: '', department: '', position: '',
    };
    this.errors = {};
    this.positions = ['Junior','Medior','Senior'];
    this.departments = ['Analytics','Tech'];
    updateWhenLocaleChanges(this);
  }

  loadEmployee(id) {
    this.employeeId = id;
    console.log('id1', id);
    
    if (id) {
      const emp = getEmployeeById(id);
      if (emp) {
        this.form = { ...emp };
      } else {
        this.employeeId = null;
        this.form = { firstName:'', lastName:'', dateOfEmployment:'', dateOfBirth:'', phone:'', email:'', department:'', position:'' };
      }
    } else {
      this.employeeId = null;
      this.form = { firstName:'', lastName:'', dateOfEmployment:'', dateOfBirth:'', phone:'', email:'', department:'', position:'' };
    }
    this.requestUpdate();
  }

  handleInput(e) {
    const name = e.target.name;
    this.form = { ...this.form, [name]: e.target.value };
  }

  async save(e) {
    e.preventDefault();
    if (!this.validateForm()) {
      this.requestUpdate();
      alert('Please fix validation errors before saving.');
      return;
    }

    const toSave = { ...this.form };
    if (this.employeeId) toSave.id = this.employeeId;
    const saved = addOrUpdateEmployee(toSave);

    window.appNavigate('#/');
  }

  validateField(name, value) {
    let message = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) message = 'Required';
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = 'Invalid email format';
        break;
      case 'phone':
        if (value && !/^[0-9+\-\s()]{6,20}$/.test(value))
          message = 'Invalid phone number';
        break;
      case 'dateOfBirth':
        if (value) {
          const dob = new Date(value);
          if (dob > new Date()) message = 'Birth date cannot be in future';
        }
        break;
    }
    this.errors = { ...this.errors, [name]: message };
  }

  validateForm() {
    Object.keys(this.form).forEach(k => this.validateField(k, this.form[k]));
    return !Object.values(this.errors).some(err => err);
  }

  cancel() {
    window.appNavigate('#/');
  }

  render() {
    this.loadEmployee(this.employeeId)
    return html`
    <div class="header">
        <h2>
          ${this.employeeId
            ? msg('Edit Employee', { id: 'editEmployee' })
            : msg('Add Employee', { id: 'addEmployee' })}
        </h2>
    </div>
      <div class="card">
    

        <form @submit=${this.save}>
          <div class="grid">
            <div>
              <label>${msg(html`First Name`, { id: 'firstName' })}</label>
              <input name="firstName" .value=${this.form.firstName || ''} @input=${this.handleInput} />
               ${this.errors.firstName ? html`<div class="error">${this.errors.firstName}</div>` : ''}
            </div>
            <div>
              <label>${msg(html`Last Name`, { id: 'lastName' })}</label>
              <input name="lastName" .value=${this.form.lastName || ''} @input=${this.handleInput} />
               ${this.errors.lastName ? html`<div class="error">${this.errors.lastName}</div>` : ''}
            </div>
            <div>
              <label>${msg(html`Date of Employment`, { id: 'dateOfEmployment' })}</label>
              <input type="date" name="dateOfEmployment" .value=${this.form.dateOfEmployment || ''} @input=${this.handleInput} />
            </div>

            <div>
              <label>${msg(html`Date of Birth`, { id: 'dateOfEmployment' })}</label>
              <input type="date" name="dateOfBirth" .value=${this.form.dateOfBirth || ''} @input=${this.handleInput} />
               ${this.errors.dateOfBirth ? html`<div class="error">${this.errors.dateOfBirth}</div>` : ''}
            </div>
            <div>
              <label>${msg(html`Phone`, { id: 'phone' })}</label>
              <input name="phone" .value=${this.form.phone || ''} @input=${this.handleInput} />
               ${this.errors.phone ? html`<div class="error">${this.errors.phone}</div>` : ''}
            </div>
            <div>
              <label>${msg(html`Email`, { id: 'email' })}</label>
              <input type="email" name="email" .value=${this.form.email || ''} @input=${this.handleInput} />
              ${this.errors.email ? html`<div class="error">${this.errors.email}</div>` : ''}
            </div>

            <div>
              <label>${msg(html`Department`, { id: 'department' })}</label>
              <select name="department" .value=${this.form.department || ''} @change=${this.handleInput}>
                <option value="">Please Select</option>
                ${this.departments.map(d => html`<option value=${d} ?selected=${this.form.department === d}>${d}</option>`)}
              </select>
            </div>

            <div>
              <label>${msg(html`Position`, { id: 'position' })}</label>
              <select name="position" .value=${this.form.position || ''} @change=${this.handleInput}>
                <option value="">Please Select</option>
                ${this.positions.map(p => html`<option value=${p} ?selected=${this.form.position === p}>${p}</option>`)}
              </select>
            </div>
            <div></div>
          </div>

          <div class="actions">
            <button class="save" type="submit">${msg('Save', { id: 'save' })}</button>
            <button type="button" class="cancel" @click=${this.cancel}>${msg('Cancel', { id: 'cancel' })}</button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
