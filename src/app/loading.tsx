export default function Loading() {
  return (
    <main
      className="mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center px-4 py-28 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">正在展开页面内容</p>
      <div className="route-loading-sheet w-full rounded-[2rem] border border-[#36513B]/14 bg-[#FFFEF9]/88 p-6 shadow-[0_20px_56px_rgba(38,53,42,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-[var(--surface)]/92 sm:p-10">
        <div className="mb-9 flex items-center gap-3">
          <span className="size-9 rounded-full bg-[#E4E9DD] dark:bg-[var(--surface-2)]" />
          <span className="h-3 w-24 rounded-full bg-[#E4E9DD] dark:bg-[var(--surface-2)]" />
        </div>

        <div className="mb-12 space-y-4">
          <span className="block h-10 w-[min(26rem,78%)] rounded-2xl bg-[#33483A]/12 dark:bg-white/12 sm:h-14" />
          <span className="block h-4 w-[min(34rem,92%)] rounded-full bg-[#33483A]/8 dark:bg-white/8" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-3xl border border-[#36513B]/10 bg-[#F6F4EC]/78 p-4 dark:border-white/8 dark:bg-[var(--surface-2)]/72 ${
                index === 1 ? "md:translate-y-5" : index === 2 ? "md:-translate-y-2" : ""
              }`}
            >
              <div className="mb-4 aspect-[4/3] rounded-2xl bg-[#718F6E]/18 dark:bg-white/8" />
              <div className="space-y-2">
                <span className="block h-4 w-4/5 rounded-full bg-[#33483A]/13 dark:bg-white/12" />
                <span className="block h-3 w-3/5 rounded-full bg-[#33483A]/8 dark:bg-white/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
