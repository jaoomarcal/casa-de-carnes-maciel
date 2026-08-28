import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder de um card enquanto o Supabase responde */
export function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ n = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
