function Login() {
  return (
    <div className="login-page">

      <div className="login-container">

        <div className="brand-section">
          <div className="milk-icon">🥛</div>

          <h1>MilkMate</h1>

          <p>
            Milk Delivery Management System
          </p>
        </div>

        <div className="login-card">

          <h2>Welcome Back 👋</h2>

          <p className="login-subtitle">
            Login to manage your milk deliveries
          </p>

          <form>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;