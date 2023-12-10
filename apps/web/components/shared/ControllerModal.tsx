"use client"
import useControllerModal from "../../store/useControllerModal"
import Controller from "../pages/production/timer/Controller"

const ControllerModal = () => {
  const isOpen = useControllerModal((state) => state.timerId !== null)
  const timerId = useControllerModal((state) => state.timerId)
  const closeControllerModal = useControllerModal(
    (state) => state.closeControllerModal
  )
  const cm = useControllerModal()
  console.log("toet tetotet", cm)
  if (!isOpen || !timerId) return null
  return (
    <div className="fixed z-[40] top-0 w-screen h-screen flex items-center justify-center">
      <div className="w-[100%] h-[100%] max-w-[1024px] max-h-[800px] mx-auto relative   bg-white shadow-md border border-gray-400 overflow-auto">
        <Controller timerId={timerId} />
      </div>
    </div>
  )
}

export default ControllerModal
