import { Shell, SkeletonGrid } from "./ui";

export default function Loading() {
  return (
    <Shell>
      <div className="loading-page" aria-busy="true">
        <div className="loading-skeleton-header">
          <div className="skeleton line" style={{ width: "30%", height: 32, marginBottom: 16 }} />
          <div className="skeleton line" style={{ width: "50%", height: 16, marginBottom: 32 }} />
        </div>
        <SkeletonGrid count={8} />
      </div>
    </Shell>
  );
}
