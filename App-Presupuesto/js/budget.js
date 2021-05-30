//SELECCIONAR LOS ELEMENTOS
const d = document,
  balanceEl = d.querySelector(".balance .value"),
  incomeTotalEl = d.querySelector(".income-total"),
  outcomeTotalEl = d.querySelector(".outcome-total"),
  incomeEl = d.querySelector("#income"),
  expenseEl = d.querySelector("#expense"),
  allEl = d.querySelector("#all"),
  incomeList = d.querySelector("#income .list"),
  expenseList = d.querySelector("#expense .list"),
  allList = d.querySelector("#all .list");

//SELECCIONAR BOTONES
const expenseBtn = d.querySelector(".tab1"),
  incomeBtn = d.querySelector(".tab2"),
  allBtn = d.querySelector(".tab3");

//SELECCIONAR INPUTS
const addExpense = d.querySelector(".add-expense"),
  expenseTitle = d.getElementById("expense-title-input"),
  expenseAmount = d.getElementById("expense-amount-input");

const addIncome = d.querySelector(".add-income"),
  incomeTitle = d.getElementById("income-title-input"),
  incomeAmount = d.getElementById("income-amount-input");

//VARIABLES
let ENTRY_LIST;
let balance = 0,
  income = 0,
  outcome = 0;

const DELETE = "delete",
  EDIT = "edit";

//MIRAR SI HAY DATOS EN LOCAL STORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("ENTRY_LIST")) || [];
updateUI();

//EVENT LISTENERS

expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});
incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener("click", function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
  if (!expenseTitle.value || !expenseAmount.value) return; //Si uno esta vacío solo retornamos.

  //Guardar los datos ingresados en nuestro array ENTRY_LIST
  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseFloat(expenseAmount.value),
  };
  ENTRY_LIST.push(expense);

  updateUI();
  clearInput([expenseTitle, expenseAmount]);
});

addIncome.addEventListener("click", function () {
  if (!incomeTitle.value || !incomeAmount.value) return; //Si uno esta vacío solo retornamos.

  //Guardar los datos ingresados en nuestro array ENTRY_LIST
  let income = {
    type: "income",
    title: incomeTitle.value,
    amount: parseFloat(incomeAmount.value),
  };
  ENTRY_LIST.push(income);

  updateUI();
  clearInput([incomeTitle, incomeAmount]);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

//HELPERS

function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id === DELETE) {
    deleteEntry(entry);
  } else if (targetBtn.id === EDIT) {
    editEntry(entry);
  }
}

function deleteEntry(entry) {
  ENTRY_LIST.splice(entry.id, 1);
  updateUI();
}

function editEntry(entry) {
  let ENTRY = ENTRY_LIST[entry.id];

  if (ENTRY.type === "income") {
    incomeAmount.value = ENTRY.amount;
    incomeTitle.value = ENTRY.title;
  } else if (ENTRY.type === "expense") {
    expenseAmount.value = ENTRY.amount;
    expenseTitle.value = ENTRY.title;
  }

  deleteEntry(entry);
}

function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  //DETERMINAR EL SIGNO DEL BALANCE
  let sign = income >= outcome ? "$" : "-$";

  //UPDATE UI
  balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
  outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
  incomeTotalEl.innerHTML = `<small>$</small>${income}`;
  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type == "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type == "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });

  updateChart(income, outcome);

  localStorage.setItem("ENTRY_LIST", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
  const entry = `<li id="${id}" class="${type}">
                              <div class="entry">${title}: ${amount}</div>
                              <div id="edit"></div>
                              <div id="delete"></div>
                          </li>`;

  const position = "afterbegin";

  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;

  list.forEach((entry) => {
    if (entry.type === type) {
      sum += entry.amount;
    }
  });

  return sum;
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((el) => {
    el.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("active");
}

function inactive(elements) {
  elements.forEach((el) => {
    el.classList.remove("active");
  });
}
