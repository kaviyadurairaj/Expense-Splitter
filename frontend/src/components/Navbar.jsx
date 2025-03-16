import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/expense-form">Expenses</Link>
      <Link to="/expense-list">Expense List</Link>
      <Link to="/balance-sheet">Balance Sheet</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  );
};

export default Navbar;
