document.addEventListener('DOMContentLoaded', function() {
    // Sample cart data (in real app, this would come from localStorage or API)
    const cartItems = [
        {
            id: 1,
            name: "DAISY CROCHET TOTEBAG",
            price: 5.00,
            quantity: 1,
            image: "https://picsum.photos/seed/totebag/60/60.jpg"
        },
        {
            id: 2,
            name: "CAT GLOVES",
            price: 8.00,
            quantity: 2,
            image: "https://picsum.photos/seed/catgloves/60/60.jpg"
        },
        {
            id: 3,
            name: "WOODEN PLANT STAND",
            price: 45.00,
            quantity: 1,
            image: "https://picsum.photos/seed/plantstand/60/60.jpg"
        }
    ];

    // DOM elements
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const promoCode = document.getElementById('promoCode');
    const applyPromo = document.getElementById('applyPromo');
    const promoMessage = document.getElementById('promoMessage');
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const cardType = document.getElementById('cardType');
    
    // Order summary elements
    const orderItems = document.getElementById('orderItems');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');
    
    // State
    let currentPaymentMethod = 'card';
    let discount = 0;
    let promoApplied = false;
    
    // Initialize
    loadCartFromStorage();
    updateOrderSummary();
    setupEventListeners();
    
    function setupEventListeners() {
        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', function() {
                const method = this.dataset.method;
                selectPaymentMethod(method);
                console.log('Payment method selected:', method);
            });
        });
        
        // Card number formatting (Unique Technical Feature)
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            
            // Detect card type
            detectCardType(value);
            console.log('Card number input:', formattedValue);
        });
        
        // Expiry date formatting
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
            console.log('Expiry date input:', value);
        });
        
        // CVV validation
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
            console.log('CVV input:', e.target.value);
        });
        
        // Form validation on input
        shippingForm.addEventListener('input', function(e) {
            validateField(e.target);
            console.log('Shipping form input:', e.target.name, e.target.value);
        });
        
        paymentForm.addEventListener('input', function(e) {
            validateField(e.target);
            console.log('Payment form input:', e.target.name, e.target.value);
        });
        
        // Place order
        placeOrderBtn.addEventListener('click', function() {
            if (validateForms()) {
                processOrder();
            }
        });
        
        // Promo code
        applyPromo.addEventListener('click', applyPromoCode);
        promoCode.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
        
        // Header interactions
        document.querySelectorAll('.header-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                const iconType = this.querySelector('i').className;
                console.log('Header icon clicked:', iconType);
                
                if (iconType.includes('fa-user')) {
                    alert('Account page would open here');
                } else if (iconType.includes('fa-heart')) {
                    alert('Wishlist page would open here');
                } else if (iconType.includes('fa-shopping-bag')) {
                    alert('Cart page would open here');
                }
            });
        });
        
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                if (mainNav.style.display === 'flex') {
                    mainNav.style.display = 'none';
                } else {
                    mainNav.style.display = 'flex';
                    mainNav.style.position = 'absolute';
                    mainNav.style.top = '100%';
                    mainNav.style.left = '0';
                    mainNav.style.right = '0';
                    mainNav.style.backgroundColor = '#fff';
                    mainNav.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                    mainNav.style.flexDirection = 'column';
                    mainNav.style.padding = '20px';
                    
                    const navMenu = mainNav.querySelector('.nav-menu');
                    navMenu.style.flexDirection = 'column';
                    navMenu.style.alignItems = 'center';
                    
                    navMenu.querySelectorAll('li').forEach(li => {
                        li.style.margin = '10px 0';
                    });
                }
            });
        }
    }
    
    function selectPaymentMethod(method) {
        // Update active state
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        
        // Show/hide payment forms
        document.getElementById('cardPaymentForm').style.display = method === 'card' ? 'block' : 'none';
        document.getElementById('paypalForm').style.display = method === 'paypal' ? 'block' : 'none';
        document.getElementById('applePayForm').style.display = method === 'apple' ? 'block' : 'none';
        document.getElementById('googlePayForm').style.display = method === 'google' ? 'block' : 'none';
        
        currentPaymentMethod = method;
    }
    
    function detectCardType(cardNumber) {
        const visaRegex = /^4/;
        const mastercardRegex = /^5[1-5]/;
        const amexRegex = /^3[47]/;
        const discoverRegex = /^6(?:011|5)/;
        
        let cardTypeIcon = '';
        
        if (visaRegex.test(cardNumber)) {
            cardTypeIcon = 'fab fa-cc-visa';
        } else if (mastercardRegex.test(cardNumber)) {
            cardTypeIcon = 'fab fa-cc-mastercard';
        } else if (amexRegex.test(cardNumber)) {
            cardTypeIcon = 'fab fa-cc-amex';
        } else if (discoverRegex.test(cardNumber)) {
            cardTypeIcon = 'fab fa-cc-discover';
        } else {
            cardTypeIcon = 'far fa-credit-card';
        }
        
        cardType.innerHTML = `<i class="${cardTypeIcon}"></i>`;
        console.log('Card type detected:', cardTypeIcon);
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Basic validation based on field type
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.id === 'phone' && value && !isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        } else if (field.id === 'zipCode' && value && !isValidZip(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid ZIP code';
        }
        
        // Update field styling
        if (isValid) {
            field.style.borderColor = '#ddd';
            removeFieldError(field);
        } else {
            field.style.borderColor = '#ff4d4d';
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        removeFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4d4d';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorElement);
    }
    
    function removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function isValidPhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    function isValidZip(zip) {
        const re = /^\d{5}(-\d{4})?$/;
        return re.test(zip);
    }
    
    function validateForms() {
        let isValid = true;
        
        // Validate shipping form
        const shippingFields = shippingForm.querySelectorAll('input[required], select[required]');
        shippingFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate payment form based on selected method
        if (currentPaymentMethod === 'card') {
            const cardFields = paymentForm.querySelectorAll('#cardPaymentForm input[required]');
            cardFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            // Additional card validation
            const cardNumberValue = cardNumber.value.replace(/\s/g, '');
            if (cardNumberValue.length < 13 || cardNumberValue.length > 19) {
                validateField(cardNumber);
                isValid = false;
            }
            
            const expiryValue = expiryDate.value;
            if (!isValidExpiry(expiryValue)) {
                validateField(expiryDate);
                isValid = false;
            }
            
            const cvvValue = cvv.value;
            if (cvvValue.length < 3 || cvvValue.length > 4) {
                validateField(cvv);
                isValid = false;
            }
        }
        
        if (!isValid) {
            alert('Please fill in all required fields correctly');
            console.log('Form validation failed');
        }
        
        return isValid;
    }
    
    function isValidExpiry(expiry) {
        const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!re.test(expiry)) return false;
        
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;
        
        return true;
    }
    
    function processOrder() {
        // Show loading state
        placeOrderBtn.textContent = 'PROCESSING...';
        placeOrderBtn.disabled = true;
        
        // Collect order data
        const orderData = {
            shipping: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value
            },
            payment: {
                method: currentPaymentMethod
            },
            items: cartItems,
            totals: {
                subtotal: calculateSubtotal(),
                tax: calculateTax(),
                shipping: calculateShipping(),
                discount: discount,
                total: calculateTotal()
            }
        };
        
        if (currentPaymentMethod === 'card') {
            orderData.payment.cardNumber = '****' + cardNumber.value.slice(-4);
            orderData.payment.cardName = document.getElementById('cardName').value;
        }
        
        console.log('Processing order with data:', orderData);
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> PLACE ORDER';
            placeOrderBtn.disabled = false;
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success message
            alert(`Order placed successfully!\nOrder total: $${calculateTotal().toFixed(2)}\nYou will receive a confirmation email at ${orderData.shipping.email}`);
            
            // Redirect to order confirmation page
            // window.location.href = '/order-confirmation';
            
            console.log('Order processed successfully');
        }, 2000);
    }
    
    function applyPromoCode() {
        const code = promoCode.value.trim().toUpperCase();
        
        if (!code) {
            showPromoMessage('Please enter a promo code', 'error');
            return;
        }
        
        // Simulate promo code validation
        const validPromos = {
            'SAVE10': 0.1,
            'SAVE20': 0.2,
            'FREESHIP': 'shipping'
        };
        
        if (validPromos[code]) {
            if (validPromos[code] === 'shipping') {
                discount = calculateShipping();
                showPromoMessage('Free shipping applied!', 'success');
            } else {
                discount = calculateSubtotal() * validPromos[code];
                showPromoMessage(`${validPromos[code] * 100}% discount applied!`, 'success');
            }
            
            promoApplied = true;
            promoCode.disabled = true;
            applyPromo.disabled = true;
            updateOrderSummary();
            
            console.log('Promo code applied:', code, 'Discount:', discount);
        } else {
            showPromoMessage('Invalid promo code', 'error');
            console.log('Invalid promo code:', code);
        }
    }
    
    function showPromoMessage(message, type) {
        promoMessage.textContent = message;
        promoMessage.className = `promo-message ${type}`;
        
        setTimeout(() => {
            promoMessage.textContent = '';
            promoMessage.className = 'promo-message';
        }, 5000);
    }
    
    function updateOrderSummary() {
        // Render order items
        orderItems.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${item.price.toFixed(2)}</div>
                    <div class="order-item-quantity">Qty: ${item.quantity}</div>
                </div>
            </div>
        `).join('');
        
        // Calculate totals
        const subtotalAmount = calculateSubtotal();
        const taxAmount = calculateTax();
        const shippingAmount = calculateShipping();
        const totalAmount = calculateTotal();
        
        // Update display
        subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
        tax.textContent = `$${taxAmount.toFixed(2)}`;
        shipping.textContent = shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`;
        total.textContent = `$${totalAmount.toFixed(2)}`;
        
        console.log('Order summary updated:', {
            subtotal: subtotalAmount,
            tax: taxAmount,
            shipping: shippingAmount,
            discount: discount,
            total: totalAmount
        });
    }
    
    function calculateSubtotal() {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function calculateTax() {
        return calculateSubtotal() * 0.08; // 8% tax
    }
    
    function calculateShipping() {
        const subtotalAmount = calculateSubtotal();
        return subtotalAmount > 50 ? 0 : 5; // Free shipping over $50
    }
    
    function calculateTotal() {
        return calculateSubtotal() + calculateTax() + calculateShipping() - discount;
    }
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            console.log('Loaded cart from storage:', cart);
            // Update cartItems with saved cart data
            cartItems.length = 0; // Clear existing items
            cartItems.push(...cart);
        }
    }
});