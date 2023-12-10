import { create } from "zustand"

interface ConstrollerModalState {
  timerId: string | null
  isMaximized: boolean
  setTimerId: (timerId: string) => void
  setIsMaximized: (isMaximized: boolean) => void
  closeControllerModal: () => void
}

const useControllerModal = create<ConstrollerModalState>((set) => ({
  timerId: null,
  isMaximized: false,
  setTimerId: (timerId) => set(() => ({ timerId })),
  setIsMaximized: (isMaximized) =>
    set(() => ({
      isMaximized,
    })),
  closeControllerModal: () =>
    set(() => ({
      timerId: null,
    })),
}))

export default useControllerModal
