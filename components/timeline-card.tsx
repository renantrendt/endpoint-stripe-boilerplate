"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Video, ChevronDown } from "lucide-react"

interface TimelineItem {
  id: string
  type: "chat" | "videocall"
  title: string
  timestamp: string
  summary: string
}

interface TimelineCardProps {
  item: TimelineItem
}

export function TimelineCard({ item }: TimelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [comment, setComment] = useState("")

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
    // Aqui você implementaria a lógica de salvamento automático
    // Por exemplo, usando um debounce para não salvar a cada tecla
    // saveComment(item.id, e.target.value)
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-white flex items-center">
            {item.type === "chat" ? (
              <MessageSquare className="w-5 h-5 mr-2 text-wordware-orange" />
            ) : (
              <Video className="w-5 h-5 mr-2 text-wordware-purple" />
            )}
            {item.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full cursor-pointer text-muted-foreground hover:text-white"
        >
          <span className="text-sm">{item.timestamp}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-white mb-2">AI Summary</h4>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Comments</h4>
              <Textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                className="bg-[#121212] border-[#2F2F2F] text-white"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

