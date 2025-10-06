import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { nextFrame } from '@open-wc/testing-helpers';
import '../components/employee-list.js';

vi.mock('./../storage/storage.js', () => {
  return {
    loadEmployees: vi.fn(() => [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phone: '1234567890',
        email: 'john@example.com',
        department: 'IT',
        position: 'Developer'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2021-05-10',
        dateOfBirth: '1992-03-12',
        phone: '0987654321',
        email: 'jane@example.com',
        department: 'HR',
        position: 'Manager'
      }
    ]),
    deleteEmployeeById: vi.fn((id) => [
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2021-05-10',
        dateOfBirth: '1992-03-12',
        phone: '0987654321',
        email: 'jane@example.com',
        department: 'HR',
        position: 'Manager'
      }
    ]),
  };
});

describe('EmployeeList Component', () => {
  let employeeList;

  beforeEach(async () => {
    document.body.innerHTML = `<employee-list></employee-list>`;
    employeeList = document.querySelector('employee-list');
    await nextFrame();
  });

  it('renders employee list table', async () => {
    await nextFrame();
    expect(employeeList.shadowRoot.querySelector('table')).toBeTruthy();
    expect(employeeList.shadowRoot.querySelectorAll('tbody tr').length).toBe(0);
  });



  it('switches to grid view', async () => {
    const gridBtn = employeeList.shadowRoot.querySelector('.view-toggle button:last-child');
    gridBtn.click();
    await nextFrame();
    expect(employeeList.viewMode).toBe('grid');
    expect(employeeList.shadowRoot.querySelector('.grid')).toBeTruthy();
  });

  it('opens delete modal', async () => {
    const deleteBtn = employeeList.shadowRoot.querySelector('.delete-btn').parentElement;
    deleteBtn.click();
    await nextFrame();
    expect(employeeList.showModal).toBe(true);
    expect(employeeList.shadowRoot.querySelector('.modal')).toBeTruthy();
  });

  it('deletes employee on confirm', async () => {
    const deleteBtn = employeeList.shadowRoot.querySelector('.delete-btn').parentElement;
    deleteBtn.click();
    await nextFrame();

    const confirmBtn = employeeList.shadowRoot.querySelector('.proceed');
    confirmBtn.click();
    await nextFrame();

    expect(employeeList.employees.length).toBe(1);
    expect(employeeList.employees[0].firstName).toBe('Jane');
  });

  it('changes page', async () => {
    employeeList.itemsPerPage = 1;
    employeeList.refresh();
    await nextFrame();

    const nextPageBtn = employeeList.shadowRoot.querySelector('.pagination button:last-child');
    nextPageBtn.click();
    await nextFrame();

    expect(employeeList.currentPage).toBe(2);
  });
});
