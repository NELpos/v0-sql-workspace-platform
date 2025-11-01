"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Briefcase, Languages } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
    description: "Chat with AI assistant",
  },
  {
    title: "Workspace",
    href: "/workspace",
    icon: Briefcase,
    description: "SQL workspace and editor",
  },
  {
    title: "Translator",
    href: "/translator",
    icon: Languages,
    description: "Language translation tools",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="hidden font-semibold sm:inline-block">SQL Platform</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (pathname === "/" && item.href === "/workspace")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
