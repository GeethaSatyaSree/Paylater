import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/merchants', label: '🏪 Merchants' },
    { to: '/transactions', label: '💳 Transactions' },
    { to: '/paybacks', label: '💰 Paybacks' },
    { to: '/reports', label: '📊 Reports' },
];

export default function Sidebar() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className="sidebar d-flex flex-column">
            {/* Brand */}
            <div className="sidebar-brand">
                <span className="brand-icon">💸</span>
                <span className="brand-text">PayLater</span>
            </div>

            {/* User Info */}
            {user && (
                <div className="sidebar-user">
                    <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                    <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                    </div>
                </div>
            )}

            {/* Nav Links */}
            <nav className="sidebar-nav flex-grow-1">
                {navLinks.map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <button className="sidebar-logout" onClick={handleLogout}>
                🚪 Logout
            </button>
        </div>
    );
}
