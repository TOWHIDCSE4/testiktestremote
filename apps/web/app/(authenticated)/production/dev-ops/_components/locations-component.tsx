"use client"
import { Checkbox } from "@mui/material"
import FormControl from "@mui/material/FormControl"
import MenuItem from "@mui/material/MenuItem"
import OutlinedInput from "@mui/material/OutlinedInput"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { T_Location } from "custom-validator"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { T_DBReturn } from "../../../../_types"

interface Props {
  locations: T_DBReturn<T_Location[]>
}

const LocationsSelection: React.FC<Props> = ({ locations }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramsLocations = searchParams.get("location")
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>(
    paramsLocations?.split(",") as string[]
  )

  const handleChange = (event: SelectChangeEvent<typeof selectedLocations>) => {
    const {
      target: { value },
    } = event
    setSelectedLocations(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )
  }

  // React.useEffect(() => {
  //   router.replace(
  //     `/production/dev-ops?location=${selectedLocations.join(",").toString()}`
  //   )
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedLocations])

  return (
    <div className="">
      <h2 className="font-semibold">Locations</h2>
      <FormControl sx={{ width: "100%" }}>
        <Select
          className="h-10"
          multiple
          displayEmpty
          value={selectedLocations}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Select Locations</em>
            }

            return locations?.items
              ?.filter((machine: any) =>
                selected?.includes(machine._id as string)
              )
              .map((machine: any) => machine?.name)
              .join(", ")
          }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            <em>Select Locations</em>
          </MenuItem>
          {locations?.items.map((location) => (
            <MenuItem key={location._id} value={location._id}>
              <Checkbox
                checked={selectedLocations.indexOf(location._id as string) > -1}
              />
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <span className="flex flex-col items-end justify-end italic">
        x{selectedLocations?.length} Timers
      </span>
    </div>
  )
}

export default LocationsSelection
