"use client"
import {
  Checkbox,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material"
import { T_MachineClass } from "custom-validator"
import React from "react"
import { T_DBReturn } from "../../../../_types"
import useMachineClasses from "../hooks/useMachineClasses"
import useDevOpsTimers from "./_state"

interface Props {
  machineClasses: T_DBReturn<T_MachineClass[]>
}

const SelectMachineClass: React.FC = () => {
  const query = useMachineClasses()
  const machineClasses = query?.data
  const selectedMachineClasses = useDevOpsTimers(
    (state) => state.selectedMachineClasses
  )
  const setSelectedMachineClasses = useDevOpsTimers(
    (state) => state.setSelectedMachineClasses
  )
  return query.isLoading || query.isFetching ? (
    <div>Loading ...</div>
  ) : (
    <div>
      <h2 className="font-semibold">Machine Classes</h2>
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
              <Checkbox
                checked={
                  selectedMachineClasses.indexOf(machineClass._id as string) >
                  -1
                }
              />
              {machineClass.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SelectMachineClass
