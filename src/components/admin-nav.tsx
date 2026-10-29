"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Overview" },
  { href: "/coaches", label: "Coaches" },
  { href: "/invite-codes", label: "Invite codes" },
];

export function AdminNav() {
  const pathname = usePathname();
  return <nav aria-label="Main navigation">{items.map((item) => {
    const active = pathname === item.href || pathname === `/athleteos/admin${item.href === "/" ? "" : item.href}`;
    return <Link key={item.href} href={item.href} className={active ? "activeNav" : undefined} aria-current={active ? "page" : undefined}>{item.label}</Link>;
  })}</nav>;
}
