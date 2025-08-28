"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  includeSubpaths?: boolean;
};

export function AppBarLink({ href, children, includeSubpaths = false }: Props) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (includeSubpaths && pathname.startsWith(href + (href.endsWith("/") ? "" : "/")));

  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded transition hover:text-app-bar-foreground",
        isActive ? "text-primary-foreground" : "text-app-bar-foreground/70",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
