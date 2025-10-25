// Import necessary dependencies
import React, { useEffect, useState } from "react";
import axios from "axios"; // For making HTTP requests
import { ToastContainer, toast } from "react-toastify"; // For displaying success/error notifications
import "react-toastify/dist/ReactToastify.css";

// AdminUsers Component — handles user management (CRUD operations)
const AdminUsers = ({ token }) => {
  // ------------------ STATE VARIABLES ------------------

  // Store all users fetched from backend
  const [users, setUsers] = useState([]);

  // Loading state while fetching users
  const [loading, setLoading] = useState(false);

  // ------------------ FETCH USERS ------------------
  // Function to retrieve all users from backend
  async function fetchUsers() {
    setLoading(true); // Show loading spinner
    try {
      // Make GET request to users API with authorization token
      const res = await axios.get(
        "https://schoolbackend-kbhx.onrender.com/api/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save retrieved users in state
      setUsers(res.data.users || []);
    } catch (error) {
      console.log("Error fetching users", error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  }

  // Fetch users when token is available or changes
  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // ------------------ CREATE USER ------------------
  // State for storing input data for new user
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Function to create a new user
  async function createUser(e) {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send POST request to create a new user
      await axios.post(
        "https://schoolbackend-kbhx.onrender.com/api/users",
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset input fields
      setNewUser({ name: "", email: "", password: "", role: "" });

      // Refresh users list
      fetchUsers();

      // Show success message
      toast.success("User created successfully!", {
        position: "top-center",
        autoClose: 2500,
      });
    } catch (error) {
      // Show error message
      toast.error("Error creating user. Try again.", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  }

  // ------------------ EDIT USER ------------------
  // Stores the user currently being edited
  const [editUser, setEditUser] = useState(null);

  // Stores the form data for editing a user
  const [editForm, setForm] = useState({ name: "", email: "", role: "" });

  // Function to open edit modal and load user data into form
  function startEdit(user) {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  }

  // Function to handle updating a user's details
  async function handleUpdateUser() {
    try {
      await axios.put(
        `https://schoolbackend-kbhx.onrender.com/api/users/${editUser._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditUser(null); // Close edit modal
      fetchUsers(); // Refresh users list

      toast.success("User updated successfully!", {
        position: "top-center",
        autoClose: 2500,
      });
    } catch (error) {
      toast.error("Error updating user.", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  }

  // ------------------ DELETE USER ------------------
  // Stores the user selected for deletion
  const [deleteUser, setDeleteUser] = useState(null);

  // Function to delete user by ID
  async function handleDeleteUser() {
    try {
      await axios.delete(
        `https://schoolbackend-kbhx.onrender.com/api/users/${deleteUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDeleteUser(null); // Close delete modal
      fetchUsers(); // Refresh user list

      toast.success("User deleted successfully!", {
        position: "top-center",
        autoClose: 2500,
      });
    } catch (error) {
      toast.error("Error deleting user.", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  }

  // ------------------ UI RENDER ------------------
  return (
    <div className="container py-4">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Header Section */}
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-1">User Management</h4>
        <p className="text-muted">Add, view, edit, and remove users easily.</p>
      </div>

      {/* ------------------ ADD NEW USER FORM ------------------ */}
      <div className="col-md-6 mx-auto">
        <div className="card shadow-sm border-0 rounded-3 mb-5">
          <div className="card-body">
            <h6 className="fw-bold mb-3 text-primary">Add New User</h6>

            {/* Create User Form */}
            <form onSubmit={createUser}>
              {/* Full Name Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  required
                >
                  <option value="">Select Role...</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary rounded-pill">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ------------------ USERS LIST ------------------ */}
      <div>
        <h6 className="fw-bold mb-3 text-secondary">All Users</h6>

        {/* Conditional rendering: loading, no data, or list */}
        {loading ? (
          <p className="alert alert-info text-center">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-muted text-center">No users found.</p>
        ) : (
          <div className="row">
            {users.map((user) => (
              <div className="col-md-4 mb-3" key={user._id}>
                <div className="card shadow-sm border-0 rounded-3 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">{user.name}</h6>
                    <p className="text-muted mb-1 small">{user.email}</p>

                    {/* Role Badge */}
                    <span
                      className="badge bg-light text-dark border mb-3"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {user.role}
                    </span>

                    {/* Edit and Delete Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => setDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------ EDIT USER MODAL ------------------ */}
      {editUser && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              {/* Modal Header */}
              <div className="modal-header border-0 bg-primary rounded-top-4">
                <h5 className="modal-title fw-semibold text-light">
                  Edit User Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body px-4 py-3">
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Name</label>
                  <input
                    type="text"
                    className="form-control rounded-pill shadow-sm"
                   
                  />
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control rounded-pill shadow-sm"
                    
                  />
                </div>

                {/* Role Selector */}
                <div className="mb-2">
                  <label className="form-label fw-medium">Role</label>
                  <select
                    className="form-select rounded-pill shadow-sm"
                    
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-0 d-flex justify-content-end gap-2 px-4 pb-3">
                <button
                  className="btn btn-outline-danger rounded-pill px-4"
                 
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-pill px-4"
                 
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ DELETE CONFIRMATION MODAL ------------------ */}
      {deleteUser && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              {/* Modal Header */}
              <div className="modal-header bg-danger text-center text-white rounded-top-4">
                <h5 className="modal-title fw-semibold">Confirm Delete</h5>
                <button
                  className="btn-close btn-close-white"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body text-center py-4">
                <p className="mb-0 fs-5">
                  Are you sure you want to delete{" "}
                  <strong className="text-danger">{deleteUser.name}</strong>?
                </p>
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer justify-content-center border-0 pb-4">
                <button
                  className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
                  
                >
                  Yes, Delete
                </button>
                <button
                  className="btn btn-light border px-4 py-2 rounded-pill fw-semibold"
                
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export component
export default AdminUsers;
