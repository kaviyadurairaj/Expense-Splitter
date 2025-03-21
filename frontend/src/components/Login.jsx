
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; 
import "./Auth.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });


      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId); 
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);

      alert("✅ Login successful!");
      navigate("/expense-form"); 
    } catch (error) {
      alert(error.response?.data?.message || "❌ Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

