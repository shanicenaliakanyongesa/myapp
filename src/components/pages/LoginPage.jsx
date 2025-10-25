import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hook to navigate
  const navigate = useNavigate();

  // Create a function to handle  logging in
  async function handlesubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Try login, get a response, store token for future requests, store user at a global accessible file(App.js)

    try {
      // send request=>Get a response
      const res = await axios.post(
        "https://schoolbackend-kbhx.onrender.com/api/auth/login",
        { email, password }
      );
      // View data
      console.log(res.data);
      //Get user
      const user = res.data;
      console.log("User:", user);

      //Get token
      const token = res.data.token;
      console.log("Token:", token);

      //Get role
      const role = res.data.role;
      console.log("Role:", role);

      if (!token) {
        setError("Login Failed, please contact system support!");
        return;
      }

      // Store user and token at local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Depending on role, someone should be navigated to his or her own dashbo0ard

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/student");
      } else {
        navigate("/teacher");
      }
    } catch (error) {
      console.log("Login Error", error);
      setError(
        error.response?.data?.message || "Login Failed, Please Try again"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
      }}
    >
      <div className="card shadow p-4 border-0" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <i className="fas fa-user-graduate fa-3x text-primary mb-2"></i>
          <h4 className="fw-bold">Welcome Back</h4>
          <p className="text-muted mb-0">Login to Continue</p>
        </div>

        {/*Display error message if any  */}

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handlesubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded-pill"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control rounded-pill"
              required
            />
          </div>

          <button
            className="btn btn-primary w-100 rounded-pill mb-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
