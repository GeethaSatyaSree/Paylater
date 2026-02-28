import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { createPayback } from '../api/paybacksApi';
import { useAuth } from '../contexts/AuthContext';

export default function Paybacks() {
    const { user } = useAuth();
    const [form, setForm] = useState({ user_name: user?.name || '', amount: '' });
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);
        try {
            const res = await createPayback(form.user_name, parseFloat(form.amount));
            setResult(res.data);
            showMsg('success', `✅ Payment of ₹${form.amount} recorded successfully!`);
            setForm((f) => ({ ...f, amount: '' }));
        } catch (err) {
            showMsg('danger', err.response?.data?.detail || 'Payback failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Paybacks</h1>
                        <p className="page-sub">Pay off your outstanding dues — fully or partially.</p>
                    </div>
                </div>

                {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

                <div className="row g-4">
                    {/* Pay Form */}
                    <div className="col-md-6">
                        <div className="card-glass h-100">
                            <h5 className="section-title">Make a Payment</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">User Name</label>
                                    <input
                                        className="form-control custom-input"
                                        value={form.user_name}
                                        onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                                        placeholder="e.g. user1"
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label className="form-label">Amount to Pay (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control custom-input"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        placeholder="e.g. 500"
                                        min="1" step="0.01" required
                                    />
                                    <small className="text-muted">You can pay partially — system will cap at your actual dues.</small>
                                </div>
                                <button className="btn-action mt-4 w-100" type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                                    ) : '💰 Submit Payment'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="col-md-6">
                        <div className="card-glass h-100 d-flex flex-column justify-content-center align-items-center">
                            {result ? (
                                <div className="result-card">
                                    <div className="result-icon">🎉</div>
                                    <h4>Payment Recorded</h4>
                                    <p className="text-muted">User: <strong>{result.user_name}</strong></p>
                                    <div className="result-dues">
                                        <span className="result-dues__label">Remaining Dues</span>
                                        <span className="result-dues__val">₹{result.remaining_dues.toFixed(2)}</span>
                                    </div>
                                    {result.remaining_dues === 0 && (
                                        <div className="alert alert-success mt-3 text-center">
                                            🎊 All dues cleared!
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem' }}>💳</div>
                                    <p className="mt-3 text-muted">Payment result will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
