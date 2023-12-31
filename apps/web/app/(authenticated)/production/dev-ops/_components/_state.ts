import { create } from "zustand"

interface States {
  startTime: number
  endTimerRange: number[]
  numberOfTimers: number
}

interface Actions {
  setStartTime: (startTime: number) => void
  setEndTimerRange: (endTimerRange: number[]) => void
  setNumberOfTimers: (numberOfTimers: number) => void
}

const useDevOpsTimers = create<States & Actions>((set, get) => ({
  startTime: 20000,
  endTimerRange: [20000, 400000],
  numberOfTimers: 0,

  setStartTime: (startTime) => set({ startTime }),
  setEndTimerRange: (endTimerRange) => set({ endTimerRange }),
  setNumberOfTimers: (numberOfTimers) => set({ numberOfTimers }),
}))

export default useDevOpsTimers
