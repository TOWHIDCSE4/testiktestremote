import { z } from "zod"

const LocationsZodSchema = z.object({
  name: z.string().min(2),
})

export default LocationsZodSchema
