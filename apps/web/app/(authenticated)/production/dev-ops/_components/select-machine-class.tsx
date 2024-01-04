"use client"
import React from "react"
import { T_DBReturn } from "../../../../_types"
import { T_MachineClass } from "custom-validator"
import { FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import useDevOpsTimers from "./_state"

interface Props {
  machineClasses: T_DBReturn<T_MachineClass[]>
}

const SelectMachineClass: React.FC<Props> = ({ machineClasses }) => {
  const selectedMachineClasses = useDevOpsTimers(
    (state) => state.selectedMachineClasses
  )
  const setSelectedMachineClasses = useDevOpsTimers(
    (state) => state.setSelectedMachineClasses
  )
  return (
    <div>
      <h2>Machine Classes</h2>
      <FormControl sx={{ width: "100%", maxWidth: "220px" }}>
        <Select
          className="h-10"
          multiple
          displayEmpty
          value={selectedMachineClasses}
          onChange={(e: any) => setSelectedMachineClasses(e.target.value)}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Select Machine Classes</em>
            }

            return machineClasses?.items
              ?.filter((machine: any) =>
                selected?.includes(machine._id as string)
              )
              .map((machine: any) => machine?.name)
              .join(", ")
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            <em>Select Machine Classes</em>
          </MenuItem>
          {machineClasses?.items.map((machineClass) => (
            <MenuItem key={machineClass._id} value={machineClass._id}>
              {machineClass.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SelectMachineClass
