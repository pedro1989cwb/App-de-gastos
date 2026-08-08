const STORAGE_KEY = 'gastos-trabalho';

/** @typedef {{id:string, date:string, category:string, description:string, value:number}} Expense */

/** @returns {Expense[]} */
function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao carregar gastos:', e);
    return [];
  }
}

/** @param {Expense[]} expenses */
function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Erro ao salvar gastos:', e);
    alert('Não foi possível salvar. Verifique o espaço de armazenamento do navegador.');
  }
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7); // YYYY-MM
}

function monthLabel(key) {
  const [year, month] = key.split('-');
  const names = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${names[parseInt(month, 10) - 1]}/${year}`;
}

let expenses = loadExpenses();

const entriesEl = document.getElementById('entries');
const emptyMsgEl = document.getElementById('emptyMsg');
const totalMonthEl = document.getElementById('totalMonth');
const totalAllEl = document.getElementById('totalAll');
const monthFilterEl = document.getElementById('monthFilter');
const form = document.getElementById('expenseForm');
const dateInput = document.getElementById('date');

dateInput.valueAsDate = new Date();

function populateMonthFilter() {
  const keys = Array.from(new Set(expenses.map(e => monthKey(e.date)))).sort().reverse();
  const currentKey = monthKey(new Date().toISOString());
  if (!keys.includes(currentKey)) keys.unshift(currentKey);

  const previouslySelected = monthFilterEl.value;
  monthFilterEl.innerHTML = '';
  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'Todos';
  monthFilterEl.appendChild(allOpt);

  keys.forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = monthLabel(key);
    monthFilterEl.appendChild(opt);
  });

  monthFilterEl.value = keys.includes(previouslySelected) ? previouslySelected : currentKey;
}

function render() {
  populateMonthFilter();
  const selected = monthFilterEl.value;

  const filtered = expenses
    .filter(e => selected === 'all' || monthKey(e.date) === selected)
    .sort((a, b) => b.date.localeCompare(a.date));

  entriesEl.innerHTML = '';
  emptyMsgEl.classList.toggle('hidden', filtered.length > 0);

  filtered.forEach(e => {
    const row = document.createElement('div');
    row.className = 'entry';
    row.innerHTML = `
      <div class="entry-desc">${escapeHtml(e.description)}</div>
      <div class="entry-value">${formatBRL(e.value)}</div>
      <div class="entry-meta">${formatDate(e.date)} · ${escapeHtml(e.category)}</div>
      <button class="entry-del" data-id="${e.id}">remover</button>
    `;
    entriesEl.appendChild(row);
  });

  const monthTotal = filtered.reduce((sum, e) => sum + e.value, 0);
  const allTotal = expenses.reduce((sum, e) => sum + e.value, 0);
  totalMonthEl.textContent = formatBRL(monthTotal);
  totalAllEl.textContent = formatBRL(allTotal);
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();
  const value = parseFloat(document.getElementById('value').value);

  if (!date || !description || isNaN(value) || value < 0) return;

  expenses.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date, category, description, value
  });
  saveExpenses(expenses);
  form.reset();
  dateInput.valueAsDate = new Date();
  render();
});

entriesEl.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('entry-del')) {
    const id = ev.target.dataset.id;
    if (confirm('Remover este item do recibo?')) {
      expenses = expenses.filter(e => e.id !== id);
      saveExpenses(expenses);
      render();
    }
  }
});

monthFilterEl.addEventListener('change', render);

document.getElementById('exportBtn').addEventListener('click', () => {
  if (expenses.length === 0) {
    alert('Nenhum gasto para exportar ainda.');
    return;
  }
  const header = 'Data,Categoria,Descricao,Valor\n';
  const rows = expenses
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => `${e.date},"${e.category}","${e.description.replace(/"/g, '""')}",${e.value.toFixed(2)}`)
    .join('\n');
  const csv = header + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gastos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

render();

// Registra o service worker para funcionar offline / ser instalável
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker não registrado:', err);
    });
  });
}
