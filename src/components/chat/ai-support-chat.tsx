"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"
import { useState } from "react"

export const AISupportChat_v2414 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed right-4 bg-background shadow-2xl transition-all duration-200 ${
          isMinimized ? "bottom-4 h-14 w-80" : "bottom-4 h-[600px] w-80"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">QUAi Support</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-120px)]">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">
                        👋 Hi! I'm your QUAi assistant. How can I help you today?
                      </p>
                    </div>
                  </div>
                  {/* Message history will be added here */}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    // Handle message submission
                    setMessage("")
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  )
}
