import useProfile from "../../../hooks/users/useProfile"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import useUpdateBasicInfo from "../../../hooks/users/useUpdateBasicInfo"
import useStoreSession from "../../../store/useStoreSession"
import { T_BackendResponse, T_UserBasic } from "custom-validator"
import useLocation from "../../../hooks/locations/useLocation"
import { useEffect, useState } from "react"
import useGetUser from "../../../hooks/users/useGetUser"
import type { SelectProps } from "antd"
import { Select, Typography } from "antd"
import useFactories from "../../../hooks/factories/useFactories"
import { USER_ROLES } from "../../../helpers/constants"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"

const FACTORY_USERS = [USER_ROLES.Personnel, USER_ROLES.Production]

const BasicInformation = () => {
  const queryClient = useQueryClient()
  const storeSession = useStoreSession((state) => state)
  const [factory, setFactory] = useState("")
  const [isFactoryUser, setIsFactoryUser] = useState(false)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const [machineClassIdProfile, setMachineClassProfile] = useState(
    userProfile?.item.machineClassId
  )
  const { data: location, setSelectedLocationId } = useLocation()
  const { data: machineClass, isLoading: isMachineLoading } =
    useMachineClasses()
  const { data: factories } = useFactories()
  const { register, handleSubmit } = useForm<T_UserBasic>({
    values: {
      firstName: userProfile?.item.firstName as string,
      lastName: userProfile?.item.lastName as string,
      email: userProfile?.item.email as string,
      locationId: location?.item.name as string,
    },
  })
  const { data: approvedByUserData, isLoading: isGetUserLoading } = useGetUser(
    userProfile?.item.approvedBy as string
  )
  const { mutate, isLoading: updateInfoLoading } = useUpdateBasicInfo()

  const onSubmit = (data: T_UserBasic) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["profile", storeSession.email],
          })
          toast.success("Profile information successfully updated")
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(
      {
        _id: userProfile?.item._id,
        ...data,
        locationId: userProfile?.item.locationId as string,
      },
      callBackReq
    )
  }
  useEffect(() => {
    setIsFactoryUser(FACTORY_USERS.includes(userProfile?.item.role as string))
    if (userProfile?.item.locationId) {
      setSelectedLocationId(userProfile?.item.locationId as string)
    }
  }, [userProfile])
  useEffect(() => {
    if (userProfile?.item.factoryId && factories) {
      const _v = factories.items.filter((val: any) => {
        return val._id === userProfile?.item.factoryId
      })
      setFactory(_v[0].name)
    }
  }, [userProfile, factories])

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }

  const options: SelectProps["options"] = []

  // const machineClassName = machineClass?.items.map((machineName:any)=>machineName._id )

  const selectedMachineName = machineClass?.items.find(
    (machineName: any) => machineName._id === userProfile?.item.machineClassId
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <h2 className="text-gray-800 text-[23px] font-semibold">
        Basic Information
      </h2>
      <div className="bg-white border border-gray-200 rounded-sm mt-4">
        <div className="grid grid-cols-4 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              First Name
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="first-name" className="sr-only">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName", { required: true })}
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  userProfile?.item.role === "Personnel"
                }
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                defaultValue={userProfile?.item.firstName}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Last Name
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="last-name" className="sr-only">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName", { required: true })}
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  userProfile?.item.role === "Personnel"
                }
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                defaultValue={userProfile?.item.lastName}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Email Address
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  userProfile?.item.role === "Personnel"
                }
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                defaultValue={userProfile?.item.email}
              />
            </div>
            <p className={`text-[13px] text-gray-700 font-light mt-4`}>
              Note that if you change your email, you will have to confirm it
              again.
            </p>
          </div>
        </div>
        {userProfile?.item.role !== "Super" && (
          <>
            <div
              className={`grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center`}
            >
              <div className="col-span-4 md:col-span-1">
                <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                  City
                </h4>
              </div>
              <div className={"col-span-4 md:col-span-3 mt-2 md:mt-0"}>
                <div>
                  <label htmlFor="last-name" className="sr-only">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Your City name..."
                    {...register("locationId", { required: true })}
                    disabled
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                    defaultValue={userProfile?.item.lastName}
                  />
                </div>
              </div>
            </div>
            <div
              className={`grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center`}
            >
              <div className="col-span-4 md:col-span-1">
                <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                  {userProfile?.item.role == "Personnel"
                    ? "Machine Class"
                    : "Factory"}
                </h4>
              </div>
              <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                <div>
                  <label htmlFor="factory" className="sr-only">
                    Factory
                  </label>
                  {userProfile?.item.role == "Personnel" ? (
                    <input
                      type="text"
                      disabled
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                      placeholder="Your factory name..."
                      value={
                        selectedMachineName
                          ? [selectedMachineName.name]
                          : "Select Machine Class"
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      disabled
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                      placeholder="Your factory name..."
                      value={factory}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <div className="md:flex justify-between items-center bg-light-blue py-4 px-6">
          <div>
            <h4 className="text-lg text-gray-900 text-center md:text-left">
              <span>Approved by</span>{" "}
              <span className="text-red-500">
                {approvedByUserData?.item.firstName}{" "}
                {approvedByUserData?.item.lastName}
              </span>
            </h4>
          </div>
          <button
            type="submit"
            className="uppercase flex items-center rounded-md bg-cyan-500 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
            disabled={updateInfoLoading || isProfileLoading}
          >
            {updateInfoLoading ? (
              <div
                className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default BasicInformation
