
let order = [];
let total = 0;

function addToOrder(product, price) {
    const existingProductIndex = order.findIndex(item => item.product === product);

    if (existingProductIndex !== -1) {
        order[existingProductIndex].quantity += 1;
        order[existingProductIndex].price += price;
    } else {
        order.push({ product, price, quantity: 1 });
    }

    updateOrderSummary();
}

function subtractFromOrder(product, price) {
    const existingProductIndex = order.findIndex(item => item.product === product);

    if (existingProductIndex !== -1) {
        order[existingProductIndex].quantity -= 1;
        order[existingProductIndex].price -= price;

        if (order[existingProductIndex].quantity === 0) {
            order.splice(existingProductIndex, 1);
        }
    }

    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const orderTotal = document.getElementById('order-total');
    orderList.innerHTML = '';
    total = 0;

    order.forEach(item => {
        total += item.price;
        const li = document.createElement('li');
        li.innerHTML = `${item.product} x${item.quantity}: ฿${item.price} 
                        <span class="quantity-controls">
                            <button onclick="addToOrder('${item.product}', ${item.price / item.quantity})">+</button>
                            <button onclick="subtractFromOrder('${item.product}', ${item.price / item.quantity})">-</button>
                        </span>`;
        orderList.appendChild(li);
    });

    orderTotal.textContent = total;
}

document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();
   
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;

    // Initialize LINE LIFF
    liff.init({ liffId: 'https://liff.line.me/2006609948-yQ2mBLlx' }).then(() => {
        // Send checkout details to LINE LIFF
        liff.sendMessages([{
            type: 'text',
            text: `รายการอาหารที่สั่ง:\nDelivery Method: ${deliveryMethod}\nชื่อ: ${name}\nที่อยู่: ${address}\nราคารวม: ฿${total}\nรายการ:\n${order.map(item => `${item.product} x${item.quantity}: ฿${item.price}`).join('\n')}`
        }]).then(() => {
            alert('สั่งอาหารผ่านไลน์!');
            // Reset order and form
            order = [];
            updateOrderSummary();
            event.target.reset();
        }).catch((err) => {
            console.error('Error sending message:', err);
        });
    }).catch((err) => {
        console.error('LIFF initialization failed:', err);
    });
});


function initializeLiff() {
    liff.init({
        liffId: "2006609948-yQ2mBLlx" // Replace with your LIFF ID
    }).then(() => {
        console.log("LIFF initialized");
    }).catch((err) => {
        console.error("LIFF initialization failed", err);
    });
}

function sendOrderDetails() {
    var urlParams = new URLSearchParams(window.location.search);
    var totalPrice = urlParams.get('total-price');
    var productDetails = JSON.parse(urlParams.get('product-details'));

    var messageContent = 'Order Details:\n';
    productDetails.forEach(function(product) {
        if (product.quantity > 0) {
            messageContent += `${product.name}: ${product.quantity}\n`;
        }
    });
    messageContent += `Total Price: $${totalPrice}`;

    if (liff.isLoggedIn()) {
        liff.sendMessages([{
            type: "text",
            text: messageContent
        }]).then(() => {
            alert('Order details sent');
        }).catch((err) => {
            console.log("Error sending message", err);
        });
    } else {
        alert('Please log in to LINE first');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initializeLiff();

    var urlParams = new URLSearchParams(window.location.search);
    var totalPrice = urlParams.get('total-price');
    var productDetails = JSON.parse(urlParams.get('product-details'));

    document.getElementById('total-price-display').textContent = totalPrice;

    var productList = document.getElementById('product-list');
    productDetails.forEach(function(product) {
        if (product.quantity > 0) {
            var productItem = document.createElement('div');
            productItem.className = 'product';
            productItem.textContent = `${product.name}: ${product.quantity}`;
            productList.appendChild(productItem);
        }
    });
});
