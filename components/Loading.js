export default function Loading({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );
}

export function ArtworkCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex justify-between">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4"><div className="skeleton h-4 w-32" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-24" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-20" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-28" /></td>
    </tr>
  );
}
