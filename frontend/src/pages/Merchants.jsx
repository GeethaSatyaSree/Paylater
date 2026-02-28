import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getMerchants, createMerchant, updateMerchantFee } from '../api/merchantsApi';

export default function Merchants() {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editMerchant, setEditMerchant] = useState(null);
    const [addForm, setAddForm] = useState({ name: '', fee_percentage: '' });
    const [editFee, setEditFee] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchMerchants = async () => {
        try {
            const res = await getMerchants();
            setMerchants(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMerchants(); }, []);

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createMerchant(addForm.name, parseFloat(addForm.fee_percentage));
            showMsg('success', `Merchant "${addForm.name}" added successfully!`);
            setAddForm({ name: '', fee_percentage: '' });
            setShowAdd(false);
            fetchMerchants();
        } catch (err) {
            showMsg('danger', err.response?.data?.detail || 'Failed to add merchant.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateFee = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await updateMerchantFee(editMerchant.name, parseFloat(editFee));
            showMsg('success', `Fee updated for "${editMerchant.name}"!`);
            setEditMerchant(null);
            fetchMerchants();
        } catch (err) {
            showMsg('danger', err.response?.data?.detail || 'Failed to update fee.');
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
                        <h1 className="page-title">Merchants</h1>
                        <p className="page-sub">Manage merchant registrations and fee rates.</p>
                    </div>
                    <button className="btn-action" onClick={() => setShowAdd(!showAdd)}>
                        {showAdd ? '✕ Cancel' : '+ Add Merchant'}
                    </button>
                </div>

                {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

                {/* Add Merchant Form */}
                {showAdd && (
                    <div className="card-glass mb-4">
                        <h5 className="section-title">Add New Merchant</h5>
                        <form onSubmit={handleAdd} className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label">Merchant Name</label>
                                <input
                                    className="form-control custom-input"
                                    placeholder="e.g. Amazon"
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Fee Percentage (%)</label>
                                <input
                                    type="number"
                                    className="form-control custom-input"
                                    placeholder="e.g. 2.5"
                                    value={addForm.fee_percentage}
                                    onChange={(e) => setAddForm({ ...addForm, fee_percentage: e.target.value })}
                                    step="0.01" min="0" max="100" required
                                />
                            </div>
                            <div className="col-md-3 d-flex align-items-end">
                                <button className="btn-action w-100" type="submit" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Merchant'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Edit Fee Modal */}
                {editMerchant && (
                    <div className="modal-overlay">
                        <div className="modal-card">
                            <h5>Update Fee — {editMerchant.name}</h5>
                            <form onSubmit={handleUpdateFee}>
                                <label className="form-label mt-2">New Fee Percentage (%)</label>
                                <input
                                    type="number"
                                    className="form-control custom-input"
                                    value={editFee}
                                    onChange={(e) => setEditFee(e.target.value)}
                                    step="0.01" min="0" max="100" required
                                />
                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn-action" type="submit" disabled={submitting}>
                                        {submitting ? 'Updating...' : 'Update'}
                                    </button>
                                    <button className="btn-ghost" type="button" onClick={() => setEditMerchant(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Merchants Table */}
                <div className="card-glass">
                    {loading ? (
                        <div className="d-flex justify-content-center py-4">
                            <div className="spinner-border text-primary" />
                        </div>
                    ) : merchants.length === 0 ? (
                        <div className="empty-state">No merchants yet. Add one above!</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table custom-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Fee %</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {merchants.map((m, i) => (
                                        <tr key={m.id}>
                                            <td>{i + 1}</td>
                                            <td><strong>{m.name}</strong></td>
                                            <td><span className="badge-fee">{m.fee_percentage}%</span></td>
                                            <td>{new Date(m.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="btn-sm-action"
                                                    onClick={() => { setEditMerchant(m); setEditFee(m.fee_percentage); }}
                                                >
                                                    ✏️ Edit Fee
                                                </button>
                                            </td>
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
