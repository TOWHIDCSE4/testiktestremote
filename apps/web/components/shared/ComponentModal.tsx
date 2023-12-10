import { Dialog } from "@headlessui/react"
import useControllerModal from "../../store/useControllerModal"

const C = () => {
  const isOpen = useControllerModal((state) => state.timerId !== null)
  const closeControllerModal = useControllerModal(
    (state) => state.closeControllerModal
  )
  if (!isOpen) return null
  return (
    <div className="fixed z-50">
      <div className="w-[400px] h-[400px] bg-white shadow-md border border-gray-400">
        dadah
      </div>
    </div>
  )
}

export default C
