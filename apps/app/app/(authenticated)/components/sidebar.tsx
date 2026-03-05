"use client";

import { OrganizationSwitcher, UserButton } from "@repo/auth/client";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@repo/design-system/components/ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { NotificationsTrigger } from "@repo/notifications/components/trigger";
import {
  AnchorIcon,
  FolderIcon,
  LifeBuoyIcon,
  MoreHorizontalIcon,
  SendIcon,
  ShareIcon,
  Trash2Icon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Search } from "./search";

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: null,
      isActive: true,
      items: [],
    },
  ],
  navSecondary: [
   
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2Icon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },

  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: null,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: null,
    },
    {
      name: "Travel",
      url: "#",
      icon: null,
    },
  ],
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) return;
        const data = await res.json();
        setTags(data);
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };

    fetchTags();
  }, []);

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className={cn(
                  "h-[36px] overflow-hidden transition-all [&>div]:w-full",
                  sidebar.open ? "" : "-mx-1"
                )}
              >
                <OrganizationSwitcher
                  afterSelectOrganizationUrl="/"
                  hidePersonal
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Search />
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(!activeTag && "bg-muted font-medium")}>
                  <Link href="/">
                    <FolderIcon />
                    <span>All Ideas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            

              {tags.map((tag) => (
                <SidebarMenuItem key={tag.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(activeTag === tag.name && "bg-muted font-medium")}
                  >
                    <Link href={`/?tag=${encodeURIComponent(tag.name)}`}>
                      <FolderIcon />
                      <span>{tag.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "flex overflow-hidden w-full",
                    userButtonBox: "flex-row-reverse",
                    userButtonOuterIdentifier: "truncate pl-0",
                  },
                }}
                showName
              />
              <div className="flex shrink-0 items-center gap-px">
                <ModeToggle />
                <Button
                  asChild
                  className="shrink-0"
                  size="icon"
                  variant="ghost"
                >
                  <div className="h-4 w-4">
                    <NotificationsTrigger />
                  </div>
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
