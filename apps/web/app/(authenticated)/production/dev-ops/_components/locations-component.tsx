"use client"
import * as React from "react"
import { Theme, useTheme } from "@mui/material/styles"
import OutlinedInput from "@mui/material/OutlinedInput"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { T_DBReturn } from "../../../../_types"
import { T_Location } from "custom-validator"
import { useRouter, useSearchParams } from "next/navigation"

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

  React.useEffect(() => {
    router.replace(
      `/production/dev-ops?location=${selectedLocations.join(",").toString()}`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocations])

  return (
    <div>
      <FormControl sx={{ m: 1, width: 220, mt: 3 }}>
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
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default LocationsSelection
