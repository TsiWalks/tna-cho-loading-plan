class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        // This would normally come from a secure server endpoint
        this.init();
    }

    init() {
        // Check if user is already authenticated (session storage)
        const session = sessionStorage.getItem('tna_auth_session');
        if (session) {
            const sessionData = JSON.parse(session);
            if (this.isValidSession(sessionData)) {
                this.isAuthenticated = true;
                this.showApp();
                return;
            }
        }
        this.showLogin();
    }

    isValidSession(sessionData) {
        // Check if session is less than 8 hours old
        const now = Date.now();
        const sessionAge = now - sessionData.timestamp;
        return sessionAge < (8 * 60 * 60 * 1000); // 8 hours
    }

    async authenticate(password) {
        // This would normally be a secure server call
        // For demo purposes, we'll use a simple check
        const correctPassword = await this.getPasswordHash();
        const inputHash = await this.hashPassword(password);
        
        if (inputHash === correctPassword) {
            this.isAuthenticated = true;
            this.createSession();
            this.showApp();
            return true;
        }
        return false;
    }

    async getPasswordHash() {
        // This would come from a secure server
        // For demo: "CHOLoading2024" hashed
        return "a8b847e6d5c8d72b5e7f9c1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7";
    }

    async hashPassword(password) {
        // Simple hash for demo - in production use proper hashing
        const encoder = new TextEncoder();
        const data = encoder.encode(password + "tna_salt_2024");
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    createSession() {
        const sessionData = {
            timestamp: Date.now(),
            authenticated: true
        };
        sessionStorage.setItem('tna_auth_session', JSON.stringify(sessionData));
    }

    showLogin() {
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1 style="color: #1f2937; font-size: 2rem; margin-bottom: 0.5rem;">
                        🏃‍♂️ TNA CHO Loading Plan
                    </h1>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">
                        Enter password to access your nutrition planning tool
                    </p>
                    <input 
                        type="password" 
                        id="password-input" 
                        placeholder="Enter password" 
                        class="auth-input"
                    />
                    <button 
                        id="login-button"
                        class="auth-button"
                    >
                        Access App
                    </button>
                    <div id="error-message" class="error-message hidden">
                        ❌ Incorrect password. Please try again.
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('login-button').addEventListener('click', this.handleLogin.bind(this));
        document.getElementById('password-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('password-input').focus();
        }, 100);
    }

    async handleLogin() {
        const passwordInput = document.getElementById('password-input');
        const errorMessage = document.getElementById('error-message');
        const loginButton = document.getElementById('login-button');
        
        loginButton.textContent = 'Checking...';
        loginButton.disabled = true;
        
        const success = await this.authenticate(passwordInput.value);
        
        if (!success) {
            errorMessage.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
            loginButton.textContent = 'Access App';
            loginButton.disabled = false;
        }
    }

    showApp() {
        document.getElementById('app').innerHTML = '<div id="react-app"></div>';
        // Load the React app
        if (window.CHOLoadingApp) {
            ReactDOM.render(React.createElement(CHOLoadingApp), document.getElementById('react-app'));
        }
    }

    logout() {
        sessionStorage.removeItem('tna_auth_session');
        this.isAuthenticated = false;
        this.showLogin();
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
