"use client"

import { useState } from "react"
import _ from "lodash"
import {
  Autocomplete,
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@mui/material"
import { IoCheckbox } from "react-icons/io5"
import { MdCheckBoxOutlineBlank } from "react-icons/md"

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
      disabled
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
      renderTags={
        (value, getTagProps) => null
        //   (
        //   value.length ? <div className="flex overflow-hidden text-ellipsis">{value.length} Selected</div> : <div>Select</div>
        // )
      }
      limitTags={1}
      renderOption={(props, option, { selected }) => (
        <List component="nav" style={{ padding: 0 }}>
          <ListItem
            {...props}
            style={{
              padding: 0,
            }}
          >
            <Checkbox
              icon={<MdCheckBoxOutlineBlank />}
              checkedIcon={<IoCheckbox />}
              checked={selected}
            />
            {option.label}
            {/* <ListItemText primary={getOptionLabel(option)} /> */}
            <ListItemSecondaryAction />
          </ListItem>
        </List>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={
            Array.isArray(value) && value.length
              ? `${value?.length} Selected`
              : ""
          }
          inputProps={{
            ...params.inputProps,
            className: "placeholder-black placeholder:opacity-100",
          }}
          sx={{
            fontSize: "1rem",
            "& input": {
              paddingLeft: "0 !important", // Add !important to force the override
            },
          }}
        />
      )}
    />
  )
}
