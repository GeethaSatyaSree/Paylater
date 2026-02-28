export default function StatCard({ label, value, icon, color = 'primary', sub }) {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-body">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
                {sub && <div className="stat-sub">{sub}</div>}
            </div>
        </div>
    );
}
