"use client";

import {
  CircleAlert,
  Eye,
  FileDown,
  MoreHorizontal,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DrawerDialog } from "./drawerDialog";
import { AddSheetForm } from "./form";
import Link from "next/link";
import { usePersistStore } from "@/store/zustand";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export function NavMain({
  items,
}: {
  items: {
    id: string;
    name: string;
    url: string;
    statistic: number;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { deleteSheetById } = usePersistStore();

  // const { deleteSheetById } = useStore();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Sheets</SidebarGroupLabel>
      <SidebarMenu>
        {items.length > 0 &&
          items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <div className="p-6 flex items-center">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      <item.icon size={18} />
                    </AvatarFallback>
                  </Avatar>

                  <Link href={item.url} className="flex flex-col space-y-1">
                    <span className="font-medium">{item.name}</span>
                    {item.statistic == 0 ? (
                      <span className="text-xs text-muted-foreground">0</span>
                    ) : (
                      <span
                        className={`text-xs ${
                          item.statistic < 0
                            ? "text-rose-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {item.statistic < 0
                          ? `- Rp. ${-1 * item.statistic}`
                          : "Rp. " + item.statistic}
                      </span>
                    )}
                  </Link>
                </div>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover className="self-center">
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Eye className="text-muted-foreground" />
                    <Link href={`/sheets/${item.id}`}>Lihat Sheet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileDown className="text-muted-foreground" />
                    <button onClick={() => console.log("coming soon")}>
                      Export Sheet
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DrawerDialog
                    title={`Hapus sheet ${item.name}`}
                    description={""}
                    content={
                      <div className="p-4 md:p-0 space-y-2">
                        <Alert>
                          <CircleAlert className="h-4 w-4" />
                          <AlertTitle>Perhatian!</AlertTitle>
                          <AlertDescription>
                            Tindakan yang akan anda lakukan tidak dapat
                            dipulihkan
                          </AlertDescription>
                        </Alert>
                        <Button
                          className="w-full"
                          onClick={() => deleteSheetById(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    }
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="text-muted-foreground" />
                        <span>Hapus </span>
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        <SidebarMenuItem>
          <DrawerDialog
            trigger={
              <SidebarMenuButton className="text-sidebar-foreground/70 flex justify-between items-center">
                <div className="flex space-x-2 items-center">
                  <Plus size={16} className="mr-2" /> Sheet
                </div>

                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded borderpx-1.5 font-mono text-[10px] font-medium border bg-muted px-1.5 text-muted-foreground opacity-100">
                  <span className="text-sm">⌘</span>K
                </kbd>
              </SidebarMenuButton>
            }
            title={"Tambah sheet"}
            description={"Tambah sheet baru"}
            shortcutKey="k"
            content={<AddSheetForm />}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
