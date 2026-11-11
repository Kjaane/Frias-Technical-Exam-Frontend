import type { SignedInUser } from "@/src/types/auth";

type LearningSpaceHeaderProps = {
  user: SignedInUser;
  onHome: () => void;
  onSignOut: () => void;
};

export default function LearningSpaceHeader({
  user,
  onHome,
  onSignOut,
}: LearningSpaceHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          className="flex items-center gap-3"
          onClick={onHome}
          type="button"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102542] font-bold text-cyan-300">
            L
          </span>
          <span className="text-sm font-bold tracking-wide">LEARNSPACE</span>
        </button>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-slate-500 sm:inline">
            Welcome,{" "}
            <span className="font-semibold text-slate-800">
              {user.username}
            </span>
          </span>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold capitalize text-cyan-800">
            {user.role}
          </span>
          <button
            className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-50"
            onClick={onSignOut}
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
