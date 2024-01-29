export default function LocationCheckboxComponent({
  checked,
  onChange,
}: {
  checked: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
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
