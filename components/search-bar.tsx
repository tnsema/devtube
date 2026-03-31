type SearchBarProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export function SearchBar({ value, isLoading, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m21 21-4.35-4.35" />
            <circle cx="11" cy="11" r="6" />
          </svg>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search cloud, AWS, Azure, Linux, DevOps..."
            className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-lg"
            aria-label="Search YouTube learning videos"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#072E33] px-6 text-base font-semibold text-white transition hover:bg-[#0a3d43] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search videos"}
        </button>
      </div>
    </form>
  );
}
