import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMe } from '../api/authApi';
import { getMyTransactions } from '../api/transactionsApi';
import { getUserDues } from '../api/reportsApi';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

export default function Dashboard() {
    const { user, loginUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [dues, setDues] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const meRes = await getMe();
                setProfile(meRes.data);
                loginUser(localStorage.getItem('token'), meRes.data);

                const txRes = await getMyTransactions();
                setTransactions(txRes.data);

                const duesRes = await getUserDues(meRes.data.name);
                setDues(duesRes.data.dues);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const creditUsed = dues;
    const available = profile ? Math.max(0, profile.credit_limit - creditUsed) : 0;
    const successTxns = transactions.filter((t) => t.status === 'success');
    const rejectedTxns = transactions.filter((t) => t.status === 'rejected');

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-sub">Welcome back, <strong>{profile?.name || user?.name}</strong> 👋</p>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <div className="spinner-border text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div className="stats-grid">
                            <StatCard label="Credit Limit" value={`₹${profile?.credit_limit?.toFixed(2)}`} icon="🏦" color="blue" />
                            <StatCard label="Dues Owed" value={`₹${dues.toFixed(2)}`} icon="📋" color="red" />
                            <StatCard label="Available Credit" value={`₹${available.toFixed(2)}`} icon="💚" color="green" />
                            <StatCard label="Total Transactions" value={transactions.length} icon="💳" color="purple" sub={`${successTxns.length} success · ${rejectedTxns.length} rejected`} />
                        </div>

                        {/* Credit Usage Bar */}
                        <div className="card-glass mt-4">
                            <h5 className="section-title">Credit Usage</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Used: ₹{creditUsed.toFixed(2)}</span>
                                <span className="text-muted small">Limit: ₹{profile?.credit_limit?.toFixed(2)}</span>
                            </div>
                            <div className="progress" style={{ height: '12px', borderRadius: '8px' }}>
                                <div
                                    className={`progress-bar ${creditUsed / profile?.credit_limit > 0.8 ? 'bg-danger' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(100, (creditUsed / (profile?.credit_limit || 1)) * 100)}%`, borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="card-glass mt-4">
                            <h5 className="section-title">Recent Transactions</h5>
                            {transactions.length === 0 ? (
                                <div className="empty-state">No transactions yet.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table custom-table">
                                        <thead>
                                            <tr>
                                                <th>Merchant</th>
                                                <th>Amount</th>
                                                <th>Fee</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.slice(0, 5).map((t) => (
                                                <tr key={t.id}>
                                                    <td>Merchant #{t.merchant_id}</td>
                                                    <td>₹{t.amount.toFixed(2)}</td>
                                                    <td>₹{t.fee_amount.toFixed(2)}</td>
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
                    </>
                )}
            </main>
        </div>
    );
}
