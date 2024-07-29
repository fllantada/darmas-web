import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { runWithAmplifyServerContext } from "@/utils/AmplifyServerUtils";
import { getCurrentUser } from "@aws-amplify/auth/server";
import { User } from "lucide-react";

import { getUser } from "./actions";
import AccountForm from "./components/AccountForm";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function AccountSettingsPage() {
  const authUser = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: contextSpec => getCurrentUser(contextSpec),
  });

  if (authUser.username) {
    const user = await getUser(authUser.username);

    return (
      <div className="flex">
        <div className="mr-10">
          <div className="bg-slate-400 size-[70px] rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
        </div>
        <div className="w-[450px]">
          <AccountForm user={user} />
        </div>
      </div>
    );
  }

  return notFound();
}
