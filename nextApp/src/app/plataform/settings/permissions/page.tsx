import { Metadata } from "next";

import { getUsers } from "./actions";
import UserTable from "./components/UserTable/UserTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roles & Permissions",
};

export default async function PermissionsSettingsPage() {
  const users = await getUsers();

  return <UserTable users={users} />;
}
