import React, { useEffect, useState, useMemo } from "react";

function AdminStatistics({ token }) {
  const [data, setData] = useState({
    users: [],
    courses: [],
    classrooms: [],
    summary: { students: [], teachers: [], counts: null },
  });
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, coursesRes, classesRes, summaryRes] = await Promise.all([
          fetch("https://schoolbackend-kbhx.onrender.com/api/users", { headers }).then((r) => r.json()),
          fetch("https://schoolbackend-kbhx.onrender.com/api/courses", { headers }).then((r) => r.json()),
          fetch("https://schoolbackend-kbhx.onrender.com/api/classrooms", { headers }).then((r) => r.json()),
          fetch("https://schoolbackend-kbhx.onrender.com/api/admin/summary", { headers }).then((r) => r.json()),
        ]);

        setData({
          users: usersRes.users || [],
          courses: coursesRes.courses || [],
          classrooms: classesRes.classrooms || [],
          summary: summaryRes,
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  // Summary stats
  const stats = useMemo(() => {
    const { users, courses, classrooms, summary } = data;
    if (summary.counts) {
      return {
        students: summary.counts.totalStudents,
        teachers: summary.counts.totalTeachers,
        courses: summary.counts.totalCourses,
        classes: summary.counts.totalClasses,
      };
    }
    return {
      students: users.filter((u) => u.role === "student").length,
      teachers: users.filter((u) => u.role === "teacher").length,
      courses: courses.length,
      classes: classrooms.length,
    };
  }, [data]);

  // Teacher summary
  const teacherSummary = useMemo(
    () =>
      data.users
        .filter((u) => u.role === "teacher")
        .map((t) => {
          const teacherClasses = data.classrooms.filter(
            (cls) => cls.teacher?._id === t._id
          );
          return {
            ...t,
            teacherClasses: teacherClasses.length,
            teacherStudents: teacherClasses.reduce(
              (acc, cls) => acc + (cls.students?.length || 0),
              0
            ),
          };
        }),
    [data]
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="row mb-4">
        {[
          { count: stats.students, label: "Students", icon: "fa-user-graduate", color: "primary" },
          { count: stats.teachers, label: "Teachers", icon: "fa-chalkboard-teacher", color: "info" },
          { count: stats.courses, label: "Courses", icon: "fa-book-open", color: "success" },
          { count: stats.classes, label: "Classes", icon: "fa-door-open", color: "warning" },
        ].map((item, i) => (
          <div className="col-md-6 col-lg-3 mb-3" key={i}>
            <div
              className={`card border-0 shadow-sm bg-${item.color}-subtle text-${item.color}-emphasis h-100`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h2 className="mb-0 fw-bold display-6">{item.count}</h2>
                    <p className="mb-0 small text-muted">{item.label}</p>
                  </div>
                  <div className={`rounded-circle p-3 bg-${item.color}-opacity-10`}>
                    <i className={`fas ${item.icon} fs-4`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Details */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-semibold text-primary">
            <i className="fas fa-user-graduate me-2"></i>Student Details
          </h5>
          {data.summary.counts && (
            <small className="text-muted">
              <i className="fas fa-check-circle me-1 text-success"></i>
              {data.summary.counts.studentsInClasses} assigned ·{" "}
              <i className="fas fa-exclamation-circle ms-2 me-1 text-warning"></i>
              {data.summary.counts.studentsNotAssigned} unassigned
            </small>
          )}
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="border-0 py-3">Name</th>
                  <th className="border-0 py-3">Email</th>
                  <th className="border-0 py-3">Class</th>
                  <th className="border-0 py-3">Course</th>
                  <th className="border-0 py-3">Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {data.summary.students?.length > 0 ? (
                  data.summary.students.map((s, i) => (
                    <tr key={i}>
                      <td className="py-3">{s.name}</td>
                      <td className="py-3 text-muted">{s.email}</td>
                      <td className="py-3">
                        {s.class === "Not Assigned" ? (
                          <span className="badge bg-light rounded-pill text-danger border">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {s.class}
                          </span>
                        ) : (
                          <span className="badge bg-primary text-light rounded-pill ">
                            {s.class}
                          </span>
                        )}
                      </td>
                      <td className="py-3">{s.course}</td>
                      <td className="py-3">{s.teacher}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <i className="fas fa-inbox fs-1 d-block mb-3 opacity-50"></i>
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Teacher Summary */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0 fw-semibold text-primary">
            <i className="fas fa-chalkboard-teacher me-2"></i>Teacher Summary
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="border-0 py-3">Name</th>
                  <th className="border-0 py-3">Email</th>
                  <th className="border-0 py-3">Classes</th>
                  <th className="border-0 py-3">Students</th>
                </tr>
              </thead>
              <tbody>
                {teacherSummary.length > 0 ? (
                  teacherSummary.map((t) => (
                    <tr key={t._id}>
                      <td className="py-3 fw-medium">{t.name}</td>
                      <td className="py-3 text-muted">{t.email}</td>
                      <td className="py-3">
                        <span className="badge bg-info-subtle text-info px-3 py-2">
                          {t.teacherClasses}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-success-subtle text-success px-3 py-2">
                          {t.teacherStudents}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      <i className="fas fa-inbox fs-1 d-block mb-3 opacity-50"></i>
                      No teachers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default AdminStatistics;
