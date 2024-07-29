import { ColumnDef } from "@tanstack/react-table";

import { User } from "../../store";
import DeactivatedField from "./DeactivatedField";
import RoleSelector from "./RoleSelector";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Users",
    cell: ({ row }) => row.getValue("name"),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => row.getValue("email"),
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Roles",
    cell: ({ row }) => <RoleSelector row={row} />,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "deactivated",
    header: "Deactivation Flag",
    cell: ({ row }) => <DeactivatedField row={row} />,
    enableHiding: false,
    enableGlobalFilter: false,
  },
];
