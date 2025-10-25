import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminClassroom = ({ token }) => {
  const [classroom, setClassroom] = useState({
    name: "",
    course: "",
    teacher: "",
  });
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // one state per selected classroom action
  const [viewClassroom, setViewClassroom] = useState(null);

  const [deleteClassroom, setDeleteClassroom] = useState(null);

  // ✅ Create Classroom
  async function createClassroom(e) {
    e.preventDefault();
    try {
      await axios.post(
        "https://schoolbackend-kbhx.onrender.com/api/classrooms",
        classroom,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassroom({ name: "", course: "", teacher: "" });
      toast.success("Classroom Added Successfully!");
      fetchClassrooms();
    } catch (error) {
      toast.error("Error Adding Classroom!");
    }
  }

  // ✅ Fetch all data
  async function fetchCourses() {
    const res = await axios.get(
      "https://schoolbackend-kbhx.onrender.com/api/courses",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setCourses(res.data.courses || []);
  }

  async function fetchUsers() {
    const res = await axios.get(
      "https://schoolbackend-kbhx.onrender.com/api/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(res.data.users || []);
  }

  async function fetchClassrooms() {
    const res = await axios.get(
      "https://schoolbackend-kbhx.onrender.com/api/classrooms",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setClassrooms(res.data.classrooms || []);
  }

  useEffect(() => {
    fetchCourses();
    fetchUsers();
    fetchClassrooms();
  }, [token]);

  const teachers = users.filter((u) => u.role === "teacher");

  // ✅ Assign student

  // Hook to capture the selected class
  const [addclassroom, setAddclassroom] = useState(null);

  // Hook to capture student to be added to class
  const [selectedStudent, setSelectedstudent] = useState(null);

  // Filter from the users to pick only the students
  const students = users.filter((user) => user.role === "student");

  // Function to add student to class
  // Function to handle adding a student to a classroom
  async function AddStudentToClass(e) {
    // Prevent the default form submission behavior (which reloads the page)
    e.preventDefault();

    try {
      // Send a POST request to the backend API to add a student to the selected classroom
      await axios.post(
        `https://schoolbackend-kbhx.onrender.com/api/classrooms/${addclassroom._id}/add-student`,
        { studentId: selectedStudent }, // Request body containing the ID of the student to be added
        {
          headers: { Authorization: `Bearer ${token}` }, // Authorization header for secure access
        }
      );

      // Reset the classroom selection (close the "Add Student" modal or form)
      setAddclassroom(null);

      // Clear the selected student field to reset the form
      setSelectedstudent("");

      // Refresh the classroom list to display the updated data (with the new student added)
      fetchClassrooms();

      // Show a success notification to the user
      toast.success("Student Added Successfully");
    } catch (error) {
      // Handle any errors that occur during the request and show an error notification
      toast.error("Error Adding Student to Class");
    }
  }
    // View Classroom
  const [viewClass, setViewClass] = useState(null);

  // Remove Student from a Class

  async function RemoveStudentFromClassroom(classId, studentId) {
    try {
      await axios.post(
        `https://schoolbackend-kbhx.onrender.com/api/classrooms/${classId}/remove-student`,
        { studentId }, // backend expects this
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Student removed successfully");

      // Refresh class data after removing student
      fetchClassrooms();
       // 👇 Update viewClass locally (remove the student)
        setViewClass((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s._id !== studentId),
    }));

    } catch (error) {
      toast.error("Error removing student from class");
    }
  }




 // ---------------- EDIT CLASSROOM ----------------
const [editClassroom, setEditClassroom] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  course: "",
  teacher: "",
});



async function handleUpdateClassroom(e) {
  e.preventDefault(); // prevent page reload
  try {
    await axios.put(
      `http://localhost:5000/api/classrooms/${editClassroom._id}`,
      editForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditClassroom(null);
    fetchClassrooms();
  } catch (error) {
    console.log("Error updating classroom", error);
  }
}

  // ✅ Delete classroom
  async function handleDeleteClassroom() {
    try {
      await axios.delete(
        `https://schoolbackend-kbhx.onrender.com/api/classrooms/${deleteClassroom._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Classroom Deleted!");
      setDeleteClassroom(null);
      fetchClassrooms();
    } catch {
      toast.error("Error Deleting Classroom!");
    }
  }

  return (
    <div className="card shadow-lg border-0 rounded-4 mb-4 container">
      <div className="card-body p-5">
        <h4 className="text-primary mb-2 fw-bold">Classroom Management</h4>
        <p className="text-muted mb-4">
          Easily Create, Update, Manage all Classrooms Here
        </p>

        {/* Create Classroom Form */}
        <form onSubmit={createClassroom}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Classname</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Class Name"
              value={classroom.name}
              onChange={(e) =>
                setClassroom({ ...classroom, name: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Course Selection</label>
            <select
              className="form-select"
              value={classroom.course}
              onChange={(e) =>
                setClassroom({ ...classroom, course: e.target.value })
              }
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Assign Teacher</label>
            <select
              className="form-select"
              value={classroom.teacher}
              onChange={(e) =>
                setClassroom({ ...classroom, teacher: e.target.value })
              }
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-end mt-3">
            <button type="submit" className="btn btn-primary rounded-pill">
              Add Classroom
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-left" autoClose={3000} />

      <h4 className="fw-semibold text-center mt-5 mb-5 text-muted">
        Available Classes
      </h4>

      <div className="row g-4">
        {classrooms.map((cls) => (
          <div className="col-md-4 mt-3" key={cls._id}>
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="text-primary fw-bold mb-2">{cls.name}</h5>
                <small className="text-muted">
                  {cls.course?.name || "No course assigned"}
                </small>
                <div className="text-end mt-2">
                  {cls.teacher ? (
                    <span className="badge bg-success text-dark rounded-pill">
                      {cls.teacher.name}
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark rounded-pill">
                      Teacher Not Assigned
                    </span>
                  )}
                </div>
                <span className="badge bg-info rounded-pill mt-2">
                  {cls.students?.length || 0} students
                </span>

                <div className="d-flex  gap-2 mt-4 mb-4">
                  <button
                    className="btn btn-outline-secondary  btn-sm rounded-pill"
                    onClick={() => setAddclassroom(cls)}
                  >
                    Add 
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm rounded-pill"
                    onClick={() => setViewClass(cls)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline-info  btn-sm rounded-pill"
                    onClick={() => setEditClassroom(cls)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger  btn-sm rounded-pill"
                    onClick={() => setDeleteClassroom(cls)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Student to class */}

      {addclassroom && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form action="" onSubmit={AddStudentToClass}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Add student to{" "}
                    <b className="text-danger">{addclassroom.name}</b>{" "}
                  </h5>
                  <button
                    className="btn-close"
                    type="button"
                    onClick={() => setAddclassroom(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <select
                    className="form-select"
                    value={selectedStudent}
                    onChange={(e) => setSelectedstudent(e.target.value)}
                  >
                    <option value="">Select students</option>
                    {students.map((std) => (
                      <option value={std._id} key={std._id}>
                        {std.name}
                      </option>
                    ))}
                  </select>

                  <div className="modal-footer text-end">
                    <button className="btn btn-sm btn-primary">Assign Student</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {viewClass && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg border-0">
              {/* Header */}
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title fw-semibold w-100 text-center">
                  Class Details
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setViewClass(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body px-5 py-4">
                <div className="mb-3">
                  <p>
                    <strong>Name:</strong> {viewClass.name}
                  </p>
                  <p>
                    <strong>Course:</strong>{" "}
                    {viewClass.course?.name || "No Assigned Course"}
                  </p>
                  <p>
                    <strong>Class Teacher:</strong>{" "}
                    {viewClass.teacher?.name || "No Assigned Teacher"}
                  </p>
                </div>

                <hr />

                <h6 className="text-center fw-bold mb-3">Students</h6>
                {viewClass.students && viewClass.students.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {viewClass.students.map((student, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2 shadow-sm"
                      >
                        <strong>{student.name}</strong>
                        <small className="text-muted">{student.email}</small>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            RemoveStudentFromClassroom(
                              viewClass._id,
                              student._id
                            )
                          }
                        >
                     
                          <i class="fa-solid fa-user-minus"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted text-center">
                    No students assigned to this class.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 d-flex justify-content-center">
                <button
                  className="btn btn-secondary px-4 rounded-pill"
                  type="button"
                  onClick={() => setViewClass(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      
    {/* Edit Modal */}
{editClassroom && (
  <div
    className="modal fade show d-flex align-items-center justify-content-center"
    tabIndex="-1"
    style={{
      display: "flex",
      background: "rgba(0,0,0,0.4)", // semi-transparent dark backdrop
      backdropFilter: "blur(4px)", // adds modern blur effect
      zIndex: 1050,
    }}
  >
    <div
      className="modal-dialog modal-dialog-centered"
      style={{
        maxWidth: "500px",
        width: "90%",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: "translateY(0)",
      }}
    >
      <div
        className="modal-content border-0 shadow-lg rounded-4"
        style={{
          animation: "fadeInScale 0.3s ease",
        }}
      >
        <div className="modal-header bg-primary text-white rounded-top-4">
          <h5 className="modal-title fw-semibold mb-0">Edit Classroom</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setEditClassroom(null)}
          ></button>
        </div>

        <form onSubmit={handleUpdateClassroom}>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label fw-medium text-secondary">
                Class Name
              </label>
              <input
                type="text"
                className="form-control rounded-3 shadow-sm"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Enter classroom name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium text-secondary">
                Course
              </label>
              <select
                className="form-select rounded-3 shadow-sm"
                value={editForm.course}
                onChange={(e) =>
                  setEditForm({ ...editForm, course: e.target.value })
                }
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label fw-medium text-secondary">
                Teacher
              </label>
              <select
                className="form-select rounded-3 shadow-sm"
                value={editForm.teacher}
                onChange={(e) =>
                  setEditForm({ ...editForm, teacher: e.target.value })
                }
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer border-0 px-4 pb-4">
            <button
              type="button"
              className="btn btn-light px-4 rounded-3 shadow-sm"
              onClick={() => setEditClassroom(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success px-4 rounded-3 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Optional subtle animation */}
    <style>{`
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}</style>
  </div>
)}


      {/* Delete Modal */}
      {deleteClassroom && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={() => setDeleteClassroom(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{deleteClassroom.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteClassroom(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteClassroom}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClassroom;
