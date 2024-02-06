"use client"

import { useQueryClient } from "@tanstack/react-query"
import useStoreSession from "../../../store/useStoreSession"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import { T_MachineClass } from "custom-validator"
import { Checkbox } from "antd"
import useUpdateUserProductionEye from "../../../hooks/users/useUpdateUserProductionEye"

const DefaultMachineClasses = () => {
  const queryClient = useQueryClient()
  const storeSession = useStoreSession((state) => state)
  const { data, mutate } = useUpdateUserProductionEye()

  const { userProfile } = useProductionEyeContext()
  const mc = useMachineClasses()

  const onChangeMachineClass = (checkedValues: any) => {
    console.log("checked machine classes = ", checkedValues)

    mutate({
      ...userProfile?.item,
      // @ts-ignore
      defaultSettings: {
        ...userProfile?.item?.defaultSettings,
        machineClasses: checkedValues,
      },
    })
    queryClient.invalidateQueries(["profile", storeSession.email])
  }

  const machineClassesCheckboxes = mc.data?.items.map(
    (item: T_MachineClass) => ({
      label: item.name,
      value: item._id as string,
    })
  )

  // console.log("data__", data)

  return (
    <Checkbox.Group
      options={machineClassesCheckboxes}
      defaultValue={
        userProfile?.item?.defaultSettings?.machineClasses as string[]
      }
      onChange={onChangeMachineClass}
      rootClassName="flex flex-col "
    />
  )
}

export default DefaultMachineClasses
