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
import useColor from "./useColor"

const OperatorSelectComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  // Context
  const { timerId, variant, onOperatorChange, operator, isCycleClockRunning } =
    useContext(ControllerContext)
  const color = useColor({ variant })

  // Queries
  const timerDetailsQuery = useGetTimerDetails(timerId)
  const usersQuery = useUsers({
    onSuccess: (data: any) =>
      toast.success(
        `${timerDetailsQuery?.data?.item?.operator?.firstName} ${timerDetailsQuery?.data?.item?.operator?.lastName} is assigned alredy.`
      ),
  })

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
      <div className={`relative mt-1 `}>
        <div className="w-6 h-full bg-[#DA8D00] absolute -right-4 rounded-r-md border-2 border-gray-700" />
        <div className="relative flex w-full cursor-default overflow-hidden rounded-lg border-2 border-gray-700 bg-[#E8EBF0] text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className={`w-full border-none py-1.5 pl-3 font-semibold  pr-10 text-sm leading-5 text-[#5D5D5D] focus:ring-0 bg-[#E8EBF0] italic ${
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
          <div className="flex items-center space-x-2">
            {query && (
              <Combobox.Button
                className={`absolute z-10 inset-y-0 right-5 flex items-center pr-2`}
                onClick={() => handleInputOperator()}
              >
                <PiUserPlus />
              </Combobox.Button>
            )}
            <Combobox.Button
              onClick={() => inputRef.current?.focus()}
              className="absolute z-20 inset-y-0 right-0 flex items-center pr-2"
            >
              <HiChevronDoubleDown className={`text-${color}`} />
            </Combobox.Button>
          </div>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 z-50 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredOperator?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOperator?.map((person) => (
                <Combobox.Option
                  key={person._id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
