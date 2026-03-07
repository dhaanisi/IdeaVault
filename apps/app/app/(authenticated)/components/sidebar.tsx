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
import { useEffect, type ReactNode } from "react";
import { useState } from "react";
import { Search } from "./search";
import { fa } from "zod/v4/locales";




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
  const[newTag, setNewTag] = useState("");
const [showInput, setShowInput] = useState(false);

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [editingTag, setEditingTag] = useState<string | null>(null);

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
                <SidebarMenuItem key={tag.id} className="group">
                  <SidebarMenuButton
                    asChild={editingTag !== tag.id}
                    className={cn(activeTag === tag.name && "bg-muted font-medium")}
                  >
                    {editingTag === tag.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <FolderIcon />
                        <input
                          autoFocus
                          defaultValue={tag.name}
                          onBlur={async (e) => {
                            const newName = e.target.value.trim();
                            if (!newName) {
                              setEditingTag(null);
                              return;
                            }

                            const res = await fetch("/api/tags", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: tag.id, name: newName }),
                            });

                            const updated = await res.json();

                            setTags((prev) => prev.map((t) => (t.id === tag.id ? updated : t)));
                            setEditingTag(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingTag(null);
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="bg-muted/40 border border-muted-foreground/30 rounded px-1 py-0.5 text-sm w-full outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ) : (
                      <Link href={`/?tag=${encodeURIComponent(tag.name)}`} className="flex items-center gap-2">
                        <FolderIcon />
                        <span>{tag.name}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>

                  <SidebarMenuAction className="opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted cursor-pointer">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingTag(tag.id);
                          }}
                        >
                          Rename
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={async () => {
                            await fetch("/api/tags", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: tag.id }),
                            });

                            setTags((prev) => prev.filter((t) => t.id !== tag.id));
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}

              {showInput ? (
  <SidebarMenuItem>
    <input
      autoFocus
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter" && newTag.trim() !== "") {
          const res = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newTag }),
          });

          const tag = await res.json();

          setTags([...tags, tag]);
          setNewTag("");
          setShowInput(false);
        }

        if (e.key === "Escape") {
          setShowInput(false);
          setNewTag("");
        }
      }}
      placeholder="New tag..."
      className="w-full rounded bg-black/40 px-2 py-1 text-sm outline-none"
    />
  </SidebarMenuItem>
) : (
  <SidebarMenuItem>
    <SidebarMenuButton onClick={() => setShowInput(true)}>
      <span className="text-muted-foreground">+ Add Tag</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
)}
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
