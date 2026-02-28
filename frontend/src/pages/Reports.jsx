import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
    getMerchantFee,
    getUserDues,
    getUsersAtCreditLimit,
    getTotalDues,
} from '../api/reportsApi';

export default function Reports() {
    const [merchantName, setMerchantName] = useState('');
    const [userName, setUserName] = useState('');
    const [feeReport, setFeeReport] = useState(null);
    const [duesReport, setDuesReport] = useState(null);
    const [limitUsers, setLimitUsers] = useState(null);
    const [totalDues, setTotalDues] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});
    const [errors, setErrors] = useState({});

    const setLoading = (key, val) => setLoadingStates((s) => ({ ...s, [key]: val }));
    const setError = (key, val) => setErrors((s) => ({ ...s, [key]: val }));

    const fetchFee = async (e) => {
        e.preventDefault();
        setLoading('fee', true);
        setError('fee', '');
        try {
            const res = await getMerchantFee(merchantName);
            setFeeReport(res.data);
        } catch (err) {
            setError('fee', err.response?.data?.detail || 'Merchant not found.');
        } finally {
            setLoading('fee', false);
        }
    };

    const fetchDues = async (e) => {
        e.preventDefault();
        setLoading('dues', true);
        setError('dues', '');
        try {
            const res = await getUserDues(userName);
            setDuesReport(res.data);
        } catch (err) {
            setError('dues', err.response?.data?.detail || 'User not found.');
        } finally {
            setLoading('dues', false);
        }
    };

    const fetchLimitUsers = async () => {
        setLoading('limit', true);
        setError('limit', '');
        try {
            const res = await getUsersAtCreditLimit();
            setLimitUsers(res.data);
        } catch (err) {
            setError('limit', 'Failed to fetch data.');
        } finally {
            setLoading('limit', false);
        }
    };

    const fetchTotalDues = async () => {
        setLoading('total', true);
        setError('total', '');
        try {
            const res = await getTotalDues();
            setTotalDues(res.data);
        } catch (err) {
            setError('total', 'Failed to fetch data.');
        } finally {
            setLoading('total', false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Reports</h1>
                        <p className="page-sub">Query platform-wide analytics and financial reports.</p>
                    </div>
                </div>

                <div className="row g-4">

                    {/* Fee Collected per Merchant */}
                    <div className="col-md-6">
                        <div className="card-glass">
                            <h5 className="section-title">💰 Merchant Fee Collected</h5>
                            <form onSubmit={fetchFee} className="d-flex gap-2">
                                <input
                                    className="form-control custom-input"
                                    placeholder="Merchant name..."
                                    value={merchantName}
                                    onChange={(e) => setMerchantName(e.target.value)}
                                    required
                                />
                                <button className="btn-action" type="submit" disabled={loadingStates.fee}>
                                    {loadingStates.fee ? '...' : 'Get'}
                                </button>
                            </form>
                            {errors.fee && <div className="alert alert-danger mt-2 py-2">{errors.fee}</div>}
                            {feeReport && (
                                <div className="report-result mt-3">
                                    <span className="report-result__label">Fee Collected</span>
                                    <span className="report-result__val">₹{feeReport.fee_collected.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dues per User */}
                    <div className="col-md-6">
                        <div className="card-glass">
                            <h5 className="section-title">📋 User Dues</h5>
                            <form onSubmit={fetchDues} className="d-flex gap-2">
                                <input
                                    className="form-control custom-input"
                                    placeholder="User name..."
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                                <button className="btn-action" type="submit" disabled={loadingStates.dues}>
                                    {loadingStates.dues ? '...' : 'Get'}
                                </button>
                            </form>
                            {errors.dues && <div className="alert alert-danger mt-2 py-2">{errors.dues}</div>}
                            {duesReport && (
                                <div className="report-result mt-3">
                                    <span className="report-result__label">Outstanding Dues</span>
                                    <span className="report-result__val">₹{duesReport.dues.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Users at Credit Limit */}
                    <div className="col-md-6">
                        <div className="card-glass">
                            <h5 className="section-title">⚠️ Users at Credit Limit</h5>
                            <button className="btn-action" onClick={fetchLimitUsers} disabled={loadingStates.limit}>
                                {loadingStates.limit ? 'Loading...' : '🔍 Fetch Users'}
                            </button>
                            {errors.limit && <div className="alert alert-danger mt-2 py-2">{errors.limit}</div>}
                            {limitUsers !== null && (
                                <div className="mt-3">
                                    {limitUsers.length === 0 ? (
                                        <div className="alert alert-success py-2">✅ No users at credit limit!</div>
                                    ) : (
                                        <div className="limit-users-list">
                                            {limitUsers.map((u) => (
                                                <span key={u} className="limit-user-badge">🚫 {u}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Dues */}
                    <div className="col-md-6">
                        <div className="card-glass">
                            <h5 className="section-title">🏦 Total Dues — All Users</h5>
                            <button className="btn-action" onClick={fetchTotalDues} disabled={loadingStates.total}>
                                {loadingStates.total ? 'Loading...' : '📊 Fetch Total'}
                            </button>
                            {errors.total && <div className="alert alert-danger mt-2 py-2">{errors.total}</div>}
                            {totalDues !== null && (
                                <div className="mt-3">
                                    <div className="report-result">
                                        <span className="report-result__label">Total Dues</span>
                                        <span className="report-result__val">₹{totalDues.total.toFixed(2)}</span>
                                    </div>
                                    {Object.keys(totalDues.details).length > 0 && (
                                        <div className="table-responsive mt-3">
                                            <table className="table custom-table">
                                                <thead>
                                                    <tr><th>User</th><th>Dues</th></tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(totalDues.details).map(([name, amt]) => (
                                                        <tr key={name}>
                                                            <td>{name}</td>
                                                            <td>₹{amt.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
