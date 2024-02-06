export const generateDevOpsTimers = ({
  sessionId,
  numberOfTimers,
  locationId,
  machineClassIds,
  startTime,
  endTimeRange,
  unitCycleTime,
  createdBy,
  sessionName,
}: {
  numberOfTimers: number
  locationId: string
  machineClassIds: string[]
  startTime: number
  endTimeRange: number[]
  unitCycleTime: number[]
  createdBy: string
  sessionName: string
  sessionId: any
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

      const randomMachineClassId =
        machineClassIds[Math.floor(Math.random() * machineClassIds.length)]

        const isSuccess = end - start <= endTimeRange[1] * 60 * 1000; 

      bulkData.push({
        machineClassId: randomMachineClassId,
        locationId: locationId.split(",")[i],
        operatorName: `Operator ${i + j}`,
        sessionName: sessionName,
        createdBy: createdBy,
        cycleTime: randomUnitCycleTime,
        units: 0,
        sessionId,
        status: isSuccess ? "SUCCESS" : "FAILURE",
        startAt: new Date(randomStartTime),
        endAt: new Date(end),
        updatedAt: Date.now(),
        deletedAt: Date.now(),
      })
    }
  }

  return bulkData
}
