import { Suspense } from "react";
import MapContent from "@/components/MapContent";

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[100dvh] bg-zinc-50">
          <div className="animate-spin h-6 w-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
