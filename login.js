document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const googleLoginBtn = document.getElementById('googleLogin');
    const facebookLoginBtn = document.getElementById('facebookLogin');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cartCount = document.querySelector('.cart-count');
    
    // Initialize cart count from localStorage
    updateCartCount();
    
    // Check if user was remembered
    checkRememberedUser();
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            alert(`Searching for: ${searchTerm}`);
            
        } else {
            alert('Please enter a search term');
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
     
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
       
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
    
   
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length > 0) {
            passwordStrength.style.display = 'block';
            const strength = calculatePasswordStrength(password);
            
            // Update strength meter
            strengthMeter.style.width = `${strength.score * 25}%`;
            
            // Update color based on strength
            if (strength.score === 1) {
                strengthMeter.style.backgroundColor = '#ff4d4d';
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#ff4d4d';
            } else if (strength.score === 2) {
                strengthMeter.style.backgroundColor = '#ffaa00';
                strengthText.textContent = 'Fair';
                strengthText.style.color = '#ffaa00';
            } else if (strength.score === 3) {
                strengthMeter.style.backgroundColor = '#2eb82e';
                strengthText.textContent = 'Good';
                strengthText.style.color = '#2eb82e';
            } else {
                strengthMeter.style.backgroundColor = '#00cc00';
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#00cc00';
            }
        } else {
            passwordStrength.style.display = 'none';
        }
        
        // Debug password input
        console.log('Password input:', password);
        console.log('Password strength:', strength);
    });
    
    // Email input debugging
    emailInput.addEventListener('input', function() {
        console.log('Email input:', this.value);
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        
        // Debug form data
        console.log('Form submission data:', {
            email,
            password,
            rememberMe
        });
        
        // Basic validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        // Simulate login process
        simulateLogin(email, password, rememberMe);
    });
    
    // Social login handlers
    googleLoginBtn.addEventListener('click', function() {
        console.log('Google login initiated');
        alert('Google login would be implemented here. This is a demo.');
        // In a real implementation, you would redirect to Google OAuth
    });
    
    facebookLoginBtn.addEventListener('click', function() {
        console.log('Facebook login initiated');
        alert('Facebook login would be implemented here. This is a demo.');
        // In a real implementation, you would redirect to Facebook OAuth
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
                alert(`Cart has ${cartCount.textContent} items`);
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
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Complexity checks
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Cap the score at 4
        score = Math.min(score, 4);
        
        return {
            score,
            feedback: getFeedback(score)
        };
    }
    
    function getFeedback(score) {
        switch(score) {
            case 1:
                return 'Very weak password. Consider using a longer password with mixed characters.';
            case 2:
                return 'Weak password. Add uppercase letters, numbers, or symbols.';
            case 3:
                return 'Good password. Consider adding special characters for more security.';
            case 4:
                return 'Strong password!';
            default:
                return '';
        }
    }
    
    function simulateLogin(email, password, rememberMe) {
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            
            // Simulate successful login
            if (rememberMe) {
                localStorage.setItem('rememberedUser', email);
                console.log('User will be remembered:', email);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            alert(`Login successful! Welcome back, ${email}`);
            console.log('Login successful for user:', email);
            
            // In a real app, you would redirect to the dashboard
            // window.location.href = '/dashboard';
        }, 1500);
    }
    
    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            emailInput.value = rememberedUser;
            rememberMeCheckbox.checked = true;
            console.log('Found remembered user:', rememberedUser);
        }
    }
    
    function updateCartCount() {
        // Get cart count from localStorage or set to 0 if not found
        let count = localStorage.getItem('cartCount') || 0;
        cartCount.textContent = count;
        console.log('Cart count updated:', count);
    }
    
    // Simulate adding items to cart (for demo purposes)
    function addToCart() {
        let count = parseInt(localStorage.getItem('cartCount') || 0);
        count++;
        localStorage.setItem('cartCount', count);
        updateCartCount();
        console.log('Item added to cart. New count:', count);
    }
    
    // Example: Add event listeners to "Add to Cart" buttons if they exist
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
});