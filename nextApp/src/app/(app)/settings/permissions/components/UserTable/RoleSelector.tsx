import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Role, User, useUserStore } from "../../store";

interface IProps {
  row: Row<User>;
}

export default function RoleSelector({ row }: IProps) {
  const [loading, setLoading] = useState(false);

  const { setRole } = useUserStore();

  return (
    <div className="flex items-center gap-2">
      <div className="size-[25px]">
        {loading ? (
          <Loader2 className="animate-spin inline-block" size={25} />
        ) : (
          " "
        )}
      </div>
      <Select
        value={String(row.getValue("role"))}
        onValueChange={async value => {
          setLoading(true);
          await setRole(row.original.id, value as Role);
          setLoading(false);
        }}
        disabled={loading}
      >
        <SelectTrigger className="w-[180px] w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Role.User.toString()}>User</SelectItem>
          <SelectItem value={Role.Admin.toString()}>Admin</SelectItem>
          <SelectItem value={Role.SuperAdmin.toString()}>
            Super Admin
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
