function StatCard({ icon, title, value, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      <p className="stat-title">{title}</p>

      <p className="stat-description">
        {description}
      </p>
    </div>
  );
}

export default StatCard;