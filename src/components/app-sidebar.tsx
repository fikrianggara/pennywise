"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  WalletMinimal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { transactions } from "@/data/transaction";

const sheets = [
  ...new Set(transactions.map((transaction) => transaction.sheetId)),
];

const navMain = sheets.map((sheetId) => ({
  name: sheetId,
  statistic: transactions
    .filter((transaction) => transaction.sheetId === sheetId)
    .reduce(function (acc, obj) {
      return obj.account === "income"
        ? acc + obj.amount * 1000
        : acc - obj.amount * 1000;
    }, 0),
  url: "/sheets/" + sheetId,
  icon: WalletMinimal,
}));
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  //   navMain: [
  //     {
  //       title: "Monthly",
  //       url: "#",
  //       icon: Calendar1,
  //       isActive: true,
  //       items: [
  //         {
  //           title: "January",
  //           url: "#",
  //         },
  //         {
  //           title: "February",
  //           url: "#",
  //         },
  //         {
  //           title: "March",
  //           url: "#",
  //         },
  //         {
  //           title: "April",
  //           url: "#",
  //         },
  //         {
  //           title: "May",
  //           url: "#",
  //         },
  //         {
  //           title: "June",
  //           url: "#",
  //         },
  //         {
  //           title: "July",
  //           url: "#",
  //         },
  //         {
  //           title: "August",
  //           url: "#",
  //         },
  //         {
  //           title: "September",
  //           url: "#",
  //         },
  //         {
  //           title: "October",
  //           url: "#",
  //         },
  //         {
  //           title: "November",
  //           url: "#",
  //         },
  //         {
  //           title: "December",
  //           url: "#",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Annually",
  //       url: "#",
  //       icon: CalendarRange,
  //       items: [
  //         {
  //           title: "2023",
  //           url: "#",
  //         },
  //         {
  //           title: "2024",
  //           url: "#",
  //         },
  //       ],
  //     },
  //   ],
  navMain: navMain,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        {/* <NavbarTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
