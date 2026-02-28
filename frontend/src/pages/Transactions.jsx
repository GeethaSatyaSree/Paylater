import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getAllTransactions, createTransaction } from '../api/transactionsApi';
import { getMerchants } from '../api/merchantsApi';
import { useAuth } from '../contexts/AuthContext';

export default function Transactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ user_name: '', merchant_name: '', amount: '' });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchAll = async () => {
        try {
            const [txRes, mRes] = await Promise.all([getAllTransactions(), getMerchants()]);
            setTransactions(txRes.data);
            setMerchants(mRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        if (user?.name) setForm((f) => ({ ...f, user_name: user.name }));
    }, [user]);

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await createTransaction(form.user_name, form.merchant_name, parseFloat(form.amount));
            if (res.data.status === 'success') {
                showMsg('success', '✅ Transaction successful!');
            } else {
                showMsg('warning', `⚠️ Transaction rejected: ${res.data.reason}`);
            }
            setForm((f) => ({ ...f, merchant_name: '', amount: '' }));
            setShowForm(false);
            fetchAll();
        } catch (err) {
            showMsg('danger', err.response?.data?.detail || 'Transaction failed.');
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
                        <h1 className="page-title">Transactions</h1>
                        <p className="page-sub">All transactions across the platform.</p>
                    </div>
                    <button className="btn-action" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ New Transaction'}
                    </button>
                </div>

                {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

                {/* New Transaction Form */}
                {showForm && (
                    <div className="card-glass mb-4">
                        <h5 className="section-title">Create Transaction</h5>
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">User Name</label>
                                <input
                                    className="form-control custom-input"
                                    value={form.user_name}
                                    onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                                    placeholder="e.g. user1"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Merchant</label>
                                <select
                                    className="form-select custom-input"
                                    value={form.merchant_name}
                                    onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
                                    required
                                >
                                    <option value="">Select merchant...</option>
                                    {merchants.map((m) => (
                                        <option key={m.id} value={m.name}>{m.name} ({m.fee_percentage}% fee)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Amount (₹)</label>
                                <input
                                    type="number"
                                    className="form-control custom-input"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    placeholder="500"
                                    min="1" step="0.01" required
                                />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button className="btn-action w-100" type="submit" disabled={submitting}>
                                    {submitting ? 'Processing...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="card-glass">
                    {loading ? (
                        <div className="d-flex justify-content-center py-4">
                            <div className="spinner-border text-primary" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">No transactions found.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table custom-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User</th>
                                        <th>Merchant</th>
                                        <th>Amount</th>
                                        <th>Fee</th>
                                        <th>Payout</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, i) => (
                                        <tr key={t.id}>
                                            <td>{i + 1}</td>
                                            <td>User #{t.user_id}</td>
                                            <td>Merchant #{t.merchant_id}</td>
                                            <td>₹{t.amount.toFixed(2)}</td>
                                            <td>₹{t.fee_amount.toFixed(2)}</td>
                                            <td>₹{t.merchant_payout.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge-status ${t.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td>{new Date(t.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
