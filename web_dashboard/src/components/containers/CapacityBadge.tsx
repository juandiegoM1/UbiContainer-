import {
  CAPACITY_ALERT_THRESHOLD,
  getContainerCapacityStatus,
} from "@/lib/containerCapacity";
import { ContainerRow } from "@/lib/containers";

type CapacityBadgeProps = {
  container: Pick<ContainerRow, "nivel_llenado" | "estado">;
  showBar?: boolean;
};

export function CapacityBadge({ container, showBar = true }: CapacityBadgeProps) {
  const status = getContainerCapacityStatus(container);

  return (
    <div className="min-w-[140px]">
      <span
        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
        style={{ backgroundColor: status.color }}
      >
        {status.label}
      </span>
      {showBar ? (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${status.nivel}%`,
              backgroundColor: status.color,
            }}
          />
        </div>
      ) : null}
      {status.isAlert ? (
        <p className="mt-1 text-[10px] font-medium text-orange-700">
          Alerta: capacidad &gt;= {CAPACITY_ALERT_THRESHOLD}%
        </p>
      ) : null}
    </div>
  );
}
