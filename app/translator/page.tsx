"use client"

import { useState } from "react"
import { Languages, ArrowLeftRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function TranslatorPage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [direction, setDirection] = useState<"en-to-ko" | "ko-to-en">("en-to-ko")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate")
      return
    }

    setError(null)
    setIsTranslating(true)

    try {
      const sourceLang = direction === "en-to-ko" ? "en" : "ko"
      const targetLang = direction === "en-to-ko" ? "ko" : "en"

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          sourceLang,
          targetLang,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || "Translation failed")
        toast({
          title: "Translation Error",
          description: data.message || "Failed to translate text",
          variant: "destructive",
        })
        return
      }

      setOutputText(data.translatedText)
      toast({
        title: "Translation Complete",
        description: "Your text has been translated successfully",
      })
    } catch (err: any) {
      const errorMessage = err?.message || "Network error. Please try again."
      setError(errorMessage)
      toast({
        title: "Translation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwap = () => {
    const tempText = inputText
    setInputText(outputText)
    setOutputText(tempText)
    setDirection(direction === "en-to-ko" ? "ko-to-en" : "en-to-ko")
    setError(null)
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setError(null)
  }

  const handleLanguageChange = (value: string) => {
    if (value === "en" || value === "ko") {
      setDirection(value === "en" ? "en-to-ko" : "ko-to-en")
      setError(null)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Languages className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Language Translator</h1>
              <p className="text-sm text-muted-foreground">English ⇄ Korean</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Input Language:</span>
              <Select
                value={direction === "en-to-ko" ? "en" : "ko"}
                onValueChange={handleLanguageChange}
                disabled={isTranslating}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">한국어 (Korean)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} disabled={isTranslating}>
                Clear
              </Button>
              <Button onClick={handleTranslate} disabled={isTranslating || !inputText.trim()}>
                {isTranslating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Translating...
                  </>
                ) : (
                  "Translate"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-6 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content - Dual Pane Interface */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Input Panel */}
        <div className="flex min-h-0 flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{direction === "en-to-ko" ? "English" : "한국어"}</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4">
            <Textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value)
                setError(null)
              }}
              placeholder={direction === "en-to-ko" ? "Enter English text..." : "한국어 텍스트를 입력하세요..."}
              className="h-full min-h-[200px] w-full resize-none border-0 p-0 text-base focus-visible:ring-0"
              disabled={isTranslating}
            />
          </div>

          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            {inputText.length} characters
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center bg-muted/20 px-2 py-2 lg:flex-col lg:py-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            disabled={isTranslating || (!inputText && !outputText)}
            title="Swap languages and content"
            className="h-10 w-10"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Output Panel */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{direction === "en-to-ko" ? "한국어" : "English"}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isTranslating ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Spinner className="h-8 w-8" />
                  <p className="text-sm">Translating...</p>
                </div>
              </div>
            ) : outputText ? (
              <div className="w-full whitespace-pre-wrap break-words text-base">{outputText}</div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p className="text-sm">
                  {direction === "en-to-ko" ? "번역 결과가 여기에 표시됩니다" : "Translation will appear here"}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            {outputText.length} characters
          </div>
        </div>
      </div>
    </div>
  )
}
