import { create } from "zustand"

type State = {
  isTimerStop: boolean
  isTimerStopBySocket: boolean
}

type Action = {
  updateIsTimerStop: (isTimerStop: State["isTimerStop"]) => void
  updateIsTimerStopBySocket: (
    isTimerStopBySocket: State["isTimerStopBySocket"]
  ) => void
}

const useStoreTimer = create<State & Action>((set) => ({
  isTimerStop: false,
  isTimerStopBySocket: false,
  updateIsTimerStop: (isTimerStop) => set(() => ({ isTimerStop: isTimerStop })),
  updateIsTimerStopBySocket: (isTimerStopBySocket) =>
    set(() => ({ isTimerStopBySocket: isTimerStopBySocket })),
}))

export default useStoreTimer
