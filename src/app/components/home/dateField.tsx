import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays } from "lucide-react"

interface Props {
  value?: Date
  onSelect: (date: Date | undefined) => void
  placeholder: string
  disabled?: boolean
  disableBefore?: Date
  label?: string
}

export default function DateField({
  value,
  onSelect,
  placeholder,
  disabled,
  disableBefore,
  label,
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            className="h-10 w-full px-3 text-left border-b border-gray-200 flex items-center justify-between
                       text-gray-900 bg-transparent hover:border-gray-400 transition-colors duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
           <span className={value ? "text-gray-900 font-bold" : "text-gray-400 font-semibold"}>
  {value ? format(value, "dd MMM yyyy") : placeholder}
</span>
            <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
          </button>
        </PopoverTrigger>

        {!disabled && (
          <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-xl rounded-xl">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onSelect}
              disabled={(date) =>
                disableBefore ? date < disableBefore : false
              }
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
