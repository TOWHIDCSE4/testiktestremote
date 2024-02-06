export default function LocationCheckboxComponent({
  checked,
  onChange,
  classNames,
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
  classNames: string
}) {
  return (
    <label
      className={`relative inline-flex items-center mr-1 cursor-pointer ${classNames}`}
    >
      <input
        checked={checked}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.checked)
          }
        }}
        type="checkbox"
        className="sr-only peer"
      />
      <div className="w-3 h-3 bg-white border-2 border-white shadow-sm shadow-gray-500 peer peer-checked:bg-black"></div>
    </label>
  )
}
