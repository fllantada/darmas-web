"use client";

import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = {
  name: string;
  path: string;
};

// Context

type BreadcrumbsContextType = {
  breadcrumbs: Crumb[];
  updateBreadcrumbs: (breadcrumbs: Crumb[]) => void;
};

export const BreadcrumbsContext = createContext<BreadcrumbsContextType | null>(
  null,
);

type BreadcrumbsProviderProps = {
  children: React.ReactNode;
};

// Provider

export function BreadcrumbsProvider({ children }: BreadcrumbsProviderProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumbs([]);
  }, [pathname]);

  const updateBreadcrumbs = useCallback((breadcrumbs: Crumb[]) => {
    setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, updateBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

// Setter

type CrumbSetterProps = {
  crumbs: Crumb[];
};

export function CrumbSetter({ crumbs }: CrumbSetterProps): undefined {
  const context = useContext(BreadcrumbsContext);

  useEffect(() => {
    if (context) {
      context.updateBreadcrumbs(crumbs);
    }
  }, [context, crumbs]);
}

// Consumer UI Component

type BreadcrumbsProps = {
  className?: string;
};

export function BreadcrumbsComponent({ className = "" }: BreadcrumbsProps) {
  const context = useContext(BreadcrumbsContext);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {context &&
          context.breadcrumbs.map((breadcrumb, index) => {
            const isLast = index == context.breadcrumbs.length - 1;

            return (
              <Fragment key={index}>
                {isLast ? (
                  <BreadcrumbItem>
                    <span className="text-black">{breadcrumb.name}</span>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem className="text-slate-700">
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.path}>{breadcrumb.name}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
