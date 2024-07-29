"use client";

import React, { ReactNode, useContext, useState } from "react";

import { cn } from "@/lib/utils";

import ChevronDownIcon from "../icons/chevronDown";

// Context to share state between components
const CollapsibleContext = React.createContext<
  { isOpen: boolean; toggleOpen: () => void } | undefined
>(undefined);

interface CollapsibleProps {
  children: ReactNode;
  startOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  startOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggleOpen }}>
      <>{children}</>
    </CollapsibleContext.Provider>
  );
};

const CollapsibleTitle: React.FC<{ children: ReactNode }> = ({ children }) => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleTitle must be used within a Collapsible");
  }
  const { toggleOpen, isOpen } = context;

  return (
    <div onClick={toggleOpen} className="cursor-pointer select-none">
      <div className="flex">
        <div className="flex-auto">{children}</div>
        <ChevronDownIcon
          className={cn(
            "inline float-right flex-none transition-transform text-[#727B9D]",
            {
              "rotate-180": isOpen,
            },
          )}
        />
      </div>
    </div>
  );
};

const CollapsibleContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleContent must be used within a Collapsible");
  }
  const { isOpen } = context;

  return isOpen ? <>{children}</> : null;
};

export { Collapsible, CollapsibleTitle, CollapsibleContent };
