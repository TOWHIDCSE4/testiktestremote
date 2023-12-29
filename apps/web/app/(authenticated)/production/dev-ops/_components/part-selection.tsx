"use client"
import { Autocomplete, TextField } from "@mui/material"
import { T_Part } from "custom-validator"
import React from "react"

type T_Single_Job_Type = { label: string; id: string }

interface Props {
  parts: T_Part[] | undefined
  defaultPart: T_Part | undefined
}

const PartSelection: React.FC<Props> = ({ defaultPart, parts }) => {
  return (
    <Autocomplete
      disabled
      size="small"
      disablePortal
      value={
        // { id: defaultPart?._id, label: defaultPart?.name }
        {
          label: "Test Part",
          id: "test-part",
        }
      }
      options={
        [
          {
            label: "Test Part",
            id: "test-part",
          },
        ]
        //  parts?.map((part: any) => ({
        //     label: part.name,
        //     id: part._id,
        //   })) as T_Single_Job_Type[]
      }
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField className="focus:border-none" {...params} />
      )}
    />
  )
}

export default PartSelection
