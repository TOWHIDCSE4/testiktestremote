import { ReactNode, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../../../@/components/ui/collapsible"
import { HiChevronRight } from "react-icons/hi"

export default function DeviceCategoryDropdownComponent({
  disabled,
  children,
  title,
  endContent,
}: {
  disabled?: boolean
  children?: ReactNode
  title?: string | ReactNode
  endContent?: string | ReactNode
}) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <div className="py-4 border-b border-opacity-50 CollapsibleContent border-disabled">
      <Collapsible disabled={disabled} open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={`flex text-sm uppercase items-center gap-1 ${
            open ? "text-gold" : ""
          }`}
        >
          <HiChevronRight
            className={`text-lg transition-all ${open ? "rotate-90" : ""}`}
          />
          {title}
          {endContent}
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
