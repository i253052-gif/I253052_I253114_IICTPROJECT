 document.addEventListener('DOMContentLoaded', function() {
    // Product data - Only 3 items now
    const products = [
        {
            id: 1,
            name: "DAISY CROCHET TOTEBAG",
            category: "bags",
            price: 5.00,
            image: " SHOPPINGCART/Gemini_Generated_Image_53tlxh53tlxh53tl.png",
            badge: "New"
        },
        {
            id: 2,
            name: "CAT GLOVES",
            category: "accessories",
            price: 8.00,
            image: " SHOPPINGCART/Gemini_Generated_Image_nt1xk6nt1xk6nt1x.png",
            badge: "Sale"
        },
        {
            id: 3,
            name: "CROCHET PILLOW COVERS",
            category: "home",
            price: 45.00,
            image: " SHOPPINGCART/Gemini_Generated_Image_fzkvkpfzkvkpfzkv.png",
            badge: "Popular"
        }
    ];

    // DOM elements
    const productsGrid = document.getElementById('productsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cartCount = document.querySelector('.cart-count');
    const noProducts = document.getElementById('noProducts');
    
    // Order summary elements
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const orderDetails = document.getElementById('orderDetails');
    const cartActions = document.getElementById('cartActions');
    const subtotal = document.getElementById('subtotal');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    
    // State
    let currentFilter = 'all';
    let currentSort = 'default';
    let filteredProducts = [...products];
    let cart = [];
    
    // Initialize
    loadCartFromStorage();
    updateCartCount();
    renderProducts();
    updateOrderSummary();
    
    // Filter functionality (Unique Technical Feature)
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentFilter = this.dataset.category;
            console.log('Filter changed to:', currentFilter);
            
            // Apply filter and sort
            applyFilterAndSort();
        });
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        console.log('Sort changed to:', currentSort);
        
        // Apply filter and sort
        applyFilterAndSort();
    });
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        console.log('Searching for:', searchTerm);
        
        if (searchTerm) {
            filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            renderProducts();
            
            if (filteredProducts.length === 0) {
                alert(`No products found for "${searchTerm}"`);
            }
        } else {
            applyFilterAndSort();
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        console.log('Proceeding to checkout with cart:', cart);
        alert(`Proceeding to checkout with ${cart.length} items. Total: $${calculateTotal().toFixed(2)}`);
        // In a real implementation, this would redirect to checkout page
    });
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', function() {
        console.log('Continue shopping clicked');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Header icon interactions
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
                // Scroll to order summary
                document.getElementById('orderSummaryContainer').scrollIntoView({
                    behavior: 'smooth'
                });
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
    
    // Helper functions
    function renderProducts() {
        console.log('Rendering products:', filteredProducts.length);
        
        if (filteredProducts.length === 0) {
            productsGrid.style.display = 'none';
            noProducts.style.display = 'block';
            return;
        }
        
        productsGrid.style.display = 'grid';
        noProducts.style.display = 'none';
        
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="action-btn quick-view-btn" data-id="${product.id}">
                            <i class="far fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to new elements
        addProductEventListeners();
    }
    
    function addProductEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productName = this.dataset.name;
                const productPrice = parseFloat(this.dataset.price);
                
                console.log('Adding to cart:', { productId, productName, productPrice });
                
                addToCart(productId, productName, productPrice);
            });
        });
        
        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                console.log('Added to wishlist:', productId);
                
                // Toggle heart icon
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.style.backgroundColor = '#8b5a3c';
                    this.style.color = 'white';
                    alert('Added to wishlist!');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.style.backgroundColor = '#fff';
                    this.style.color = '#333';
                    alert('Removed from wishlist');
                }
            });
        });
        
        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const product = products.find(p => p.id == productId);
                console.log('Quick view:', product);
                
                alert(`Quick View: ${product.name}\nPrice: $${product.price.toFixed(2)}\nCategory: ${product.category}`);
            });
        });
    }
    
    function applyFilterAndSort() {
        // Apply filter
        if (currentFilter === 'all') {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => product.category === currentFilter);
        }
        
        // Apply sort
        switch (currentSort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Keep original order
                break;
        }
        
        console.log('Filtered and sorted products:', filteredProducts);
        renderProducts();
    }
    
    function addToCart(productId, productName, productPrice) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            console.log('Updated quantity for existing item:', existingItem);
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image:  SHOPPINGCART/Gemini_Generated_Image_53tlxh53tlxh53tl.png
            });
            console.log('Added new item to cart:', { productId, productName, productPrice });
        }
        
        // Save cart to localStorage
        saveCartToStorage();
        
        // Update cart count and order summary
        updateCartCount();
        updateOrderSummary();
        
        // Show feedback
        alert(`${productName} added to cart!`);
    }
    
    function updateOrderSummary() {
        console.log('Updating order summary with cart:', cart);
        
        if (cart.length === 0) {
            // Show empty cart
            cartItems.style.display = 'none';
            emptyCart.style.display = 'block';
            orderDetails.style.display = 'none';
            cartActions.style.display = 'none';
        } else {
            // Show cart items
            cartItems.style.display = 'block';
            emptyCart.style.display = 'none';
            orderDetails.style.display = 'block';
            cartActions.style.display = 'flex';
            
            // Render cart items
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                            <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to cart item buttons
            addCartItemEventListeners();
            
            // Calculate and display totals
            const subtotalAmount = calculateSubtotal();
            const taxAmount = calculateTax(subtotalAmount);
            const totalAmount = calculateTotal();
            
            subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
            tax.textContent = `$${taxAmount.toFixed(2)}`;
            total.textContent = `$${totalAmount.toFixed(2)}`;
        }
    }
    
    function addCartItemEventListeners() {
        // Decrease quantity buttons
        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                updateItemQuantity(itemId, -1);
            });
        });
        
        // Increase quantity buttons
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                updateItemQuantity(itemId, 1);
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                removeFromCart(itemId);
            });
        });
    }
    
    function updateItemQuantity(itemId, change) {
        const item = cart.find(item => item.id == itemId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(itemId);
            } else {
                console.log(`Updated quantity for item ${itemId}: ${item.quantity}`);
                saveCartToStorage();
                updateCartCount();
                updateOrderSummary();
            }
        }
    }
    
    function removeFromCart(itemId) {
        const itemIndex = cart.findIndex(item => item.id == itemId);
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            cart.splice(itemIndex, 1);
            console.log('Removed item from cart:', removedItem);
            
            saveCartToStorage();
            updateCartCount();
            updateOrderSummary();
            
            alert(`${removedItem.name} removed from cart`);
        }
    }
    
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function calculateTax(subtotalAmount) {
        // Assuming 8% tax rate
        return subtotalAmount * 0.08;
    }
    
    function calculateTotal() {
        const subtotalAmount = calculateSubtotal();
        const taxAmount = calculateTax(subtotalAmount);
        // Shipping is free for orders over $50, otherwise $5
        const shippingCost = subtotalAmount > 50 ? 0 : 5;
        return subtotalAmount + taxAmount + shippingCost;
    }
    
    function updateCartCount() {
        // Calculate total items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count display
        cartCount.textContent = totalItems;
        console.log('Cart count updated:', totalItems);
    }
    
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Loaded cart from storage:', cart);
        }
    }
});