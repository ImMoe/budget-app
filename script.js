
var totalbalance, income, expenses;
var option, what, count, submit;
var incomeList, expensesList;

var incomeOverview, expenseOverview

incomeOverview = document.querySelector(".income-overview");
expenseOverview = document.querySelector(".expense-overview");

totalbalance = document.querySelector(".total-balance");
income = document.querySelector(".incomeAmount");
expense = document.querySelector(".expensesAmount");

option = document.querySelector(".option");
what = document.querySelector(".what");
count = document.querySelector(".count");
submit = document.querySelector(".submit");

incomeList = document.querySelector(".income-overview ul");
expensesList = document.querySelector(".expense-overview ul");

getIncomes();
getExpenses();

// Listen for a click on the submit button
submit.addEventListener("click", function() {
    if (isNaN(count.value)) {
        return;
    } else if (count.value == "") {
        return;
    } else {
        (option == "income" ? incomeHandler(): (option == "expense" ? expenseHandler(): alert("Choose between income or expense!")));
    }
    
});

// Income handler
function incomeHandler() {
    // update total balance
    var updateTotalBalance = Number(totalbalance.textContent.split(" ")[0]) + Number(count.value);

    totalbalance.textContent = income.textContent = updateTotalBalance + " +";
    income.textContent = count.value + " +";

    // create new element to append to income-overview
    var li, span1, span1Text, span2, span2Text;
    li = document.createElement("li");
    
    span1 = document.createElement("span");
    span1Text = document.createTextNode(what.value);
    span1.append(span1Text);

    span2 = document.createElement("span");
    span2.className = "amount";
    span2Text = document.createTextNode(count.value + " +");
    span2.append(span2Text);

    li.append(span1);
    li.append(span2);

    incomeList.append(li);
    
    

    // add new income to localstorage or database
    var incomes;
    if (localStorage.getItem("incomes") == null) {
        incomes = [];
        incomesHelper();
    } else {
        incomes = JSON.parse(localStorage.getItem("incomes"));
        incomesHelper();
    }

    function incomesHelper() {
        incomes.push({what: what.value, count: count.value});
        localStorage.setItem("incomes", JSON.stringify(incomes));
        what.value = "";
        count.value = "";
    }
    
    getIncomes();
}

// Expense handler

function expenseHandler() {
    // update total balance
    expense.textContent = count.value + " -";

    // create new element to append to expense-overview
    var li, span1, span1Text, span2, span2Text, span2Precent, span2PrecentText;
    li = document.createElement("li");
    
    span1 = document.createElement("span");
    span1Text = document.createTextNode(what.value);
    span1.append(span1Text);

    span2 = document.createElement("span");
    span2.className = "amount";
    span2Text = document.createTextNode(count.value + " -");
    span2.append(span2Text);

    span2Precent = document.createElement("span");
    span2Precent.className = "precent";
    var cal = count.value / Number(totalbalance.textContent.split(" ")[0]) * 100;
    span2PrecentText = document.createTextNode(cal.toFixed("1") + "%");
    span2Precent.append(span2PrecentText);

    span2.append(span2Precent);

    li.append(span1);
    li.append(span2);
    
    expensesList.append(li);

    // add new income to localstorage or database
    var expenses;
    if (localStorage.getItem("expenses") == null) {
        expenses = [];
        expensesHelper();
    } else {
        expenses = JSON.parse(localStorage.getItem("expenses"));
        expensesHelper();
    }

    function expensesHelper() {
        expenses.push({what: what.value, count: count.value, precent: cal.toFixed(2)});
        localStorage.setItem("expenses", JSON.stringify(expenses));
        what.value = "";
        count.value = "";
    }

    getExpenses();
    
}


incomeOverview.addEventListener("dblclick", function(e) {
    var incomes = JSON.parse(localStorage.getItem("incomes"));
    incomes.filter(function(income, index) {
        if (income.what === e.target.textContent) {
            var question = confirm("Do you really want to delete this?")
            if (question) {
                incomes.splice(index, 1);
                e.target.parentElement.remove();
                localStorage.setItem("incomes", JSON.stringify(incomes));
            }
            
        }
    })
    getIncomes();
})

expenseOverview.addEventListener("dblclick", function(e) {
    var expenses = JSON.parse(localStorage.getItem("expenses"));
    expenses.filter(function(expense, index) {
        if (expense.what === e.target.textContent) {
            var question = confirm("Do you really want to delete this?")
            if (question) {
                expenses.splice(index, 1);
                e.target.parentElement.remove();
                localStorage.setItem("expenses", JSON.stringify(expenses));
            }
            
        }
    })
    getExpenses();
})

function getIncomes() {
    var outputIncomes = "";
    // Populate incomeList with saved data
    var incomes = JSON.parse(localStorage.getItem("incomes"));
    var sumIncome = 0;
    if (incomes) {
        incomes.forEach(function(income) {
            sumIncome += Number(income.count);
            outputIncomes += `<li><span>${income.what}</span><span class="amount">+ ${income.count}</span></li>`;
            incomeList.innerHTML = outputIncomes;
        });
        totalbalance.textContent = Number(sumIncome) + " +";
        income.textContent = Number(sumIncome) + " +";
    }
}

function getExpenses() {
    var outputExpenses = "";
    // Populate expensesList with saved data
    var expenses = JSON.parse(localStorage.getItem("expenses"));
    var sumExpenses = 0;
    if (expenses) {
        expenses.forEach(function(expense) {
            outputExpenses += `<li><span>${expense.what}</span><span class="amount">- ${expense.count} <span class="precent">${expense.precent} %</span></span></li>`;
            expensesList.innerHTML = outputExpenses;
            sumExpenses += (Number(expense.count));
        });
        expense.innerHTML = sumExpenses + " -";
    }

    // Wait for select element to change value
    option.onchange = function(e) {
        option = e.target.value;
    }
}