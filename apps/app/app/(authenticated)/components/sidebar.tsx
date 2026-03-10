"use client";

import { OrganizationSwitcher, UserButton } from "@repo/auth/client";
import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
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
  useSidebar,
} from "@repo/design-system/components/ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { NotificationsTrigger } from "@repo/notifications/components/trigger";
import {
  HashIcon,
  LayoutDashboardIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Search } from "./search";

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

const navSecondary = [
  { title: "Trash", url: "/trash", icon: Trash2Icon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) return;
        const data = await res.json();
        setTags(Array.isArray(data) ? data : data.tags ?? []);
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };
    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag }),
    });
    const tag = await res.json();
    setTags((prev) => [...prev, tag]);
    setNewTag("");
    setShowInput(false);
  };

  const handleRenameTag = async (id: string, name: string) => {
    if (!name.trim()) { setEditingTag(null); return; }
    const res = await fetch("/api/tags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
    const updated = await res.json();
    setTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditingTag(null);
  };

  const handleDeleteTag = async (id: string) => {
    await fetch("/api/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <Sidebar variant="inset">

        {/* ── Header ── */}
        <SidebarHeader className="border-b border-white/[0.06] pb-3">
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

        {/* ── Search ── */}
        <div className="px-2 py-2">
          <Search />
        </div>

        <SidebarContent className="gap-0">

          {/* ── All Ideas ── */}
          <SidebarGroup className="py-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "rounded-lg text-sm transition-colors",
                    !activeTag
                      ? "bg-indigo-500/15 text-indigo-300 font-medium hover:bg-indigo-500/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <Link href="/" className="flex items-center gap-2.5">
                    <LayoutDashboardIcon className="h-4 w-4 shrink-0" />
                    <span>All Ideas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* ── Tags ── */}
          <SidebarGroup className="group-data-[collapsible=icon]:hidden pt-2">
            <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              Tags
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {tags.map((tag) => (
                <SidebarMenuItem key={tag.id} className="group/item">
                  <SidebarMenuButton
                    asChild={editingTag !== tag.id}
                    className={cn(
                      "rounded-lg text-sm transition-all duration-150",
                      activeTag === tag.name
                        ? "bg-indigo-500/15 text-indigo-300 font-medium"
                        : "text-white/55 hover:bg-white/5 hover:text-white/85"
                    )}
                  >
                    {editingTag === tag.id ? (
                      <div className="flex items-center gap-2 w-full px-1">
                        <HashIcon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                        <input
                          autoFocus
                          defaultValue={tag.name}
                          onBlur={(e) => handleRenameTag(tag.id, e.target.value.trim())}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingTag(null);
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          }}
                          className="w-full rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-sm text-white outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    ) : (
                      <Link
                        href={`/?tag=${encodeURIComponent(tag.name)}`}
                        className="flex items-center gap-2.5"
                      >
                        <HashIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                        <span className="truncate">{tag.name}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>

                  {/* ⋯ action — only visible on row hover */}
                  <SidebarMenuAction className="opacity-0 transition-opacity group-hover/item:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10 cursor-pointer">
                          <MoreHorizontalIcon className="h-3.5 w-3.5 text-white/50" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => setEditingTag(tag.id)}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400 focus:text-red-400"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}

              {/* Add tag row */}
              <SidebarMenuItem>
                {showInput ? (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <HashIcon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                    <input
                      autoFocus
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") await handleCreateTag();
                        if (e.key === "Escape") { setShowInput(false); setNewTag(""); }
                      }}
                      onBlur={() => { if (!newTag.trim()) { setShowInput(false); } }}
                      placeholder="Tag name..."
                      className="w-full rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-indigo-500/50"
                    />
                  </div>
                ) : (
                  <SidebarMenuButton
                    onClick={() => setShowInput(true)}
                    className="rounded-lg text-xs text-white/30 hover:bg-white/5 hover:text-white/60 transition-colors"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add tag</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* ── Bottom nav ── */}
          <SidebarGroup className="mt-auto border-t border-white/[0.05] pt-3">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="rounded-lg text-sm text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors"
                    >
                      <Link href={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ── Footer ── */}
        <SidebarFooter className="border-t border-white/[0.06] pt-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex w-full items-center justify-between gap-2">
                <UserButton
                  appearance={{
                    elements: {
                      rootBox: "flex overflow-hidden",
                      userButtonBox: "flex-row-reverse",
                      userButtonOuterIdentifier: "truncate pl-0 text-sm text-white/70",
                    },
                  }}
                  showName
                />
                <div className="flex shrink-0 items-center gap-0.5">
                  <ModeToggle />
                  <Button asChild className="shrink-0" size="icon" variant="ghost">
                    <div className="h-4 w-4">
                      <NotificationsTrigger />
                    </div>
                  </Button>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};