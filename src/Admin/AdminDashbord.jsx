import React, { useState } from 'react';

// Your actual components - replace these with your imports
import AdminManageUsers from "./AdminManageUsers";
import AdminCourse from "./AdminCourse";
import AdminStatistics from "./AdminStatistics";
import AdminClassroom from "./AdminClassroom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../App.css";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const AdminDashboard = () => {
  const [active, setActive] = useState("Statistics");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = { name: user.name };

  const menuItems = [
    { name: "Statistics", icon: "fa-chart-line" },
    { name: "Users", icon: "fa-users" },
    { name: "Courses", icon: "fa-book" },
    { name: "Classroom", icon: "fa-chalkboard-teacher" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-primary text-white d-flex flex-column"
        style={{
          width: sidebarCollapsed ? "80px" : "250px",
          transition: "width 0.3s ease",
          minHeight: "100vh",
          position: "fixed", 
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto", 
          zIndex: 1000,
        }}
      >
        {/* Logo/Brand */}
        <div className="p-3 border-bottom border-light border-opacity-25">
          <div className="d-flex align-items-center justify-content-between">
            {!sidebarCollapsed && (
              <h4 className="mb-0 fw-bold">
                <i className="fas fa-graduation-cap me-2"></i>
                EduManage
              </h4>
            )}
            {sidebarCollapsed && (
              <h4 className="mb-0 fw-bold mx-auto">
                <i className="fas fa-graduation-cap"></i>
              </h4>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-grow-1 py-3">
          <div className="px-2">
            {!sidebarCollapsed && (
              <small className="text-white-50 text-uppercase px-3 d-block mb-2">
                Admin Menu
              </small>
            )}
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`btn w-100 text-start mb-2 d-flex align-items-center ${
                  active === item.name
                    ? "btn-light text-primary"
                    : "btn-link text-white text-decoration-none"
                }`}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  border: "none",
                }}
              >
                <i
                  className={`fas ${item.icon} ${
                    sidebarCollapsed ? "mx-auto" : "me-3"
                  }`}
                ></i>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Toggle Button */}
        <div className="p-3 border-top border-light border-opacity-25">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn btn-outline-light w-100"
            style={{ borderRadius: "8px" }}
          >
            <i
              className={`fas fa-chevron-${
                sidebarCollapsed ? "right" : "left"
              }`}
            ></i>
            {!sidebarCollapsed && <span className="ms-2">Collapse Sidebar</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          backgroundColor: "#f8f9fa",
          marginLeft: sidebarCollapsed ? "80px" : "250px",
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      >
        {/* Top Bar */}
        <nav className="navbar navbar-light bg-white shadow-sm sticky-top">
          <div className="container-fluid px-4">
            <h5 className="mb-0 fw-bold text-primary">{active}</h5>
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-2"></i>
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-user me-2"></i>Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <button
                    className="btn btn-sm justify-content-center"
                    onClick={handleLogout}
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </a>
                    </li>
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {active === "Statistics" && <AdminStatistics token={token} />}
              {active === "Users" && (
                <AdminManageUsers token={token} loggedInUser={loggedInUser} />
              )}
              {active === "Courses" && <AdminCourse token={token} />}
              {active === "Classroom" && <AdminClassroom token={token} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
