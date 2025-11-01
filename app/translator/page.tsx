"use client"

import { Languages } from "lucide-react"

export default function TranslatorPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-6">
          <Languages className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Translator</h1>
        <p className="max-w-md text-muted-foreground">
          Language translation interface coming soon. This will provide powerful translation capabilities for multiple
          languages.
        </p>
      </div>
    </div>
  )
}
