import { HiChevronDoubleDown } from "react-icons/hi"
import FancyButtonComponent from "./FancyButton"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { Combobox } from "@headlessui/react"
import { T_User } from "custom-validator"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import toast from "react-hot-toast"
import useColor from "./useColor"
import { PiUserPlus } from "react-icons/pi"
import useGetOperatorList from "../../../../../hooks/users/useGetOperatorList"
import useUsers from "../../../../../hooks/users/useUsers"

export default function OperatorSelectComponent() {
  const searchRef = useRef<HTMLInputElement>(null)
  const { timerId, variant, onOperatorChange } = useContext(ControllerContext)
  const color = useColor({ variant })

  const { data: timerDetails, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
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
  const { data: users, isLoading: isUsersLoading } = useUsers()
  // const { data: users, isLoading: isUsersLoading } = useGetOperatorList(timerDetails?.item?.machineClassId, timerDetails?.item?.locationId)

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
    <FancyButtonComponent trigger={"off"} intent={variant}>
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
        {operatorQuery && (
          <Combobox.Button
            className={`w-5 h-5 text-${color} rounded-full flex items-center justify-center border-${color} border hover:bg-${color} !bg-opacity-20`}
            onClick={() => handleInputOperator()}
          >
            <PiUserPlus />
          </Combobox.Button>
        )}
        <Combobox.Button onClick={() => handleInputOperator()}>
          <HiChevronDoubleDown className={`text-${color}`} />
        </Combobox.Button>
        {filteredOperator && filteredOperator.length > 0 ? (
          <Combobox.Options
            className="absolute z-10 bottom-1 max-h-20 xl:w-80 ipadair:w-[250px] 2xl:w-[350px] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            style={{ width: "200px" }} // Adjust the width as needed
          >
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
