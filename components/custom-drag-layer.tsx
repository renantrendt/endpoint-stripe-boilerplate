import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { type DragLayerMonitor, useDragLayer } from "react-dnd"

interface CustomDragLayerProps {
  columnLabels: { [key: string]: string }
}

export const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ columnLabels }) => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor: DragLayerMonitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  if (!isDragging || !currentOffset || !portalRoot) {
    return null
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`

  return createPortal(
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: 0,
        top: 0,
        transform,
      }}
    >
      <div
        style={{
          padding: "4px 8px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        {columnLabels[item.id]}
      </div>
    </div>,
    portalRoot,
  )
}

