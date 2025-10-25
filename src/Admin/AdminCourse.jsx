// Importing necessary packages and components
import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const AdminCourse = ({ token }) => {
  // ✅ Step 1: Store the form input data
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    teacher: "",
  });

  // ✅ Step 2: Function to create a new course
  async function CreateCourse(e) {
    e.preventDefault();
    try {
      await axios.post(
        "https://schoolbackend-kbhx.onrender.com/api/courses",
        newCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCourse({ name: "", description: "", teacher: "" });
      toast.success("✅ Course created successfully!");
      fetchCourse();
    } catch (error) {
      console.log("Error Creating Course", error);
      toast.error("❌ Error creating course. Please try again.");
    }
  }

  // ✅ Step 3: Fetch all users (teachers)
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch {
      console.log("Error Fetching Users");
    }
  }

  // ✅ Step 4: Filter to get only teachers
  const teachers = users.filter((user) => user.role === "teacher");

  // ✅ Step 5: Fetch all courses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchCourse() {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://schoolbackend-kbhx.onrender.com/api/courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(response.data.courses || []);
      toast.info("📚 Courses loaded successfully!");
    } catch (error) {
      toast.error("⚠️ Error fetching courses");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Step 6: Load users and courses when component mounts
  useEffect(() => {
    fetchUsers();
    fetchCourse();
  }, [token]);

  // ================================================================
  // ✅ STEP 8: EDIT COURSE SECTION
  // ================================================================

  // Store the course being edited (used to show/hide the modal)
  const [editCourse, setEditCourse] = useState(null);

  // Store the input data while editing
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    teacher: "",
  });

  // 👉 Function to capture the course data when the "Edit" button is clicked
  function clickEdit(course) {
    // Save the selected course to state
    setEditCourse(course);

    // Pre-fill the edit form with existing values
    setEditForm({
      name: course.name,
      description: course.description || "",
      teacher: course.teacher?._id || "",
    });
  }

  // 👉 Function to handle saving the edited course
  async function handleUpdateCourse() {
    try {
      // Send PUT request to update course by ID
      await axios.put(
        `https://schoolbackend-kbhx.onrender.com/api/courses/${editCourse._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Close the modal and refresh the course list
      setEditCourse(null);
      fetchCourse();
      toast.success("✅ Course updated successfully!");
    } catch (error) {
      toast.error("❌ Error updating course");
    }
  }

  // Delete course
  const [deletecourse, setDeleteCourse] = useState(null);

  function startDelete(course) {
    setDeleteCourse(course);
  }
  async function handleDelete() {
    try {
      await axios.delete(
        `https://schoolbackend-kbhx.onrender.com/api/courses/${deletecourse._id}`,
        { headers: { Authorization: `Bearer${token}` } }
      );
      setDeleteCourse(null);
      fetchCourse();
    } catch (error) {
      toast.error("Error Deleting User");
    }
  }

  // ================================================================

  return (
    <div className="container my-5">
      {/* ================================
          COURSE CREATION FORM SECTION
      ================================= */}
      <div className="card shadow-lg border-0 rounded-4 mb-4">
        <div className="card-body p-5">
          <h4 className="fw-bold text-primary mb-2">📘 Course Management</h4>
          <p className="text-muted mb-4">
            Easily create, update, and manage all your courses here.
          </p>

          {/* Form for creating a new course */}
          <form onSubmit={CreateCourse}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Course Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter course name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Course Description
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write a short description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Assign Teacher</label>
              <select
                className="form-select"
                value={newCourse.teacher}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, teacher: e.target.value })
                }
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary rounded-pill">
                <i className="bi bi-plus-circle me-1"></i> Add Course
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />

      {/* ================================
          COURSE LIST SECTION
      ================================= */}
      <h3 className="fw-semibold text-center mt-5 mb-5 text-muted">
        Available Courses
      </h3>

      <div className="row g-4">
        {courses.map((course) => (
          <div key={course._id} className="col-md-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="text-primary fw-bold mb-2">{course.name}</h5>
                <p className="text-muted small mb-3">
                  {course.description || "No description provided."}
                </p>
                <span
                  className={`badge ${
                    course.teacher ? "bg-success" : "bg-warning text-dark"
                  } rounded-pill mb-3`}
                >
                  {course.teacher ? course.teacher.name : "Unassigned"}
                </span>
              </div>
              <div className="card-footer bg-transparent border-0 text-end">
                {/* Edit Button */}
                <button className="btn btn-outline-info btn-sm rounded-pill me-2" onClick={()=>clickEdit(course)}>
                  <i className="bi bi-pencil"></i> Edit
                </button>

                {/* Delete Button (currently placeholder) */}
                <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={()=>startDelete(course)}>
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================
          EDIT COURSE MODAL SECTION
      ================================= */}
      {editCourse && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Edit Course</h5>
                {/* Close button resets editCourse to hide the modal */}
                <button
                  className="btn-close"
                  onClick={() => setEditCourse(null)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* Course Name Input */}
                <input
                  type="text"
                  placeholder="Course Name"
                  className="form-control mb-2"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />

                {/* Course Description Input */}
                <textarea
                  placeholder="Course Description"
                  className="form-control mb-2"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                ></textarea>

                {/* Teacher Dropdown */}
                <select
                  className="form-select"
                  value={editForm.teacher}
                  onChange={(e) =>
                    setEditForm({ ...editForm, teacher: e.target.value })
                  }
                >
                  <option value="">Assign Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                {/* Save changes triggers update function */}
                <button
                  className="btn btn-success"
                  onClick={handleUpdateCourse}
                >
                  Save Changes
                </button>

                {/* Cancel button closes modal */}
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditCourse(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletecourse &&(
        <div className="modal fade show d-block " tabIndex="-1">
        <div className="modal dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                className="btn-close"
                onClick={() => setDeleteCourse(null)}
              ></button>
              <div className="modal-body">
                Are you sure you want to delete
                <strong>{deletecourse.name}</strong>
              </div>

              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleDelete}>Yes Delete</button>
                <button className="btn btn-secondary" onClick={()=>setDeleteCourse(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

// Export component
export default AdminCourse;
