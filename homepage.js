document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    
    loginBtn.addEventListener('click', function() {
        // Show alert
        alert('Welcome to KNOTHOUS! Please enter your login details.');
        
        // Create a simple login form in console
        console.log('=== KNOTHOUS LOGIN CONSOLE ===');
        console.log('Please enter your credentials:');
        console.log('Username: ');
        console.log('Password: ');
        console.log('================================');
        
         
    });
    
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});