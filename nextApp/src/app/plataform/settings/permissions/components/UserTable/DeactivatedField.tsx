import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import { User, useUserStore } from "../../store";

interface IProps {
  row: Row<User>;
}

export default function DeactivatedField({ row }: IProps) {
  const [loading, setLoading] = useState(false);
  const { setDeactivated } = useUserStore();

  return (
    <>
      {loading ? (
        <Loader2 className="animate-spin inline-block ml-3 mb-2" size={17} />
      ) : (
        <Checkbox
          checked={row.getValue("deactivated")}
          onCheckedChange={async checked => {
            setLoading(true);
            await setDeactivated(row.original.id, !!checked);
            setLoading(false);
          }}
        />
      )}
    </>
  );
}
