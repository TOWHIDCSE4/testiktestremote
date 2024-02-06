import { Dialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode, createContext, useContext, useState } from "react"
import { HiQuestionMarkCircle } from "react-icons/hi"

type T_ModalContext = {
  openModal: ({
    callback,
    title,
    description,
  }: {
    callback: (res: boolean) => void
    title: string
    description?: string
  }) => void
  closeModal: () => void
  triggerModal: () => void
  title: string
  description?: string
  onOkay: () => void
  onCancel: () => void
  isOpen: boolean
}

const modalContextDefaultValue: T_ModalContext = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openModal: ({ callback, title, description }) => {},
  closeModal: () => {},
  triggerModal() {},
  onOkay() {},
  onCancel() {},
  title: "",
  description: undefined,
  isOpen: false,
}

const modalContext = createContext<T_ModalContext>(modalContextDefaultValue)

export const useModalContext = () => useContext(modalContext)

export default function ModalContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [callback, setCallback] =
    useState<(res: boolean) => (res: boolean) => void>()

  const openModal = ({
    callback: cb,
    title: t,
    description: d,
  }: {
    callback: (res: boolean) => void
    title: string
    description?: string
  }) => {
    setCallback(() => cb)
    setTitle(t)
    setDescription(d)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const triggerModal = () => {
    setIsOpen((prev) => !prev)
  }

  const onOkay = () => {
    callback?.(true)
    closeModal()
  }
  const onCancel = () => {
    callback?.(false)
    closeModal()
  }

  return (
    <modalContext.Provider
      value={{
        openModal,
        closeModal,
        triggerModal,
        isOpen,
        title: title ?? "",
        description,
        onOkay,
        onCancel,
      }}
    >
      {children}
    </modalContext.Provider>
  )
}
