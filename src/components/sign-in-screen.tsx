import type { FormEvent } from "react";

type SignInScreenProps = {
  username: string;
  password: string;
  error: string;
  loading: boolean;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function SignInScreen({
  username,
  password,
  error,
  loading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: SignInScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-5 py-12 font-sans text-slate-900">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_-32px_rgba(27,45,75,0.28)] md:min-h-[590px] md:grid-cols-[1fr_1fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-[#102542] p-8 text-white sm:p-12">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border border-white/10" />
          <div className="relative">
            <div className="mb-16 flex items-center gap-3 md:mb-24">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 font-bold text-[#102542]">
                L
              </div>
              <span className="text-sm font-semibold tracking-wide">
                LEARNSPACE
              </span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Learning starts here
            </p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Learn something new.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Sign in to browse courses, follow lessons, and track your learning
              progress.
            </p>
          </div>
          <p className="relative mt-16 text-xs text-slate-400">
            Demo login · not for production authentication
          </p>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <p className="text-sm font-semibold text-cyan-700">
                LEARNSPACE ACCOUNT
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Sign in
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your demo account details to continue.
              </p>
            </div>
            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10"
                  id="username"
                  name="username"
                  onChange={(event) => onUsernameChange(event.target.value)}
                  placeholder="Enter your username"
                  required
                  value={username}
                />
              </div>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10"
                  id="password"
                  name="password"
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={password}
                />
              </div>
              {error && (
                <p
                  aria-live="polite"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <button
                className="w-full rounded-xl bg-[#102542] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b3b64] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102542]"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Demo accounts
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Admin:{" "}
                <code className="font-medium text-slate-900">
                  admin / admin123
                </code>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                User:{" "}
                <code className="font-medium text-slate-900">
                  user / user123
                </code>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
