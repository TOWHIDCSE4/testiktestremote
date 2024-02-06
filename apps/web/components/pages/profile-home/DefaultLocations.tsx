"use client"
import { useQueryClient } from "@tanstack/react-query"
import { Checkbox } from "antd"
import useLocations from "../../../hooks/locations/useLocations"
import useUpdateUserProductionEye from "../../../hooks/users/useUpdateUserProductionEye"
import useStoreSession from "../../../store/useStoreSession"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"

const DefaultLocations = () => {
  const queryClient = useQueryClient()
  const storeSession = useStoreSession((state) => state)
  const { data, mutate } = useUpdateUserProductionEye()

  const { userProfile } = useProductionEyeContext()
  const { data: locations } = useLocations()

  const onChangeLocations = (checkedValues: any) => {
    console.log("checked locations = ", checkedValues)
    mutate({
      ...userProfile?.item,
      // @ts-ignore
      defaultSettings: {
        ...userProfile?.item?.defaultSettings,
        locations: checkedValues,
      },
    })
    queryClient.invalidateQueries(["profile", storeSession.email])
  }

  const locationsCheckboxes = locations?.items.map((item) => ({
    label: item.name,
    value: item._id as string,
  }))

  // console.log("data__", data)

  return (
    <Checkbox.Group
      options={locationsCheckboxes}
      defaultValue={userProfile?.item?.defaultSettings?.locations as string[]}
      onChange={onChangeLocations}
      rootClassName="flex flex-col"
    />
  )
}

export default DefaultLocations
