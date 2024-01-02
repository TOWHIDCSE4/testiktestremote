export const generateDevOpsTimers = ({
  numberOfTimers,
  locationId,
  machineClassesIds,
  startTime,
  endTimeRange,
  unitCycleTime,
}: {
  numberOfTimers: number
  locationId: string
  machineClassesIds: string[]
  startTime: number
  endTimeRange: number[]
  unitCycleTime: number[]
}) => {
  if (numberOfTimers <= 0 && !locationId) return

  const bulkData = []

  for (let i = 0; i < locationId.split(",").length; i++) {
    for (let j = 0; j < numberOfTimers; j++) {
      const start = Date.now() + startTime

      const randomEndTime =
        Math.floor(
          Math.random() *
            (endTimeRange[0] * 60000 - endTimeRange[1] * 60000 + 1)
        ) +
        endTimeRange[1] * 60000
      const randomStartTime =
        Date.now() + Math.floor(Math.random() * (startTime - 1000) + 1000)

      const end = start + randomEndTime

      const randomUnitCycleTime =
        Math.floor(Math.random() * (unitCycleTime[0] - unitCycleTime[1] + 1)) +
        unitCycleTime[1]

      bulkData.push({
        factoryId: "64d5816bb996589a945a6405",
        machineId: "64d5816bb996589a945a6405",
        machineClassId: machineClassesIds[j],
        partId: "64d5816bb996589a945a6405",
        locationId: locationId.split(",")[i],
        operatorName: `Operator ${i + j}`,
        operator: "64d5816bb996589a945a6405",
        createdBy: "64d5816bb996589a945a6405",
        status: "STOP",
        cycleTime: randomUnitCycleTime,
        units: 0,
        startAt: new Date(randomStartTime),
        endAt: new Date(end),
        updatedAt: Date.now(),
        deletedAt: Date.now(),
      })
    }
  }

  return bulkData
}
