
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import BalanceSheet from "./components/BalanceSheet";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import "./App.css";
import logo from "./images/logo1.png";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true); // ✅ Loading state

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      fetchExpenses();
      fetchMembers();
    }
  }, [isLoggedIn]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/expense", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("❌ Error fetching expenses:", error);
    }
  };

  const fetchMembers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found. Please log in again.");
      setIsLoadingMembers(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/members", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch members");

      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("❌ Error fetching members:", error);
    }

    setIsLoadingMembers(false);
  };

  const addExpense = async (expense) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(expense),
      });
  
      if (!res.ok) throw new Error("Failed to add expense");
  
      await fetchExpenses(); // ✅ Ensure expenses are fetched before navigating
  
      setTimeout(() => navigate("/balance-sheet"), 200); // ✅ Small delay to ensure state updates
    } catch (error) {
      console.error("❌", error);
    }
  };
  

  const deleteExpense = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/expense/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete expense");
      fetchExpenses();
    } catch (error) {
      console.error("❌", error);
    }
  };

  const addMember = async (member) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: member }),
      });
  
      if (!res.ok) throw new Error("Failed to add member");
  
      setMembers((prev) => [...prev, { name: member, _id: Date.now().toString() }]); // ✅ Add instantly
      fetchMembers(); // ✅ Then fetch the latest data
    } catch (error) {
      console.error("❌", error);
    }
  };
  

  const removeMember = async (member) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/members/${member}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to remove member");
      fetchMembers();
    } catch (error) {
      console.error("❌", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Expense Splitter Logo" className="logo" />
          <h1 className="app-title">Expense Splitter</h1>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/expense-form" className="nav-link">Expense Form</Link>
              <Link to="/expense-list" className="nav-link">Expense List</Link>
              <Link to="/balance-sheet" className="nav-link">Balance Sheet</Link>
              <button className="nav-link logout-button" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
          <Route 
            path="/expense-form" 
            element={isLoggedIn ? <ExpenseForm addExpense={addExpense} addMember={addMember} removeMember={removeMember} members={members} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/expense-list" 
            element={isLoggedIn ? <ExpenseList expenses={expenses} deleteExpense={deleteExpense} /> : <Navigate to="/login" />} 
          />
          <Route 
  path="/balance-sheet" 
  element={
    isLoggedIn ? (
      isLoadingMembers || expenses.length === 0 ? ( // ✅ Wait for both members & expenses
        <p>⏳ Loading...</p>
      ) : (
        <BalanceSheet expenses={expenses} members={members} />
      )
    ) : (
      <Navigate to="/login" />
    )
  } 
/>

        </Routes>
      </main>
    </div>
  );
}

const Home = () => (
  <section className="welcome">
    <h2>Welcome to Expense Splitter</h2>
    <p>Easily split expenses with friends and keep track of balances effortlessly.</p>
    <div className="auth-buttons">
      <Link to="/login" className="button login-button">Login</Link>
      <Link to="/signup" className="button signup-button">Sign Up</Link>
    </div>
  </section>
);

export default App;
