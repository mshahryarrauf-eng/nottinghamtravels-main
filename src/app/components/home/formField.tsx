interface Props {
  value?: string
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  type?: string
  label?: string
}

export default function FormField({
  value,
  placeholder,
  onChange,
  readOnly,
  type = "text",
  label,
}: Props) {
  return (
    <div className="relative w-full group">
  {label && (
    <label className="block w-full text-left text-xs pl-3 font-semibold text-black mb-1">
      {label}
    </label>
  )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        className="h-10 w-full px-3 bg-transparent outline-none border-b border-gray-200
                   focus:border-gray-900 transition-colors duration-200
                   text-gray-900 font-bold
                   placeholder:text-gray-500 placeholder:font-semibold"
      />
      <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-gray-900 transition-all duration-300 group-focus-within:w-full" />
    </div>
  )
}
