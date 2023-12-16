import { Combobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import React, {
  Fragment,
  experimental_useEffectEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import useUsers from "../../../../../hooks/users/useUsers"
import { ControllerContext } from "./ControllerContext"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import { PiUserPlus } from "react-icons/pi"
import toast from "react-hot-toast"
import { HiChevronDoubleDown } from "react-icons/hi"
import FancyButtonComponent from "./FancyButton"
import { textCV } from "./classVariants"

const OperatorSelectComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  // Context
  const { timerId, variant, onOperatorChange, operator, isCycleClockRunning } =
    useContext(ControllerContext)
  const textColors = textCV

  // Queries
  const timerDetailsQuery = useGetTimerDetails(timerId)
  const usersQuery = useUsers({})

  const [selected, setSelected] = useState({
    id: timerDetailsQuery?.data?.item?.operator._id,
    name:
      operator?.firstName === undefined
        ? `${timerDetailsQuery?.data?.item?.operator?.firstName} ${timerDetailsQuery?.data?.item?.operator?.lastName}`
        : `${operator?.firstName} ${operator?.lastName}`,
  })
  const [query, setQuery] = useState("")

  // This useEffect will run when Operator is Changed
  useEffect(() => {
    if (
      (selected?.id && !timerDetailsQuery?.data?.operator) ||
      (selected?.id &&
        typeof timerDetailsQuery?.data?.operator === "object" &&
        selected?.id !== timerDetailsQuery?.data?.operator._id)
    ) {
      if (timerDetailsQuery?.data) onOperatorChange(selected?.id, "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const handleInputOperator = () => {
    inputRef.current?.focus()
    const leadingTrailingSpaceRegex = /^\s|\s$/
    if (leadingTrailingSpaceRegex.test(query)) {
      toast.error("Please remove trailing spaces")
    }
    onOperatorChange("", query)
  }

  const filteredOperator =
    query === ""
      ? usersQuery?.data?.items?.slice(0, 30)
      : usersQuery?.data?.items
          ?.filter((user) => {
            return (
              user.firstName.toLowerCase().includes(query.toLowerCase()) ||
              user.lastName.toLowerCase().includes(query.toLowerCase())
            )
          })
          ?.slice(0, 30)

  const isDisableInput =
    usersQuery?.isLoading || usersQuery?.isFetching || isCycleClockRunning

  return (
    <Combobox
      disabled={
        usersQuery?.isLoading || usersQuery?.isFetching || isCycleClockRunning
      }
      value={selected}
      onChange={(selected: any) =>
        setSelected({
          id: selected?._id,
          name: `${selected?.firstName} ${selected?.lastName}`,
        })
      }
    >
      <div className={`relative`}>
        <FancyButtonComponent trigger={"off"} intent={variant}>
          <div className="relative flex items-center">
            <Combobox.Input
              className={`flex-1 p-0 pr-6 border-none font-semibold text-sm leading-5 text-[#5D5D5D] dark:text-white focus:ring-0 bg-transparent italic ${
                isDisableInput ? "cursor-not-allowed" : ""
              }`}
              displayValue={(selected: any) =>
                timerDetailsQuery?.data?.item?.operator?.firstName &&
                timerDetailsQuery?.data?.item?.operator?.lastName
                  ? selected.name
                  : operator?.firstName
              }
              onChange={(event) => setQuery(event.target.value)}
              ref={inputRef}
            />
            <div className="absolute right-0 flex items-center pr-1">
              <Combobox.Button
                className={`${
                  query ? "" : "opacity-0"
                } inset-y-0 flex items-center`}
                onClick={() => (query ? handleInputOperator() : undefined)}
              >
                <PiUserPlus />
              </Combobox.Button>
              <Combobox.Button
                onClick={() => inputRef.current?.focus()}
                className="inset-y-0 flex items-center"
              >
                <HiChevronDoubleDown className={textCV[variant]} />
              </Combobox.Button>
            </div>
          </div>
        </FancyButtonComponent>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-40 ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredOperator?.length === 0 && query !== "" ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                Nothing found.
              </div>
            ) : (
              filteredOperator?.map((person) => (
                <Combobox.Option
                  key={person._id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 dark:text-white dark:bg-dark-cyan-blue ${
                      active ? "bg-[#E8EBF0] text-black" : "text-black-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.firstName + " " + person.lastName}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default OperatorSelectComponent
