"use client"

import { useState } from "react"
import _ from "lodash"
import { Autocomplete, TextField } from "@mui/material"

export type T_SelectItem = {
  key: string
  label: string
}

export default function CustomSelectComponent({
  value,
  items,
  multiple,
  onChange,
  onInputChange,
}: {
  value?: T_SelectItem | T_SelectItem[] | null
  items: Array<T_SelectItem>
  onChange?: (item: any) => void
  onInputChange?: (val: string) => void
  multiple?: boolean
}) {
  const [input, setInput] = useState("")

  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => option.key === value?.key}
      value={value ?? (multiple ? [] : null)}
      size="small"
      onChange={(event, newValue) => {
        onChange?.(
          multiple ? [..._.uniqBy(newValue as T_SelectItem[], "key")] : newValue
        )
      }}
      inputValue={input}
      onInputChange={(_, newInputValue) => {
        setInput(newInputValue)
        onInputChange?.(newInputValue)
      }}
      disableCloseOnSelect={multiple}
      multiple={multiple}
      options={items ?? []}
      getOptionLabel={(option) => option.label || ""}
      renderTags={(value, getTagProps) => (
        <div className="flex overflow-hidden text-ellipsis">{value.length}</div>
      )}
      limitTags={1}
      renderInput={(params) => (
        <TextField
          {...params}
          aria-label="tag"
          placeholder="Selected"
          sx={{
            fontSize: "1rem",
          }}
        />
      )}
    />
  )
}