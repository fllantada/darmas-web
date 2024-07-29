import { Contact as ApiContact } from "@/generated/graphql";
import { User } from "lucide-react";

import { cn } from "@/app/plataform/lib/utils";

interface ContactProps {
  contact: ApiContact;
  className?: string;
}

export default function Contact({ className, contact }: ContactProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <User size={14} className="mt-1" />
      <div className="grow text-xs leading-5">
        <div>{contact.name}</div>
        <div className="text-[11px] text-slate-400">{contact.position}</div>
        {contact.mobile && <div>Mobile: {contact.mobile}</div>}
        {contact.telephone && <div>Phone: {contact.telephone}</div>}
        {contact.email && <div>Email: {contact.email}</div>}
      </div>
    </div>
  );
}
