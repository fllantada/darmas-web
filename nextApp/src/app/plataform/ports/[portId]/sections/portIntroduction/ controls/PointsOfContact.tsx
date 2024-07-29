"use client";

import { useState } from "react";
import { Contact as ApiContact } from "@/generated/graphql";
import { ChevronDown } from "lucide-react";

import { cn } from "@/app/plataform/lib/utils";

import Contact from "./Contact";

interface IProps {
  contacts: ApiContact[];
}

export default function PointsOfContact({ contacts }: IProps) {
  const [expanded, setExpanded] = useState(false);

  if (contacts.length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="text-sm font-semibold mt-4 mb-2">PoC:</h3>
      <Contact contact={contacts[0]} />
      {contacts.length > 1 && (
        <>
          {expanded &&
            contacts
              .slice(1)
              .map((contact, index) => (
                <Contact key={index} contact={contact} className="mt-2" />
              ))}
          <div
            className="text-xs text-green-500 my-3 ml-14 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Less contacts" : "Show more contacts"}
            <ChevronDown
              className={cn("inline-block", { "rotate-180": expanded })}
              size={12}
            />
          </div>
        </>
      )}
    </>
  );
}
