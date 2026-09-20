export default function Loading({ fullScreen = false, text = 'Curating ArtHub...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-ivory-50/90 dark:bg-canvas-950/90 backdrop-blur-md flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-gold-500/20 border-b-gold-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
          </div>
          <p className="font-display text-sm tracking-wide text-canvas-700 dark:text-ivory-200">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-xs text-canvas-500 dark:text-ivory-400 font-medium">{text}</p>
    </div>
  );
}

export function ArtworkCardSkeleton() {
  return (
    <div className="card h-full flex flex-col bg-white dark:bg-canvas-850">
      <div className="aspect-[4/4.5] bg-ivory-200 dark:bg-canvas-800 shimmer relative overflow-hidden" />
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-5 w-4/5 bg-ivory-200 dark:bg-canvas-700 rounded-lg shimmer" />
          <div className="h-3.5 w-2/5 bg-ivory-200 dark:bg-canvas-700 rounded-lg shimmer" />
        </div>
        <div className="pt-3 border-t border-ivory-200 dark:border-canvas-750 flex justify-between items-center">
          <div className="h-5 w-16 bg-ivory-200 dark:bg-canvas-700 rounded-lg shimmer" />
          <div className="h-4 w-12 bg-ivory-200 dark:bg-canvas-700 rounded-lg shimmer" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-ivory-200 dark:border-canvas-800">
      <td className="px-6 py-4"><div className="h-4 w-32 bg-ivory-200 dark:bg-canvas-700 rounded-md shimmer" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-ivory-200 dark:bg-canvas-700 rounded-md shimmer" /></td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-ivory-200 dark:bg-canvas-700 rounded-md shimmer" /></td>
      <td className="px-6 py-4"><div className="h-4 w-28 bg-ivory-200 dark:bg-canvas-700 rounded-md shimmer" /></td>
    </tr>
  );
}
