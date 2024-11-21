"use client";

import * as React from "react";
import { WalletMinimal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePersistStore } from "@/store/zustand";

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
// };

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sheets, transactions } = usePersistStore();
  const navMain = sheets
    ? sheets.map((sheet) => ({
        id: sheet.id,
        name: sheet.name,
        description: sheet.description,
        statistic: transactions
          ? transactions.filter(
              (transaction) => transaction.sheetId === sheet.id
            ).length < 0
            ? 0
            : transactions
                .filter((transaction) => transaction.sheetId === sheet.id)
                .reduce(function (acc, obj) {
                  return obj.account === "income"
                    ? acc + obj.amount
                    : acc - obj.amount;
                }, 0)
          : 0,
        url: "/sheets/" + sheet.id,
        icon: WalletMinimal,
      }))
    : [];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
