"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface ContextMenuProps {
  children: React.ReactNode
  items: ContextMenuItem[]
}

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  separator?: boolean
  disabled?: boolean
}

export function ContextMenu({ children, items }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleClick = () => setIsOpen(false)
    const handleScroll = () => setIsOpen(false)

    document.addEventListener("click", handleClick)
    document.addEventListener("scroll", handleScroll, true)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("scroll", handleScroll, true)
    }
  }, [isOpen])

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick()
      setIsOpen(false)
    }
  }

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 min-w-[180px] rounded-md border border-border bg-card p-1 shadow-lg"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {items.map((item, index) => (
              <div key={index}>
                {item.separator ? (
                  <div className="my-1 h-px bg-border" />
                ) : (
                  <button
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                      item.disabled
                        ? "cursor-not-allowed text-muted-foreground opacity-50"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
