import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      {/* Nav style */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <div className="container">
          {/* Nav-brand */}
          <Link className="navbar-brand" to="/">
            <i className="fas fa-graduation-cap me-2"></i>Edumanage
          </Link>

          {/* Hamburger button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible content */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#quick-access">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <h1 className="display-4 mb-4">Welcome to Edumanage</h1>
              <p className="lead mb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                unde pariatur quam error possimus quisquam expedita hic dolorum
                voluptas, porro laudantium fugit! Dolore ipsam laudantium modi,
                veritatis optio natus ipsa.
              </p>

              <Link to="/login" className="btn btn-light btn-lg me-3">
                Get Started
              </Link>

              <a href="#features" className="btn  btn-outline-light btn-lg ">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4">
              <h2 className="text-center text-lg-start section-title">
                About Our School
              </h2>

              <p className="lead">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deleniti consequuntur aliquam quas eos dolore odit, fugit nulla
                iusto quo rerum, perferendis, iure sequi dolor et totam beatae!
                Officia, temporibus quam!
              </p>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Voluptates id quisquam soluta at magnam necessitatibus
                reprehenderit magni delectus libero obcaecati recusandae ad
                veritatis sunt itaque, quo eveniet, impedit amet repudiandae.
              </p>

              {/* List of acievements */}
              <ul className="list-unstyled">
                <li className="mb-2">
                  {" "}
                  <i className="fas fa-check text-success"></i>Award Winning
                  Academic Progress
                </li>
                <li className="mb-2">
                  {" "}
                  <i className="fas fa-check text-success"></i>Experience
                  Dedicated Facaulty
                </li>
                <li className="mb-2">
                  {" "}
                  <i className="fas fa-check text-success"></i>Modern facilities
                  and Resources
                </li>
                <li className="mb-2">
                  {" "}
                  <i className="fas fa-check text-success"></i>Strong Community
                  and Partnership
                </li>
              </ul>
            </div>

            {/* Second half of the page */}
            <div className="col-md-6 text-center">
              <img src="sch.jpg" className="img-fluid rounded shadow" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section divide into three parts, accesed by the id deatures from navlink features */}
      <section id="features" py-5>
        <div className="container">
          <h2 className="section-title text-center">Features</h2>
          <div className="row text-center">
            {/* Divide the first part which will span 4 columns */}
            <div className="col-md-4 mb-4">
              {/* card */}
              <div className="card shadow-sm p-4">
                <i className="fas fa-user-graduate fa-3x mb-3 text-primary"></i>
                <h5>Student Management</h5>
                <p className="text-muted">
                  Track Performace, attendance and records in one place
                </p>
              </div>
            </div>

            {/* End of first part */}

            <div className="col-md-4 mb-4">
              <div className="card shadow p-4">
                <i className="fas fa-chalkboard-teacher fa-3x mb-3 text-primary"></i>
                <h5>Lecturer Tools</h5>
                <p className="text-muted">
                  Manage Courses, Assignments and Student Progress Easily
                </p>
              </div>
            </div>

            {/* Part 3 */}
            <div className="col-md-4 mb-4">
              <div className="card shadow p-4">
                <i className="fas fa-user-cog fa-3x mb-3 text-primary"></i>
                <h5>Admin Roles</h5>
                <p className="text-muted">
                  Control access, create accounts and Manage Resources
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Quick Access Section*/}
      <section
        id="quick-access"
        className="d-flex flex-column align-items-center justify-content-center bg-light mt-4 vh-100"
      >
        <div className="text-center p-5 shadow rounded bg-white">
          <h1 className="mb-4">
            {" "}
            <i className="fas fa-graduation-cap"></i>Student Management
          </h1>
          <p className="mb-4 text-muted">
            Please Login with credentials provided by the institution
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <Link
              to="/login"
              className="btn btn-primary btn-lg w-100"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
              }}
            >
              {" "}
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section divide to 3 parts */}
      <section
        id="contact"
        className="py-5 mt-4 text-light"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
        }}
      >
        <div className="container">
          <h2 className="section-title text-center">Contact Us</h2>
          <div className="row mx-auto">
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-map-marker-alt"></i>
              <h6>Adress</h6>
              <p>
                Nairobi, Kenya
                <br />
                WestPoint Mpaka Road, 6th floor
              </p>
            </div>

            {/* Phone */}
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-phone"></i>
              <h6>Phone</h6>
              <p>
                +254711122233 <br />
                +254711122244
              </p>
            </div>

            {/* Email */}
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-envelope"></i>
              <h6>Email</h6>
              <p>
                info@edumanage.com
                <br />
                support@edumanage.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center bg-dark text-light">
        <div className="container">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Edumanage All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
