import { HiChevronDoubleDown } from "react-icons/hi"
import FancyButtonComponent from "./FancyButton"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { Combobox } from "@headlessui/react"
import useUsers from "../../../../../hooks/users/useUsers"
import { T_User } from "custom-validator"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import toast from "react-hot-toast"
import useGetOperatorList from "../../../../../hooks/users/useGetOperatorList"

export default function OperatorSelectComponent() {
  const searchRef = useRef<HTMLInputElement>(null)
  const { timerId, onOperatorChange } = useContext(ControllerContext)
  const { data: timerDetails, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const { data: users, isLoading: isUsersLoading } = useGetOperatorList()
  const [operatorQuery, setOperatorQuery] = useState("")
  const [isDirty, setIsDirty] = useState(false)
  const [isDirtyHandled, setIsDirtyHandled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOperator, setSelectedOperator] = useState({
    id: timerDetails?.item?.operator?._id,
    name:
      timerDetails?.item?.operator?.firstName +
      " " +
      timerDetails?.item?.operator?.lastName,
  })

  useEffect(() => {
    if (
      (selectedOperator.id && !timerDetails?.operator) ||
      (selectedOperator.id &&
        typeof timerDetails?.operator === "object" &&
        selectedOperator.id !== timerDetails?.operator._id)
    ) {
      if (timerDetails) {
        onOperatorChange(selectedOperator.id)
      }
    }
  }, [selectedOperator])

  const handleInputOperator = () => {
    searchRef.current?.focus()
    const leadingTrailingSpaceRegex = /^\s|\s$/
    if (leadingTrailingSpaceRegex.test(operatorQuery)) {
      toast.error("Please remove trailing spaces")
    } else {
      setError(null)
    }
    setIsDirty(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorQuery(event.target.value)
    setIsDirty(true)
    setError(null)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("registered")
      event.preventDefault()
      handleInputOperator()
    }
  }

  const filteredOperator =
    operatorQuery === ""
      ? users?.items?.slice(0, 30)
      : users?.items
          ?.filter((user) => {
            return (
              user.firstName
                .toLowerCase()
                .includes(operatorQuery.toLowerCase()) ||
              user.lastName.toLowerCase().includes(operatorQuery.toLowerCase())
            )
          })
          ?.slice(0, 30)

  return (
    <FancyButtonComponent trigger={"off"}>
      <Combobox value={selectedOperator} onChange={setSelectedOperator}>
        <Combobox.Input
          as={Fragment}
          onChange={(event) => {
            setOperatorQuery(event.target.value)
            handleInputChange(event)
            setError(null)
          }}
          displayValue={(
            selected:
              | { id: string; name: string; firstName?: string }
              | undefined
          ) => {
            if (operatorQuery) {
              return operatorQuery
            } else if (selected && selected.id && selected.name) {
              return selected.firstName
                ? `${selected.firstName}`
                : `${selected.name}`
            } else {
              return "Operator Unassigned"
            }
          }}
          // onKeyDown={(e) => handleKeyPress(e)}
          // tabIndex={0}
          // ref={searchRef}
        >
          <input className="bg-transparent p-0 border-none max-w-[12rem] text-[#7a828d] text-normal italic" />
        </Combobox.Input>
        <Combobox.Button>
          <HiChevronDoubleDown className="text-[#da8d00]" />
        </Combobox.Button>
        {operatorQuery && (
          <Combobox.Button
            className="absolute inset-y-0 flex items-center px-2 right-5 rounded-r-md focus:outline-none"
            onClick={() => handleInputOperator()}
          >
            <span className="flex items-center justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.7"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </span>
          </Combobox.Button>
        )}
        <Combobox.Button
          className="absolute inset-y-0 flex items-center px-2 right-5 rounded-r-md focus:outline-none"
          onClick={() => handleInputOperator()}
          style={{ position: "relative" }}
        >
          <span className="flex items-center justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.7"
              stroke="yellow"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
          </span>
        </Combobox.Button>
        {/* )} */}
        {filteredOperator && filteredOperator.length > 0 ? (
          <Combobox.Options className="absolute z-10 bottom-1 max-h-20 xl:w-80 ipadair:w-[250px] 2xl:w-[350px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOperator.map((item: T_User, index: number) => (
              <Combobox.Option
                key={index}
                value={{
                  id: item._id,
                  name: `${item.firstName} ${item.lastName}`,
                }}
                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white`}
              >
                <span className="block">{`${item.firstName} ${item.lastName}`}</span>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        ) : null}
      </Combobox>
    </FancyButtonComponent>
  )
}
