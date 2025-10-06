export const STORAGE_KEY = 'employees_v1';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function saveEmployees(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
}

export function loadEmployees() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function getEmployeeById(id) {
  if (!id) return null;
  const list = loadEmployees();
  return list.find(x => String(x.id) === String(id)) || null;
}

export function addOrUpdateEmployee(emp) {
  const list = loadEmployees();
  if (emp.id) {
    const idx = list.findIndex(x => String(x.id) === String(emp.id));
    if (idx >= 0) list[idx] = { ...list[idx], ...emp };
    else list.unshift({ ...emp });
    saveEmployees(list);
    return emp;
  } else {
    const newEmp = { ...emp, id: generateId() };
    list.unshift(newEmp);
    saveEmployees(list);
    return newEmp;
  }
}

export function deleteEmployeeById(id) {
  console.log('id', id);
  
  const list = loadEmployees();
  const filtered = list.filter(x => String(x.id) !== String(id));
  saveEmployees(filtered);
  return filtered;
}

export function seedIfEmpty() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  const sample = Array.from({ length: 35 }, (_, i) => {
    const year = 2020 + (i % 4);
    const month = String(((i % 12) + 1)).padStart(2, '0');
    const day = '23';
    return {
      id: generateId(),
      firstName: 'Ahmet',
      lastName: 'Sourtimes',
      dateOfEmployment: `${year}-${month}-${day}`,
      dateOfBirth: `${1990 + (i % 30)}-${month}-${day}`,
      phone: '(+90) 532 123 45 67',
      email: `ahmet${i+1}@sourtimes.org`,
      department: i % 2 === 0 ? 'Analytics' : 'Tech',
      position: ['Junior','Medior','Senior'][i % 3],
    };
  });
  saveEmployees(sample);
}
