import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach the token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => Promise.reject(error));



// Signup API Call
export const signup = (userData) => API.post("/auth/signup", userData);

// Login API Call
export const login = (userData) => API.post("/auth/login", userData);

// Expense API Calls
export const getExpenses = () => API.get("/expense");
export const addExpense = (expenseData) => API.post("/expense", expenseData);

// Member API Calls
export const getMembers = () => API.get("/members");
export const addMember = (memberData) => API.post("/members", memberData);
export const removeMember = (id) => API.delete(`/members/${id}`);
