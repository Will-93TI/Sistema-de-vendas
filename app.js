const storageKey = "sistema-gestao-administrativa-data";

const defaultState = {
  materiais: [],
  faturamento: [],
  clientes: [],
  fornecedores: [],
  pix: null,
  conciliacao: []
};

const state = loadState();

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return structuredClone(defaultState);
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
}

function removeAt(collection, index) {
  state[collection].splice(index, 1);
  saveState();
  renderAll();
}

function bindTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}

function createDeleteButton(onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "action-btn";
  btn.textContent = "Excluir";
  btn.addEventListener("click", onClick);
  return btn;
}

function renderDashboard() {
  const totalFaturado = state.faturamento.reduce((acc, item) => acc + Number(item.quantidade) * Number(item.valorUnitario), 0);
  const cards = [
    ["Materiais", state.materiais.length],
    ["Clientes", state.clientes.length],
    ["Fornecedores", state.fornecedores.length],
    ["Itens faturados", state.faturamento.length],
    ["Total faturado", formatCurrency(totalFaturado)],
    ["Conciliações", `${state.conciliacao.filter((x) => x.status === "conciliado").length}/${state.conciliacao.length}`]
  ];

  const container = document.getElementById("dashboardCards");
  container.innerHTML = "";
  cards.forEach(([title, value]) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<h3>${title}</h3><p>${value}</p>`;
    container.appendChild(card);
  });
}

function renderMateriais() {
  const tbody = document.getElementById("materiaisTable");
  tbody.innerHTML = "";
  state.materiais.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.nome}</td><td>${item.unidade}</td><td>${item.estoque}</td><td>${formatCurrency(item.preco)}</td>`;
    const td = document.createElement("td");
    td.appendChild(createDeleteButton(() => removeAt("materiais", index)));
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

function renderFaturamento() {
  const tbody = document.getElementById("invoicesTable");
  tbody.innerHTML = "";
  let total = 0;

  state.faturamento.forEach((item, index) => {
    const itemTotal = Number(item.quantidade) * Number(item.valorUnitario);
    total += itemTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.tipo}</td><td>${item.descricao}</td><td>${item.quantidade}</td><td>${formatCurrency(item.valorUnitario)}</td><td>${formatCurrency(itemTotal)}</td>`;
    const td = document.createElement("td");
    td.appendChild(createDeleteButton(() => removeAt("faturamento", index)));
    tr.appendChild(td);
    tbody.appendChild(tr);
  });

  document.getElementById("invoiceTotal").textContent = `Total geral do faturamento: ${formatCurrency(total)}`;
}

function renderClients() {
  const tbody = document.getElementById("clientsTable");
  tbody.innerHTML = "";
  state.clientes.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.nome}</td><td>${item.documento}</td><td>${item.email}</td><td>${item.telefone}</td>`;
    const td = document.createElement("td");
    td.appendChild(createDeleteButton(() => removeAt("clientes", index)));
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

function renderSuppliers() {
  const tbody = document.getElementById("suppliersTable");
  tbody.innerHTML = "";
  state.fornecedores.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.nome}</td><td>${item.documento}</td><td>${item.categoria}</td><td>${item.contato}</td>`;
    const td = document.createElement("td");
    td.appendChild(createDeleteButton(() => removeAt("fornecedores", index)));
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

function renderPix() {
  const container = document.getElementById("pixConfig");
  if (!state.pix) {
    container.textContent = "Nenhuma chave PIX configurada.";
    return;
  }

  container.innerHTML = `
    <strong>Chave:</strong> ${state.pix.chavePix}<br>
    <strong>Tipo:</strong> ${state.pix.tipoChave}<br>
    <strong>Beneficiário:</strong> ${state.pix.beneficiario}
  `;
}

function renderReconciliation() {
  const tbody = document.getElementById("reconciliationTable");
  tbody.innerHTML = "";
  state.conciliacao.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.data}</td><td>${item.descricao}</td><td>${formatCurrency(item.valor)}</td><td>${item.status}</td>`;
    const td = document.createElement("td");
    td.appendChild(createDeleteButton(() => removeAt("conciliacao", index)));
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

function bindForms() {
  document.getElementById("materialForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    state.materiais.push(data);
    event.target.reset();
    saveState();
    renderAll();
  });

  document.getElementById("invoiceForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    state.faturamento.push(data);
    event.target.reset();
    saveState();
    renderAll();
  });

  document.getElementById("clientForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    state.clientes.push(data);
    event.target.reset();
    saveState();
    renderAll();
  });

  document.getElementById("supplierForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    state.fornecedores.push(data);
    event.target.reset();
    saveState();
    renderAll();
  });

  document.getElementById("pixForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.pix = Object.fromEntries(new FormData(event.target));
    saveState();
    renderPix();
  });

  document.getElementById("reconciliationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    state.conciliacao.push(data);
    event.target.reset();
    saveState();
    renderAll();
  });
}

function renderAll() {
  renderDashboard();
  renderMateriais();
  renderFaturamento();
  renderClients();
  renderSuppliers();
  renderPix();
  renderReconciliation();
}

bindTabs();
bindForms();
renderAll();
