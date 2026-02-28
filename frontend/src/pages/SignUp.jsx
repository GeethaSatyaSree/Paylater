import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../api/authApi';

export default function SignUp() {
    const [form, setForm] = useState({ name: '', email: '', password: '', credit_limit: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, parseFloat(form.credit_limit) || 0);
            // Auto-login after register
            const loginRes = await login(form.email, form.password);
            loginUser(loginRes.data.access_token, { name: form.name, email: form.email });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="auth-brand">💸 PayLater</Link>
                <h1 className="auth-title">Create account</h1>
                <p className="auth-sub">Start managing your credit today</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control custom-input"
                            placeholder="johndoe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control custom-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control custom-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label className="form-label">Credit Limit (₹)</label>
                        <input
                            type="number"
                            name="credit_limit"
                            className="form-control custom-input"
                            placeholder="1000"
                            value={form.credit_limit}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-submit mt-4"
                        disabled={loading}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account?{' '}
                    <Link to="/signin" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
