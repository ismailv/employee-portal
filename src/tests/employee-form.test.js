import { html, fixture, expect } from '@open-wc/testing';
import '../components/employee-form.js';
import { describe, it, should,beforeEach , vi } from 'vitest';

describe('EmployeeForm Component', () => {
  beforeEach(() => {
    window.alert = vi.fn();
    window.appNavigate = vi.fn();
  });

  it('renders Add Employee form correctly', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el).to.exist;
    const heading = el.shadowRoot.querySelector('h2');
    expect(heading.textContent).to.contain('Add Employee');
  });

  it('renders Edit Employee form when employeeId is set', async () => {
    const el = await fixture(html`<employee-form .employeeId=${'1'}></employee-form>`);
    expect(el).to.exist;
    const heading = el.shadowRoot.querySelector('h2');
    expect(heading.textContent).to.contain(' Employee');
  });

  it('shows validation error when required field is empty', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const firstNameInput = el.shadowRoot.querySelector('input[name="firstName"]');
    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    el.save(new Event('submit'));
    await el.updateComplete;

    expect(el.errors.firstName).to.equal('Required');
  });


});
