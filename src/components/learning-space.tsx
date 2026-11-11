"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import CourseCatalog from "@/src/components/course-catalog";
import CourseEditorDialog from "@/src/components/course-editor-dialog";
import CoursePlayer from "@/src/components/course-player";
import LearningSpaceHeader from "@/src/components/learning-space-header";
import SignInScreen from "@/src/components/sign-in-screen";
import { getCourses, login, sendCourseRequest } from "@/src/lib/courses-api";
import type { SignedInUser } from "@/src/types/auth";
import type { Course, LessonProgress } from "@/src/types/course";

export default function LearningSpace() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signedInAs, setSignedInAs] = useState<SignedInUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [savingCourse, setSavingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<LessonProgress>({});

  const categories = useMemo(
    () => ["All courses", ...new Set(courseList.map((course) => course.category))],
    [courseList],
  );

  const visibleCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courseList.filter((course) => {
      const matchesCategory =
        category === "All courses" || course.category === category;
      const matchesSearch =
        !query ||
        `${course.title} ${course.category} ${course.instructor} ${course.description}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, courseList, search]);

  useEffect(() => {
    const controller = new AbortController();

    getCourses(controller.signal)
      .then(setCourseList)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setCoursesError(
            cause instanceof Error
              ? cause.message
              : "Unable to load courses from the API.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCoursesLoading(false);
      });

    return () => controller.abort();
  }, []);

  async function reloadCourses() {
    setCoursesLoading(true);
    setCoursesError("");
    try {
      setCourseList(await getCourses());
    } catch (cause) {
      setCoursesError(
        cause instanceof Error
          ? cause.message
          : "Unable to load courses from the API.",
      );
    } finally {
      setCoursesLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginLoading) return;
    setError("");
    setLoginLoading(true);

    try {
      const session = await login(username.trim(), password);
      const accountName = session.user.username;
      setAuthToken(session.token);
      setSignedInAs({
        username: accountName,
        role: session.user.role,
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to sign in.",
      );
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setSignedInAs(null);
    setAuthToken(null);
    setSelectedCourse(null);
    setPassword("");
    setError("");
  }

  function openCourse(course: Course) {
    setSelectedCourse(course);
    setActiveLesson(0);
  }

  function markLessonComplete() {
    if (!selectedCourse) return;
    setCompletedLessons((current) => {
      const completed = current[selectedCourse.id] ?? [];
      if (completed.includes(activeLesson)) return current;
      return { ...current, [selectedCourse.id]: [...completed, activeLesson] };
    });
  }

  async function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      signedInAs?.role !== "admin" ||
      !authToken ||
      !editingCourse ||
      savingCourse
    ) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const updatedCourse: Course = {
      ...editingCourse,
      title: String(formData.get("title")).trim(),
      category: String(formData.get("category")),
      instructor: String(formData.get("instructor")).trim(),
      duration: String(formData.get("duration")).trim(),
      level: String(formData.get("level")),
      description: String(formData.get("description")).trim(),
      lessons: String(formData.get("lessons"))
        .split("\n")
        .map((lesson) => lesson.trim())
        .filter(Boolean),
    };

    if (!updatedCourse.lessons.length) {
      setCoursesError("A course must have at least one lesson.");
      return;
    }

    setSavingCourse(true);
    setCoursesError("");
    try {
      await sendCourseRequest(
        `/courses/${updatedCourse.id}`,
        "PUT",
        authToken,
        updatedCourse,
      );
      setCourseList((current) =>
        current.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course,
        ),
      );
      setSelectedCourse((current) =>
        current?.id === updatedCourse.id ? updatedCourse : current,
      );
      setEditingCourse(null);
    } catch (cause) {
      setCoursesError(
        cause instanceof Error
          ? cause.message
          : "Unable to save course changes.",
      );
    } finally {
      setSavingCourse(false);
    }
  }

  async function deleteCourse(course: Course) {
    if (signedInAs?.role !== "admin" || !authToken) return;
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`))
      return;

    setCoursesError("");
    try {
      await sendCourseRequest(`/courses/${course.id}`, "DELETE", authToken);
      setCourseList((current) =>
        current.filter((item) => item.id !== course.id),
      );
      setCompletedLessons((current) =>
        Object.fromEntries(
          Object.entries(current).filter(
            ([courseId]) => Number(courseId) !== course.id,
          ),
        ),
      );
      if (selectedCourse?.id === course.id) setSelectedCourse(null);
    } catch (cause) {
      setCoursesError(
        cause instanceof Error ? cause.message : "Unable to delete the course.",
      );
    }
  }

  if (!signedInAs) {
    return (
      <SignInScreen
        error={error}
        loading={loginLoading}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        onUsernameChange={setUsername}
        password={password}
        username={username}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] font-sans text-slate-900">
      <LearningSpaceHeader
        onHome={() => setSelectedCourse(null)}
        onSignOut={handleLogout}
        user={signedInAs}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {selectedCourse ? (
          <CoursePlayer
            activeLesson={activeLesson}
            completedLessons={completedLessons}
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onMarkComplete={markLessonComplete}
            onNextLesson={() =>
              setActiveLesson((lesson) =>
                Math.min(lesson + 1, selectedCourse.lessons.length - 1),
              )
            }
            onSelectLesson={setActiveLesson}
          />
        ) : (
          <CourseCatalog
            categories={categories}
            category={category}
            completedLessons={completedLessons}
            courses={courseList}
            error={coursesError}
            loading={coursesLoading}
            onCategoryChange={setCategory}
            onDeleteCourse={deleteCourse}
            onEditCourse={setEditingCourse}
            onOpenCourse={openCourse}
            onRetry={reloadCourses}
            onSearchChange={setSearch}
            role={signedInAs.role}
            search={search}
            visibleCourses={visibleCourses}
          />
        )}
      </div>
      {editingCourse && signedInAs.role === "admin" && authToken && (
        <CourseEditorDialog
          categories={categories}
          course={editingCourse}
          error={coursesError}
          onClose={() => setEditingCourse(null)}
          onSubmit={saveCourse}
          saving={savingCourse}
        />
      )}
    </main>
  );
}
