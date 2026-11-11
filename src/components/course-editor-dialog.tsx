import type { FormEvent } from "react";
import type { Course } from "@/src/types/course";

type CourseEditorDialogProps = {
  course: Course;
  categories: string[];
  error: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CourseEditorDialog({
  course,
  categories,
  error,
  saving,
  onClose,
  onSubmit,
}: CourseEditorDialogProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="edit-course-title"
        aria-modal="true"
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-800">
              Admin course management
            </p>
            <h2 className="mt-1 text-2xl font-bold" id="edit-course-title">
              Edit course
            </h2>
          </div>
          <button
            aria-label="Close edit form"
            className="rounded-lg px-3 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Course title
            <input
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10"
              defaultValue={course.title}
              name="title"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Category
              <select
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-cyan-700"
                defaultValue={course.category}
                name="category"
              >
                {categories.slice(1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Level
              <select
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-cyan-700"
                defaultValue={course.level}
                name="level"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Instructor
              <input
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-700"
                defaultValue={course.instructor}
                name="instructor"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Duration
              <input
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-700"
                defaultValue={course.duration}
                name="duration"
                required
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-700"
              defaultValue={course.description}
              name="description"
              required
              rows={3}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Lessons{" "}
            <span className="font-normal text-slate-500">(one per line)</span>
            <textarea
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-700"
              defaultValue={course.lessons.join("\n")}
              name="lessons"
              required
              rows={5}
            />
          </label>
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-[#102542] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b3b64] disabled:opacity-50"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
