export const getObjectId = (data: any) => {
  if (typeof data === "string") {
    return data
  }
  if (!data?._id) return null

  return data?._id
}
