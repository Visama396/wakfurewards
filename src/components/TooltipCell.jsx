import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Envoltorio de tooltip que funciona con hover (desktop) y tap (móvil).
 * Usa estado manual para soportar tap: al hacer clic se togglea el tooltip.
 */
export default function TooltipCell({ children, content, side, align }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild onClick={() => setOpen(prev => !prev)}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
