import { useContext, useEffect, useState } from "react"
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

const OperatorDropdown = () => {
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

  const handleInputOperator = () => {
    // searchRef.current?.focus()
    // const leadingTrailingSpaceRegex = /^\s|\s$/
    // if (leadingTrailingSpaceRegex.test(operatorQuery)) {
    //   toast.error("Please remove trailing spaces")
    // } else {
    //   mutate(
    //     { ...timerDetails, operator: "", operatorName: operatorQuery },
    //     callBackReq
    //   )
    //   setError(null)
    // }
    // // update pr dirty ko false kr dega
    // setIsDirty(false)
  }

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
    <div>
      <Combobox
        as="div"
        value={selectedOperator}
        onChange={setSelectedOperator}
        // disabled={isComboboxDisabled}
        // ref={comboboxRef}
      >
        {({ open }) => (
          <div className="relative xl:w-80 ipadair:w-[250px] 2xl:w-[350px]">
            <Combobox.Input
              className={`block mt-2 w-full xl:w-80 2xl:w-[350px] ipadair:w-[250px] rounded-md border-0 py-1.5 pl-3 dark:bg-gray-300 bg-zinc-100 pr-10 text-gray-900 ring-1 ring-inset ring-gray-400 focus:ring-1 focus:ring-blue-950 sm:text-sm md:text-lg xl:text-[1.5vw] 2xl:text-xl sm:xl:leading-7 disabled:opacity-50 disabled:cursor-not-allowed`}
              onChange={(event) => {
                setOperatorQuery(event.target.value)
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
                  // } else if (timerDetails && timerDetails.operator) {
                  //   const operator: string | Record<string, any> =
                  //     timerDetails.operator
                  //   return typeof operator === "object"
                  //     ? operator.firstName
                  //     : operator
                } else {
                  return "Operator Unassigned"
                }
              }}
              tabIndex={0}
            />
            <Combobox.Button
              className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none"
              onClick={(e) => {
                e.target
                // searchRef?.current?.focus()
              }}
            >
              <ChevronUpDownIcon
                className={
                  `h-5 w-5 `
                  // ${
                  //   // isUpdateTimerLoading ? "text-gray-400" : "text-gray-600"
                  // }`
                }
                aria-hidden="true"
              />
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
          </div>
        )}
      </Combobox>
    </div>
  )
}

export default OperatorDropdown
