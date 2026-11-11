import type { Role } from "@/src/types/auth";
import type { Course, LessonProgress } from "@/src/types/course";

type CourseCatalogProps = {
  courses: Course[];
  categories: string[];
  visibleCourses: Course[];
  role: Role;
  search: string;
  category: string;
  loading: boolean;
  error: string;
  completedLessons: LessonProgress;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onRetry: () => void;
  onOpenCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
};

type CourseCardProps = {
  course: Course;
  role: Role;
  progress: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function CourseCard({
  course,
  role,
  progress,
  onOpen,
  onEdit,
  onDelete,
}: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-40 items-center justify-center bg-gradient-to-br ${course.color} text-5xl font-bold text-white`}
      >
        <span aria-hidden="true">{course.icon}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {course.category}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {course.level}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-6">{course.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>By {course.instructor}</span>
          <span>{course.duration}</span>
        </div>
        {progress > 0 && (
          <p className="mt-3 text-xs font-medium text-emerald-700">
            {progress} of {course.lessons.length} lessons complete
          </p>
        )}
        <button
          className="mt-5 w-full rounded-xl bg-[#102542] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3b64]"
          onClick={onOpen}
          type="button"
        >
          {progress > 0 ? "Continue course" : "Browse course"}
        </button>
        {role === "admin" && (
          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 rounded-xl border border-cyan-800 px-4 py-2.5 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-50"
              onClick={onEdit}
              type="button"
            >
              Edit
            </button>
            <button
              className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              onClick={onDelete}
              type="button"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CourseCatalog({
  courses,
  categories,
  visibleCourses,
  role,
  search,
  category,
  loading,
  error,
  completedLessons,
  onSearchChange,
  onCategoryChange,
  onRetry,
  onOpenCourse,
  onEditCourse,
  onDeleteCourse,
}: CourseCatalogProps) {
  return (
    <>
      <section className="mb-10 rounded-3xl bg-[#102542] px-6 py-9 text-white sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Your learning starts here
        </p>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explore your next course.
            </h1>
            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              Browse practical courses, learn at your own pace, and build skills
              for what comes next.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-sm text-slate-300">courses to explore</p>
          </div>
        </div>
      </section>

      <section aria-label="Course catalog">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Course catalog</h2>
            <p className="mt-1 text-sm text-slate-500">
              Find a course and start learning today.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search courses</span>
            <span
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              ⌕
            </span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search courses..."
              value={search}
            />
          </label>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-[#102542] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
              key={item}
              onClick={() => onCategoryChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        {error && (
          <div
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            <span>{error}</span>
            {!loading && (
              <button
                className="font-semibold underline underline-offset-2"
                onClick={onRetry}
                type="button"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            Loading courses...
          </p>
        ) : visibleCourses.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseCard
                course={course}
                key={course.id}
                onDelete={() => onDeleteCourse(course)}
                onEdit={() => onEditCourse(course)}
                onOpen={() => onOpenCourse(course)}
                progress={completedLessons[course.id]?.length ?? 0}
                role={role}
              />
            ))}
          </div>
        ) : !error ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-slate-800">No courses found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or choose a different category.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
