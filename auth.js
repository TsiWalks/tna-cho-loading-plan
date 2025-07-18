class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.reactRoot = null;
        this.init();
    }

    init() {
        // Check if user is already authenticated
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
        const now = Date.now();
        const sessionAge = now - sessionData.timestamp;
        return sessionAge < (8 * 60 * 60 * 1000); // 8 hours
    }

    async authenticate(password) {
        // Simple password check for demo
        if (password === "CHOLoading2024") {
            this.isAuthenticated = true;
            this.createSession();
            this.showApp();
            return true;
        }
        return false;
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

        document.getElementById('login-button').addEventListener('click', this.handleLogin.bind(this));
        document.getElementById('password-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
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
        
        // Use React 18 createRoot instead of render
        if (this.reactRoot) {
            this.reactRoot.unmount();
        }
        
        const container = document.getElementById('react-app');
        this.reactRoot = ReactDOM.createRoot(container);
        this.reactRoot.render(React.createElement(CHOLoadingApp));
    }

    logout() {
        sessionStorage.removeItem('tna_auth_session');
        this.isAuthenticated = false;
        if (this.reactRoot) {
            this.reactRoot.unmount();
            this.reactRoot = null;
        }
        this.showLogin();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
