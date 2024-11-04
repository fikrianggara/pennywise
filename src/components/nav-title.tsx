"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { TypographyH2 } from "./ui/typhography";
import { ModeToggle } from "./toggle-button";

export function NavbarTitle() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div className="flex items-center justify-between">
            <Link href="/">
              <TypographyH2>PennyWise</TypographyH2>
            </Link>
            <ModeToggle />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
