"use client";

import type { SlideField } from "@/data/cases";

interface SlideViewerProps {
  fields: SlideField[];
  autoFocus?: boolean;
}

/**
 * Legacy DZI viewer stub — OpenSeaDragon has been removed.
 * All slides now use SVGSlideViewer. This stub exists only for
 * backward compatibility with ExamViewer until it is migrated.
 */
export default function SlideViewer({ fields }: SlideViewerProps) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-950 text-gray-500 text-sm p-8 text-center">
      <div>
        <p className="font-medium text-gray-400 mb-2">DZI viewer has been replaced by SVG</p>
        <p>This slide has {fields.length} field(s). Migrate to SVGSlideViewer to view.</p>
      </div>
    </div>
  );
}
