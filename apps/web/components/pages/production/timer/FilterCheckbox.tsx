import { T_MachineClass } from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"

type T_Props = {
  machineClass: T_MachineClass
  isAllSelected: boolean
  setSelectedMachineClasses: Dispatch<
    (T_MachineClass & { isSelected: boolean })[]
  >
  selectedMachineClasses: (T_MachineClass & { isSelected: boolean })[]
  filterCheck: Function
  checkBoxValues: object | string
}

const FilterCheckbox = ({
  machineClass,
  isAllSelected,
  setSelectedMachineClasses,
  selectedMachineClasses,
  filterCheck,
  checkBoxValues,
}: T_Props) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleOnChange = (e: any) => {
    const { id, checked } = e.target
    filterCheck({
      //@ts-expect-error
      ...checkBoxValues,
      [id]: checked,
    })
    const machineClassIndex = selectedMachineClasses.findIndex(
      (selectedMachineClass) => selectedMachineClass._id === machineClass._id
    )
    const updatedMachineClasses = [...selectedMachineClasses]
    updatedMachineClasses[machineClassIndex] = {
      ...updatedMachineClasses[machineClassIndex],
      isSelected: !isChecked,
    }
    setSelectedMachineClasses(updatedMachineClasses)
    setIsChecked(!isChecked)
  }
  useEffect(() => {
    setIsChecked(isAllSelected)
  }, [isAllSelected])
  return (
    <div className="relative px-4 py-0.5 flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={machineClass.name}
          aria-describedby="pipe-box-description"
          name={machineClass._id as string}
          type="checkbox"
          checked={
            //@ts-expect-error
            checkBoxValues[machineClass.name] || isChecked
          }
          onChange={(e) => handleOnChange(e)}
          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={machineClass.name} className="text-gray-700">
          {machineClass.name}
        </label>
      </div>
    </div>
  )
}

export default FilterCheckbox
