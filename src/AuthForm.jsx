// src/AuthForm.jsx

import { useState } from 'react';

// isRegister is a boolean prop to switch between Login and Register modes
function AuthForm({ isRegister, onSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the page from reloading on form submission
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>
    );
}

export default AuthForm;
