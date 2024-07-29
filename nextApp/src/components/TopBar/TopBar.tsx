import { BreadcrumbsComponent } from "@/app/plataform/contexts/BreadcrumbContext";
import { cn } from "@/app/plataform/lib/utils";

type TopBarProps = {
  className?: string;
};

export default function TopBar({ className }: TopBarProps) {
  return (
    <div
      className={cn(
        "bg-[#D9E1E0] text-[#17181C] p-4 relative flex flex-row",
        className,
      )}
    >
      <BreadcrumbsComponent className="basis-2/3 pt-2" />
      <div className="basis-1/3">
        <div className="float-right">User Section</div>
      </div>
    </div>
  );
}
