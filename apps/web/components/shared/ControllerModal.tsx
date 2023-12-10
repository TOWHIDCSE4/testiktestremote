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
    <div className="fixed z-[60] top-0 w-screen h-screen">
      <div className="w-[100%] h-[100%] mx-auto relative   bg-white shadow-md border border-gray-400 ">
        <Controller timerId={timerId} />
      </div>
    </div>
  )
}

export default ControllerModal
