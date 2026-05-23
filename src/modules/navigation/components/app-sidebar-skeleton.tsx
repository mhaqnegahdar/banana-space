// RSC — pure skeleton, no state needed
export function AppSidebarSkeleton() {
  return (
    <div className="hidden md:flex h-full">
      {/* Server icon column */}
      <div className="w-[calc(var(--sidebar-width-icon)+1px)] border-r flex flex-col items-center gap-2 py-3 px-1.5 bg-sidebar">
        <div className="size-9 rounded-xl bg-muted animate-pulse mb-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="size-8 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      {/* Channel list column */}
      <div className="flex-1 flex flex-col bg-sidebar">
        <div className="h-12 border-b bg-muted/30 animate-pulse" />
        <div className="h-9 mx-2 mt-2 rounded-md bg-muted animate-pulse" />
        <div className="flex-1 px-2 pt-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}