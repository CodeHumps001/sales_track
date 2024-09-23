const humburger =  document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

humburger.addEventListener('click', ()=> {
    sidebar.classList.toggle('active');
});


// mode set
function mode(){
    let buttonElement = document.querySelector('.js-button');
    if(buttonElement.innerHTML === 'Dark'){
        buttonElement.innerHTML = 'white';
        document.body.classList.add('white-mode');
        document.body.form.label.classList.add('label1')
    }else{
        buttonElement.innerHTML = 'Dark';
        document.body.classList.remove('white-mode'); 
    }
    
}




// Get form elements and table body
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const historyList = document.getElementById('historyList');
const totalProfitDisplay = document.getElementById('totalProfit');
const totalAmountDisplay = document.getElementById('totalAmount');
const clearButton = document.getElementById('clearButton');

let totalProfit = 0;
let totalAmountBeforeProfit = 0;

// Load data from localStorage on page load
window.onload = function () {
    
    // Load active sales
    const storedSales = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const storedTotalProfit = parseFloat(localStorage.getItem('totalProfit')) || 0;
    const storedTotalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

    // Populate table with stored products
    storedSales.forEach(sale => {
        addProductToTable(sale.date, sale.productName, sale.quantity, sale.amount, sale.profit, sale.totalProfitForProduct, sale.totalAmountForProduct);
    });

    // Set the total profit and total amount
    totalProfit = storedTotalProfit;
    totalAmountBeforeProfit = storedTotalAmount;
    updateTotals();

    // Load history
    const fullHistory = JSON.parse(localStorage.getItem('fullSalesHistory')) || [];
    fullHistory.forEach(sale => {
        addProductToHistory(sale.date, sale.productName, sale.quantity, sale.amount, sale.profit, sale.totalProfitForProduct, sale.totalAmountForProduct);
    });
};

// Handle form submission
productForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values
    const productName = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const profit = parseFloat(document.getElementById('profit').value);
    const currentDate = new Date().toLocaleDateString();

    // Calculate total profit and total amount
    const totalProfitForProduct = profit * quantity;
    const totalAmountForProduct = amount * quantity;

    // Update total profit and total amount
    totalProfit += totalProfitForProduct;
    totalAmountBeforeProfit += totalAmountForProduct;

    // Add product to table with date
    addProductToTable(currentDate, productName, quantity, amount, profit, totalProfitForProduct, totalAmountForProduct);

    // Save the product data in localStorage with date
    saveProduct(currentDate, productName, quantity, amount, profit, totalProfitForProduct, totalAmountForProduct);

    // Update totals
    updateTotals();

    // Reset form inputs
    productForm.reset();
});

// Add product to the table
function addProductToTable(date, productName, quantity, amount, profit, totalProfitForProduct, totalAmountForProduct) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${date}</td>
        <td>${productName}</td>
        <td>${quantity}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${profit.toFixed(2)}</td>
        <td>${totalProfitForProduct.toFixed(2)}</td>
        <td>${totalAmountForProduct.toFixed(2)}</td>
    `;
    productList.appendChild(row);
}

// Add product to the history
function addProductToHistory(date, productName, quantity, amount, profit, totalProfitForProduct, totalAmountForProduct) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${date}</td>
        <td>${productName}</td>
        <td>${quantity}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${profit.toFixed(2)}</td>
        <td>${totalProfitForProduct.toFixed(2)}</td>
        <td>${totalAmountForProduct.toFixed(2)}</td>
    `;
    historyList.appendChild(row);
}

// Save the product data in localStorage with date
function saveProduct(date, productName, quantity, amount, profit, totalProfitForProduct, totalAmountForProduct) {
    const storedSales = JSON.parse(localStorage.getItem('salesHistory')) || [];
    storedSales.push({ date, productName, quantity, amount, profit, totalProfitForProduct, totalAmountForProduct });
    localStorage.setItem('salesHistory', JSON.stringify(storedSales));

    // Update total profit and total amount in localStorage
    localStorage.setItem('totalProfit', totalProfit.toFixed(2));
    localStorage.setItem('totalAmount', totalAmountBeforeProfit.toFixed(2));
}

// Update totals in the footer
function updateTotals() {
    totalProfitDisplay.textContent = totalProfit.toFixed(2);
    totalAmountDisplay.textContent = totalAmountBeforeProfit.toFixed(2);
}

// Clear all rows and move data to history
clearButton.addEventListener('click', function () {
    // Move current sales to history
    const currentSales = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const fullHistory = JSON.parse(localStorage.getItem('fullSalesHistory')) || [];

    const updatedHistory = fullHistory.concat(currentSales);
    localStorage.setItem('fullSalesHistory', JSON.stringify(updatedHistory));

    // Add all current sales to history list in UI
    currentSales.forEach(sale => {
        addProductToHistory(sale.date, sale.productName, sale.quantity, sale.amount, sale.profit, sale.totalProfitForProduct, sale.totalAmountForProduct);
    });

    // Clear current sales
    productList.innerHTML = '';
    localStorage.removeItem('salesHistory');
    localStorage.removeItem('totalProfit');
    localStorage.removeItem('totalAmount');

    // Reset totals
    totalProfit = 0;
    totalAmountBeforeProfit = 0;
    updateTotals();
});
