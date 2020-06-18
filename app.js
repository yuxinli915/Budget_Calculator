class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
    this.lists = [this.incomeList, this.expenseList];
    this.availableBudget;
  }

  // This add method determine whether passed in value is less, equal or greater than 0;
  // So that it will create related new transaction or alert user of invalid input.
  addNewTransaction(description, value) {
    if (value != 0) {

      if (value > 0) {
        this.incomeList.push(new Transaction(description, value, this.id++, `+`));
      } else {
        this.expenseList.push(new Transaction(description, value, this.id++, `-`));
      }

    } else {
      alert(`Are you joking?`);
    }
  }

  // This remove method search id in both lists to splice the selected one.
  removeTransaction(id) {
    this.lists.forEach(list => {
      const selectedIndex = list.findIndex(item => item.id == id);

      if (selectedIndex !== -1) {
        list.splice(selectedIndex, 1);
      }
    });
  }

  update() {
    let updateListStr;
    const incomeValue = document.querySelector(`.budget__income--value`);
    const expensesValue = document.querySelector(`.budget__expenses--value`);
    const incomeList = document.querySelector(`.income__list`);
    const expenseList = document.querySelector(`.expenses__list`);
    const availableBudget = document.querySelector(`.budget__value`);
    const sign = [`+`, `-`];
    const values = [incomeValue, expensesValue];
    const listDOMArr = [incomeList, expenseList];
    const totals = [this.total(this.incomeList), this.total(this.expenseList)];

    this.availableBudget = 0;

    // This loop go through two lists to build their own HTML.
    // It also updates the total for both lists.
    for (let x = 0; x < 2; x++) {
      updateListStr = ``;

      // This loop go through all the items in one list and increment the HTML.
      for (let y = this.lists[x].length - 1; y >= 0; y--) {
        updateListStr += `
          <div class="item" data-transaction-id=${this.lists[x][y].id}>
          <div class="item__description">${this.lists[x][y].description}</div>
          <div class="right">
          <div class="item__value">${this.lists[x][y].sign} $${Math.abs(this.lists[x][y].amount).toFixed(2)}
          </div>`;

        // This statement determine if a percentage need to be inserted.
        if (this.lists[x][y].amount < 0) {
          const percentage = (Math.abs(this.lists[x][y].amount) / this.total(this.incomeList)) * 100;

          // This statement determine if the percentage is a valid number;
          if (percentage == Infinity || this.incomeList.length === 0) {
            updateListStr += `<div class="item__percentage">N/A %</div>`;
          } else {
            updateListStr += `<div class="item__percentage">${Number.isInteger(percentage) ? percentage : percentage.toFixed(2)}%</div>`;
          }
        }

        updateListStr += `
          <div class="item__delete">
          <button class="item__delete--btn">
          <i class="ion-ios-close-outline"></i>
          </button>
          </div>
          </div>
          <div class="item__date">${this.lists[x][y].date}</div>
          </div>`;
      }

      this.availableBudget += totals[x];
      listDOMArr[x].innerHTML = updateListStr;
      values[x].innerText = `${sign[x]} $${Math.abs(totals[x]).toFixed(2)}`;
    }

    availableBudget.innerText = `${this.availableBudget >= 0 ? `+` : `-`} $${Math.abs(this.availableBudget).toFixed(2)}`;
    this.updateTotalPercentage();
  }

  // This method calculate total for the passed in array.
  total(listArr) {
    let total = 0;
    listArr.forEach(item => total += parseFloat(item.amount));
    return total;
  }

  // This method calculate the percentage for total expense.
  // And determine if the percentage is valid.
  updateTotalPercentage() {
    const percentage = 100 * Math.abs(this.total(this.expenseList)) / this.total(this.incomeList);
    const percentageDOM = document.querySelector(`.budget__expenses--percentage`);

    if (percentage == Infinity || this.incomeList.length === 0) {
      percentageDOM.innerText = `N/A %`;
    } else {
      percentageDOM.innerText = `${Number.isInteger(percentage) ? percentage : percentage.toFixed(2)}%`;
    }
  }
}

class Transaction {
  constructor(description, amount, id, sign) {
    this.description = description;
    this.amount = amount;
    this.date = this._date();
    this.id = id;
    this.sign = sign;
  }

  _date() {
    let dayStr;

    switch (dateDay % 10) {
      case 1:
        dayStr = `st`;
        break;
      case 2:
        dayStr = `nd`;
        break;
      case 3:
        dayStr = `rd`;
        break;
      default:
        dayStr = `th`;
        break;
    }

    return `${dateMonthShort}. ${dateDay}${dayStr}, ${dateYear}`;
  }
}

const date = new Date();
const dateYear = date.getFullYear();
const dateMonthLong = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
const dateMonthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
const dateDay = date.getDate();
const myTransactionList = new TransactionList();
const inputForm = document.querySelector(`.add__container`);
const budgetList = document.querySelector(`.container`);
const dateDOM = document.querySelector(`.budget__title--month`);

dateDOM.innerText = `${dateMonthLong} ${dateYear}`;

inputForm.addEventListener(`submit`, event => {
  const description = document.querySelector(`.add__description`);
  const moneyAmount = document.querySelector(`.add__value`);

  myTransactionList.addNewTransaction(description.value, moneyAmount.value);
  myTransactionList.update();
  description.value = ``;
  moneyAmount.value = ``;
  event.preventDefault();
})

budgetList.addEventListener(`click`, event => {
  if (event.target.nodeName === `I`) {
    const selectedItem = event.target.closest(`.item`);

    myTransactionList.removeTransaction(selectedItem.dataset.transactionId);
    myTransactionList.update();
  }
})