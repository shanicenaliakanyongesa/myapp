# School Admin Dashboard — Course & Classroom Management

This section explains how to build and understand two key components of a school management dashboard:

- **AdminCourse.jsx** — for managing courses  
- **AdminClassroom.jsx** — for managing classrooms  

Both components use React hooks, Axios, and Bootstrap for UI and API communication.

---

## 🧩 Technologies Used

| Tool | Purpose |
|------|----------|
| React.js | Frontend framework |
| Axios | Handle API requests |
| Bootstrap | UI styling |
| React Toastify | Notifications (success, error, info) |
| useState & useEffect | React hooks for managing state and lifecycle events |

---

## 🚀 Setup Steps




## 1️⃣ Course Management (AdminCourse.jsx)

This component allows the admin to:

**Create new courses**

**Fetch and display courses**

**Edit course details**

**Delete courses**

## Step 1 — Create the Course Form

```const [newCourse, setNewCourse] = useState({
  name: "",
  description: "",
  teacher: "",
});

```
## What's happening here?

**newCourse is our storage box (it holds the course name, description, and teacher)**
**setNewCourse is the function we use to update what's in the box**
**Initially, everything is empty strings ("") because we haven't filled the form yet**
**useState stores input values dynamically.**

**When the admin types in the form, setNewCourse updates the object.**

## Step 2: Create a Form to Create a Course & Connect the Hooks

Now we build the actual form that users will see. Here's where the magic happens:

```<form onSubmit={CreateCourse}>
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
    <label className="form-label fw-semibold">Course Description</label>
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

  {/* Teacher dropdown will be shown in Step 3 */}

  <div className="text-end">
    <button type="submit" className="btn btn-primary rounded-pill">
      <i className="bi bi-plus-circle me-1"></i> Add Course
    </button>
  </div>
</form>
```

## Breaking it down:

**value={newCourse.name} - This displays what's currently stored in our hook**

**onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} - When you type, it updates the hook**

**The ...newCourse part means "keep everything else the same, just change the name"**

##  The CreateCourse Function:

```async function CreateCourse(e) {
  e.preventDefault();
  try {
    await axios.post(
      "https://schoolbackend-kbhx.onrender.com/api/courses",
      newCourse,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Course created successfully!");
    setNewCourse({ name: "", description: "", teacher: "" });
    fetchCourse();
  } catch {
    toast.error(" Error creating course");
  }
}
```

## What's going on?

**Prevents page reload using e.preventDefault()**

**Sends an authenticated request with the token**

**Clears form after successful creation**

**Calls fetchCourse() to refresh the list**


##  Step 3: Fetch Users & Filter Only Teachers for the Dropdown

We need teachers to assign to courses, right? Let's get them!

```const [users, setUsers] = useState([]);

// Fetch all users from the backend
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

const teachers = users.filter((user) => user.role === "teacher");
```

**Now let's map those teachers in the dropdown within our form:**
```<div className="mb-4">
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

```
**See that .map()?**
**It's looping through each teacher and creating an <option> for each one. Cool, right? 😎**


## Step 4 — Fetch and Display Courses

```
// Hooks for courses
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(false);

// Function to fetch courses
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

// Load courses when component first renders
useEffect(() => {
  fetchUsers();
  fetchCourse();
}, [token]);

```

## Displaying courses:

```
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
          <button className="btn btn-outline-info btn-sm rounded-pill me-2" onClick={()=>clickEdit(course)}>
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={()=>startDelete(course)}>
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
```

## Step 5: Hooks for Edit Modal

When you click "Edit", we need to show a modal (that pop-up window). Let's set that up:

```
// Store the course being edited
const [editCourse, setEditCourse] = useState(null);

// Store the form data while editing
const [editForm, setEditForm] = useState({
  name: "",
  description: "",
  teacher: "",
});

// Function to open the edit modal
function clickEdit(course) {
  setEditCourse(course); // Save which course we're editing
  
  // Pre-fill the form with existing data
  setEditForm({
    name: course.name,
    description: course.description || "",
    teacher: course.teacher?._id || "",
  });
}
```

## The Edit Modal:
```
{editCourse && (
  <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Course</h5>
          <button className="btn-close" onClick={() => setEditCourse(null)}></button>
        </div>

        <div className="modal-body">
          <input
            type="text"
            placeholder="Course Name"
            className="form-control mb-2"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
          />

          <textarea
            placeholder="Course Description"
            className="form-control mb-2"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
          ></textarea>

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

        <div className="modal-footer">
          <button className="btn btn-success" onClick={handleUpdateCourse}>
            Save Changes
          </button>
          <button className="btn btn-secondary" onClick={() => setEditCourse(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

## Step 6: Update Function - Save the Changes

```
async function handleUpdateCourse() {
  try {
    await axios.put(
      `https://schoolbackend-kbhx.onrender.com/api/courses/${editCourse._id}`,
      editForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditCourse(null); // Close the modal
    fetchCourse(); // Refresh the course list
    toast.success("✅ Course updated successfully!");
  } catch (error) {
    toast.error("❌ Error updating course");
  }
}
```
**What's axios.put()?**

*It's like axios.post(), but for updating existing data instead of creating new data.*

## Step 7: Delete Course - Hooks & Modal

Last but not least, let's handle deletion:

```
// Hook to track which course to delete
const [deletecourse, setDeleteCourse] = useState(null);

// Function to open delete confirmation
function startDelete(course) {
  setDeleteCourse(course);
}

// Function to actually delete
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
```
## Delete Confirmation Modal:
``` {deletecourse &&(
  <div className="modal fade show d-block " tabIndex="-1">
    <div className="modal dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Delete</h5>
          <button className="btn-close" onClick={() => setDeleteCourse(null)}></button>
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
```

## 🏫 Classroom Management System - The Breakdown

Now let's tackle the AdminClassroom component. Same energy, different features! 💪

## Step 1: Hooks for Classroom Form & Binding
Just like courses, we need hooks for classroom data:

```
const [classroom, setClassroom] = useState({
  name: "",
  course: "",
  teacher: "",
});
```

## The Form:
```
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

  {/* Course and Teacher dropdowns in next steps */}

  <div className="text-end mt-3">
    <button type="submit" className="btn btn-primary rounded-pill">
      Add Classroom
    </button>
  </div>
</form>
```

## Step 2: Fetch Courses & Map to Course Input

```
// Hook for courses
const [courses, setCourses] = useState([]);

// Fetch courses from backend
async function fetchCourses() {
  const res = await axios.get(
    "https://schoolbackend-kbhx.onrender.com/api/courses",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setCourses(res.data.courses || []);
}
```

## Map courses in the dropdown:

```
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
```

## Step 3: Fetch Users, Filter Teachers & Map to Teacher Input

```
// Hook for users
const [users, setUsers] = useState([]);

// Fetch users
async function fetchUsers() {
  const res = await axios.get(
    "https://schoolbackend-kbhx.onrender.com/api/users",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setUsers(res.data.users || []);
}

// Filter only teachers
const teachers = users.filter((u) => u.role === "teacher");
```

## Teacher Dropdown:

```
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
```

## Step 4: Create Classroom Function
```
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
```
## Step 5: Fetch & Display Classrooms with Details
```
// Hook for classrooms
const [classrooms, setClassrooms] = useState([]);

// Fetch all classrooms
async function fetchClassrooms() {
  const res = await axios.get(
    "https://schoolbackend-kbhx.onrender.com/api/classrooms",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setClassrooms(res.data.classrooms || []);
}

// Load everything when component mounts
useEffect(() => {
  fetchCourses();
  fetchUsers();
  fetchClassrooms();
}, [token]);
```

## Display Classrooms:

```
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
            <button className="btn btn-outline-secondary  btn-sm rounded-pill" onClick={() => setAddclassroom(cls)}>
              Add 
            </button>
            <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => setViewClass(cls)}>
              View
            </button>
            <button className="btn btn-outline-info  btn-sm rounded-pill" onClick={() => setEditClassroom(cls)}>
              Edit
            </button>
            <button className="btn btn-outline-danger  btn-sm rounded-pill" onClick={() => setDeleteClassroom(cls)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

## Step 6: Add Student to Class Modal
This is where it gets interesting! Let's add students to classrooms:

```
// Hook for selected classroom
const [addclassroom, setAddclassroom] = useState(null);

// Hook for selected student
const [selectedStudent, setSelectedstudent] = useState(null);

// Filter students from users
const students = users.filter((user) => user.role === "student");

// Function to add student to classroom
async function AddStudentToClass(e) {
  e.preventDefault();

  try {
    await axios.post(
      `https://schoolbackend-kbhx.onrender.com/api/classrooms/${addclassroom._id}/add-student`,
      { studentId: selectedStudent },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAddclassroom(null); // Close modal
    setSelectedstudent(""); // Clear selection
    fetchClassrooms(); // Refresh list
    toast.success("Student Added Successfully");
  } catch (error) {
    toast.error("Error Adding Student to Class");
  }
}
```

## Add Student Modal:

```
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
            <button className="btn-close" type="button" onClick={() => setAddclassroom(null)}></button>
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
```

## Step 7: View Students in Class

Let's see who's in each classroom:
```
// Hook to store which classroom we're viewing
const [viewClass, setViewClass] = useState(null);

// Function to remove student from classroom
async function RemoveStudentFromClassroom(classId, studentId) {
  try {
    await axios.post(
      `https://schoolbackend-kbhx.onrender.com/api/classrooms/${classId}/remove-student`,
      { studentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Student removed successfully");
    fetchClassrooms();
    
    // Update the view locally
    setViewClass((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s._id !== studentId),
    }));
  } catch (error) {
    toast.error("Error removing student from class");
  }
}
```

## View Modal:

```
{viewClass && (
  <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content rounded-4 shadow-lg border-0">
        <div className="modal-header bg-primary text-white rounded-top-4">
          <h5 className="modal-title fw-semibold w-100 text-center">
            Class Details
          </h5>
          <button className="btn-close btn-close-white" onClick={() => setViewClass(null)}></button>
        </div>

        <div className="modal-body px-5 py-4">
          <div className="mb-3">
            <p><strong>Name:</strong> {viewClass.name}</p>
            <p><strong>Course:</strong> {viewClass.course?.name || "No Assigned Course"}</p>
            <p><strong>Class Teacher:</strong> {viewClass.teacher?.name || "No Assigned Teacher"}</p>
          </div>

          <hr />

          <h6 className="text-center fw-bold mb-3">Students</h6>
          {viewClass.students && viewClass.students.length > 0 ? (
            <ul className="list-group list-group-flush">
              {viewClass.students.map((student, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2 shadow-sm">
                  <strong>{student.name}</strong>
                  <small className="text-muted">{student.email}</small>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => RemoveStudentFromClassroom(viewClass._id, student._id)}
                  >
                    <i class="fa-solid fa-user-minus"></i>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center">No students assigned to this class.</p>
          )}
        </div>

        <div className="modal-footer border-0 d-flex justify-content-center">
          <button className="btn btn-secondary px-4 rounded-pill" type="button" onClick={() => setViewClass(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```
## Step 8: Edit Classroom

Similar to editing courses, but for classrooms:

``` // Hooks for editing
const [editClassroom, setEditClassroom] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  course: "",
  teacher: "",
});

// Update function
async function handleUpdateClassroom(e) {
  e.preventDefault();
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
```

## Edit Modal:

```
{editClassroom && (
  <div className="modal fade show d-flex align-items-center justify-content-center" tabIndex="-1" style={{ display: "flex", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px", width: "90%", transition: "transform 0.3s ease, opacity 0.3s ease", transform: "translateY(0)" }}>
      <div className="modal-content border-0 shadow-lg rounded-4" style={{ animation: "fadeInScale 0.3s ease" }}>
        <div className="modal-header bg-primary text-white rounded-top-4">
          <h5 className="modal-title fw-semibold mb-0">Edit Classroom</h5>
          <button type="button" className="btn-close btn-close-white" onClick={() => setEditClassroom(null)}></button>
        </div>

        <form onSubmit={handleUpdateClassroom}>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label fw-medium text-secondary">Class Name</label>
              <input
                type="text"
                className="form-control rounded-3 shadow-sm"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter classroom name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium text-secondary">Course</label>
              <select
                className="form-select rounded-3 shadow-sm"
                value={editForm.course}
                onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label fw-medium text-secondary">Teacher</label>
              <select
                className="form-select rounded-3 shadow-sm"
                value={editForm.teacher}
                onChange={(e) => setEditForm({ ...editForm, teacher: e.target.value })}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer border-0 px-4 pb-4">
            <button type="button" className="btn btn-light px-4 rounded-3 shadow-sm" onClick={() => setEditClassroom(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success px-4 rounded-3 shadow-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

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
```

## Step 9: Delete Classroom
Last step - removing classrooms:
```
// Hook for delete
const [deleteClassroom, setDeleteClassroom] = useState(null);

// Delete function
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
```
## Delete Modal
```
{deleteClassroom && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={() => setDeleteClassroom(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete{" "}
                <strong>{deleteClassroom.name}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteClassroom}
                >
                  Yes, Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteClassroom(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
```

## Complete Courses Code
```
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


```


## Complete Classroom Code

```
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

```