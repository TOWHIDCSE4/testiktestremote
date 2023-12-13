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

export default function OperatorSelectComponent() {
  const { timerId } = useContext(ControllerContext)
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
    <FancyButtonComponent trigger={"off"}>
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
        <Combobox.Button
          onClick={(e) => {
            // e.target
            // searchRef?.current?.focus()
          }}
        >
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
