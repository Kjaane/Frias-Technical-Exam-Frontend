import type { Course, LessonProgress } from "@/src/types/course";

type CoursePlayerProps = {
  course: Course;
  activeLesson: number;
  completedLessons: LessonProgress;
  onBack: () => void;
  onMarkComplete: () => void;
  onNextLesson: () => void;
  onSelectLesson: (index: number) => void;
};

export default function CoursePlayer({
  course,
  activeLesson,
  completedLessons,
  onBack,
  onMarkComplete,
  onNextLesson,
  onSelectLesson,
}: CoursePlayerProps) {
  const completed = completedLessons[course.id] ?? [];
  const currentLesson = course.lessons[activeLesson];
  const isCurrentLessonComplete = completed.includes(activeLesson);

  return (
    <div>
      <button
        className="mb-6 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
        onClick={onBack}
        type="button"
      >
        ← Back to all courses
      </button>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div
            className={`flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br ${course.color} text-7xl font-bold text-white shadow-lg sm:text-8xl`}
          >
            {course.icon}
          </div>
          <div className="mt-7">
            <p className="text-sm font-semibold text-cyan-800">
              {course.category}{" "}
              <span className="px-1 text-slate-300">/</span> Lesson{" "}
              {activeLesson + 1} of {course.lessons.length}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {currentLesson}
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              {course.description}
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Lesson overview
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                In this lesson, you&apos;ll work through the key ideas behind{" "}
                {currentLesson.toLowerCase()}. Follow along at your own pace,
                take notes, and use the course outline to move between lessons.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="rounded-xl bg-[#102542] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3b64] disabled:cursor-default disabled:bg-emerald-700"
                  disabled={isCurrentLessonComplete}
                  onClick={onMarkComplete}
                  type="button"
                >
                  {isCurrentLessonComplete
                    ? "Lesson completed ✓"
                    : "Mark lesson complete"}
                </button>
                <button
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                  disabled={activeLesson === course.lessons.length - 1}
                  onClick={onNextLesson}
                  type="button"
                >
                  Next lesson →
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Course content</h2>
          <p className="mt-1 text-sm text-slate-500">
            {course.lessons.length} lessons · {course.duration}
          </p>
          <div className="mt-5 space-y-2">
            {course.lessons.map((lesson, index) => {
              const isComplete = completed.includes(index);
              const isActive = activeLesson === index;

              return (
                <button
                  aria-current={isActive ? "step" : undefined}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    isActive
                      ? "bg-cyan-50 text-cyan-950"
                      : "hover:bg-slate-50"
                  }`}
                  key={`${course.id}-${index}`}
                  onClick={() => onSelectLesson(index)}
                  type="button"
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isComplete
                        ? "bg-emerald-100 text-emerald-800"
                        : isActive
                          ? "bg-cyan-800 text-white"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isComplete ? "✓" : index + 1}
                  </span>
                  <span className="text-sm font-medium leading-5">{lesson}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
