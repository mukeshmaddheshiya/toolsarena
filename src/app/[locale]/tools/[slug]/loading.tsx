export default function ToolLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>

      {/* Title skeleton */}
      <div className="mt-4 mb-6">
        <div className="h-8 w-72 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded mt-3" />
      </div>

      {/* Tool area skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="h-64 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
      </div>
    </div>
  );
}
