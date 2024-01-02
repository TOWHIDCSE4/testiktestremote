import { create } from "zustand"

export type T_DailyUnit = {
  timerId: string
  unit: number
}
interface States {
  dailyUnits: T_DailyUnit[]
  startTime: number
  endTimerRange: number[]
  numberOfTimers: number
  selectedMachineClasses: string[] | string
  unitCycleTime: number[]
}

interface Actions {
  setStartTime: (startTime: number) => void
  setEndTimerRange: (endTimerRange: number[]) => void
  setNumberOfTimers: (numberOfTimers: number) => void
  setDailyUnits: (timerId: { timerId: string }) => void
  setSelectedMachineClasses: (selectedMachineClass: string) => void
  setUnitCycleTime: (unitCycleTime: number[]) => void
}

const useDevOpsTimers = create<States & Actions>((set, get) => ({
  dailyUnits: [],
  startTime: 20000,
  endTimerRange: [3, 5],
  numberOfTimers: 0,
  selectedMachineClasses: [],
  unitCycleTime: [20, 40],

  setUnitCycleTime: (unitCycleTime) => set({ unitCycleTime }),
  setSelectedMachineClasses: (selectedMachineClasses) =>
    set({ selectedMachineClasses }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTimerRange: (endTimerRange) => set({ endTimerRange }),
  setNumberOfTimers: (numberOfTimers) => set({ numberOfTimers }),
  setDailyUnits: ({ timerId }) => {
    const { dailyUnits } = get()
    const index = dailyUnits.findIndex(
      (dailyUnit) => dailyUnit.timerId === timerId
    )
    if (index === -1) {
      set({ dailyUnits: [...dailyUnits, { timerId, unit: 1 }] })
    } else {
      const newDailyUnits = [...dailyUnits]
      newDailyUnits[index].unit += 1
      set({ dailyUnits: newDailyUnits })
    }
  },
}))

export default useDevOpsTimers
