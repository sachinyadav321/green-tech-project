// GreenTech Project - Complete Client Side JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ GreenTech App Loaded');
    
    // Check if CSS is loaded
    const checkCSS = () => {
        const styles = getComputedStyle(document.body);
        const bgColor = styles.backgroundColor;
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            console.warn('⚠️ CSS might not be loaded properly');
        } else {
            console.log('✅ CSS loaded successfully');
        }
    };
    setTimeout(checkCSS, 100);
});

// Helper Functions
function showMessage(elementId, message, isError = true) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.innerHTML = `<p style="color: ${isError ? '#e74c3c' : '#27ae60'};">${isError ? '❌' : '✅'} ${message}</p>`;
        setTimeout(() => {
            if (messageDiv) messageDiv.innerHTML = '';
        }, 3000);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Login Page Logic
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showMessage('message', 'Please fill all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('message', 'Please enter a valid email');
            return;
        }
        
        const submitBtn = loginForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                showMessage('message', 'Login successful! Redirecting...', false);
                setTimeout(() => window.location.href = '/dashboard', 1000);
            } else {
                showMessage('message', data.message || 'Login failed');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            showMessage('message', 'Network error. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Signup Page Logic
if (document.getElementById('signupForm')) {
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!name || !email || !password) {
            showMessage('message', 'Please fill all fields');
            return;
        }
        
        if (name.length < 2) {
            showMessage('message', 'Name must be at least 2 characters');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('message', 'Please enter a valid email');
            return;
        }
        
        if (password.length < 6) {
            showMessage('message', 'Password must be at least 6 characters');
            return;
        }
        
        const submitBtn = signupForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                showMessage('message', 'Account created! Redirecting...', false);
                setTimeout(() => window.location.href = '/dashboard', 1000);
            } else {
                showMessage('message', data.message || 'Signup failed');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            showMessage('message', 'Network error. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Dashboard Logic
if (document.getElementById('principlesUl')) {
    async function loadDashboard() {
        try {
            const res = await fetch('/api/auth/dashboard-data', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            
            const data = await res.json();
            if (data.success) {
                const principlesUl = document.getElementById('principlesUl');
                if (principlesUl) {
                    principlesUl.innerHTML = '';
                    data.principles.forEach(p => {
                        const li = document.createElement('li');
                        li.innerHTML = `✅ ${p}`;
                        principlesUl.appendChild(li);
                    });
                }
                
                const examplesUl = document.getElementById('examplesUl');
                if (examplesUl) {
                    examplesUl.innerHTML = '';
                    data.greenTechExamples.forEach(ex => {
                        const li = document.createElement('li');
                        li.innerHTML = ex;
                        examplesUl.appendChild(li);
                    });
                }
                
                const hour = new Date().getHours();
                let greeting = hour < 12 ? 'Good Morning' : (hour < 17 ? 'Good Afternoon' : 'Good Evening');
                const userNameSpan = document.getElementById('userName');
                if (userNameSpan) {
                    userNameSpan.innerHTML = `${greeting}! 🌿 Welcome to Green Technology Dashboard`;
                }
            }
        } catch (error) {
            console.error('Dashboard error:', error);
            window.location.href = '/login';
        }
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            window.location.href = '/';
        });
    }
    
    loadDashboard();
}

// Home Page - Principles Grid
if (document.querySelector('.principles-grid')) {
    const principles = ["Prevention", "Atom Economy", "Less Hazardous", "Safer Chemicals", "Safer Solvents", "Energy Efficiency", "Renewable Feedstocks", "Reduce Derivatives", "Catalysis", "Design Degradation", "Real-time Analysis", "Inherently Safer"];
    const grid = document.getElementById('principlesGrid');
    if (grid && grid.children.length === 0) {
        principles.forEach(p => {
            const card = document.createElement('div');
            card.className = 'principle-card';
            card.innerHTML = `<h3>♻️ ${p}</h3><p>Green Chemistry Principle</p>`;
            grid.appendChild(card);
        });
    }
}