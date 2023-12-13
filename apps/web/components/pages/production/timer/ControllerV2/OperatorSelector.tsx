import { HiChevronDoubleDown } from "react-icons/hi"
import FancyButtonComponent from "./FancyButton"
import { Fragment, useContext, useEffect, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"
import { Combobox } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import useUsers from "../../../../../hooks/users/useUsers"
import { T_BackendResponse, T_User } from "custom-validator"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import toast from "react-hot-toast"
import useUpdateTimer from "../../../../../hooks/timers/useUpdateTimer"
import { useQueryClient } from "@tanstack/react-query"
import useColor from "./useColor"
import { PiUserPlus } from "react-icons/pi"

export default function OperatorSelectComponent() {
  const { timerId, variant } = useContext(ControllerContext)
  const color = useColor({ variant })
  const { data: timerDetails, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const queryClient = useQueryClient()
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const [operatorQuery, setOperatorQuery] = useState("")
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const [selectedOperator, setSelectedOperator] = useState({
    id: timerDetails?.item?.operator?._id,
    name:
      timerDetails?.item?.operator?.firstName +
      " " +
      timerDetails?.item?.operator?.lastName,
  })
  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timer", timerDetails._id],
        })
        setOperatorQuery("")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  useEffect(() => {
    if (
      (selectedOperator.id && !timerDetails?.operator) ||
      (selectedOperator.id &&
        typeof timerDetails?.operator === "object" &&
        selectedOperator.id !== timerDetails?.operator._id)
    ) {
      if (timerDetails) {
        mutate(
          { ...timerDetails.item, operator: selectedOperator.id },
          callBackReq
        )
      }
    }
  }, [selectedOperator])

  const handleInputOperator = () => {}

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
          onChange={(event) => setOperatorQuery(event.target.value)}
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
        <Combobox.Button
          onClick={(e) => {
            // e.target
            // searchRef?.current?.focus()
          }}
        >
          <HiChevronDoubleDown className={`text-${color}`} />
        </Combobox.Button>
        {filteredOperator && filteredOperator.length > 0 ? (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 xl:w-80 ipadair:w-[250px] 2xl:w-[350px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
