import Image from "next/image"
import { HiChevronRight } from "react-icons/hi"
import { MdRefresh } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../../@/components/ui/dropdown-menu"
import useLocations from "../../../../hooks/locations/useLocations"
import { useEffect, useMemo, useState } from "react"
import Select from "react-select"
import useDeviceTypes from "../../../../hooks/device/useDeviceTypes"
import useDevices from "../../../../hooks/device/useDevices"
import { T_BackendResponse, T_Device, T_DeviceType } from "custom-validator"
import dayjs from "dayjs"
import useCreateDeviceRequest from "../../../../hooks/device/useCreateDeviceRequest"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import useDeviceCheckoutRequests from "../../../../hooks/device/useDeviceCheckoutRequests"
import useDeviceCheckinRequests from "../../../../hooks/device/useDeviceCheckinRequests"
import useProfile from "../../../../hooks/users/useProfile"

const defaultSelectClassNames = {
  container: () => {
    return "min-w-full"
  },
  control: () => {
    return "bg-gray-yellow p-0 h-fit"
  },
  dropdownIndicator: () => {
    return "bg-gray-yellow text-primary-dark-blue p-1"
  },
  indicatorsContainer: () => {
    return ""
  },
  valueContainer: () => {
    return "px-1"
  },
  option: () => {
    return ""
  },
  input: () => {
    return "p-0"
  },
  singleValue: () => {
    return "text-gray-500"
  },
}

type SelectOption = {
  value: string
  label: string
}

export default function DeviceBrowserComponent() {
  const { data: userProfile } = useProfile()
  const { data: locations } = useLocations()
  const [selectedLocation, setSelectedLocation] = useState<{
    _id?: string
    name: string
  }>()

  const { data: deviceTypes } = useDeviceTypes()

  const { data: devices } = useDevices()

  const [selectedDevice, setSelectedDevice] = useState<SelectOption | null>(
    null
  )
  const [selectedDeviceType, setSelectedDeviceType] =
    useState<SelectOption | null>(null)
  const deviceTypesOptions = deviceTypes?.items?.map((item) => ({
    value: item._id,
    label: item.name,
  }))

  const devicesOptions = devices?.items
    ?.filter(
      (item) =>
        typeof item.typeId == "object" &&
        item.typeId._id == selectedDeviceType?.value &&
        (item.status == "idle" || item.status == "using")
    )
    .map((item) => ({
      value: item._id,
      label: item.name,
    }))

  useEffect(() => {
    if (
      selectedDevice &&
      !devicesOptions?.some((item) => item.value == selectedDevice.value)
    ) {
      setSelectedDevice(null)
    }
  }, [devicesOptions, selectedDevice])

  const onResetClick = () => {
    setSelectedDevice(null)
    setSelectedDeviceType(null)
  }
  const onFullResetClick = () => {
    setSelectedLocation(undefined)
  }

  const currentDeviceType = useMemo<T_DeviceType | undefined>(() => {
    return deviceTypes?.items?.find(
      (item) => item._id == selectedDeviceType?.value
    )
  }, [selectedDeviceType, deviceTypes])

  const currentDevice = useMemo<T_Device | undefined>(() => {
    return devices?.items?.find((item) => item._id == selectedDevice?.value)
  }, [selectedDevice, devices])

  const { data: deviceCheckoutRequests } = useDeviceCheckoutRequests()
  const { data: deviceCheckinRequests } = useDeviceCheckinRequests()

  const isUsingByMe = useMemo<boolean>(() => {
    if (!userProfile?.item) return false
    const history = currentDevice?.history
    if (!history || typeof history !== "object") return false
    if (currentDevice.status !== "using") return false
    if (
      typeof history.userId == "object" &&
      history.userId._id == userProfile.item._id
    )
      return true
    return false
  }, [currentDevice, userProfile?.item])

  const isAlreadyCheckinRequested = useMemo<boolean>(() => {
    if (!deviceCheckinRequests?.items || !currentDevice?._id) {
      return false
    }
    if (
      deviceCheckinRequests.items.some(
        (item) =>
          typeof item.deviceId == "object" &&
          item.deviceId._id == currentDevice._id
      )
    )
      return true
    return false
  }, [deviceCheckinRequests?.items, currentDevice?._id])

  const isAlreadyCheckoutRequested = useMemo<boolean>(() => {
    if (!deviceCheckoutRequests?.items || !currentDevice?._id) {
      return false
    }
    if (
      deviceCheckoutRequests.items.some(
        (item) =>
          typeof item.deviceId == "object" &&
          item.deviceId._id == currentDevice._id
      )
    )
      return true
    return false
  }, [deviceCheckoutRequests?.items, currentDevice?._id])

  useEffect(() => {
    if (
      (isAlreadyCheckoutRequested || isUsingByMe) &&
      deviceCheckoutRequests?.items &&
      currentDevice?._id
    ) {
      if (isAlreadyCheckoutRequested) {
        const curRequest = deviceCheckoutRequests.items.find(
          (item) =>
            typeof item.deviceId == "object" &&
            item.deviceId._id == currentDevice._id
        )
        if (typeof curRequest?.locationId == "object")
          setSelectedLocation(curRequest?.locationId)
      } else if (isUsingByMe) {
        const history =
          currentDevice.history && typeof currentDevice.history == "object"
            ? currentDevice.history
            : undefined
        if (history && typeof history.locationId == "object") {
          setSelectedLocation(history.locationId)
        } else {
          setSelectedLocation(undefined)
        }
      } else {
        setSelectedLocation(undefined)
      }
    } else {
      setSelectedLocation(undefined)
    }
  }, [
    currentDevice?._id,
    currentDevice?.history,
    deviceCheckoutRequests?.items,
    isAlreadyCheckoutRequested,
    isUsingByMe,
  ])

  const { mutate: createDeviceRequest } = useCreateDeviceRequest()

  const isSubmitDisabled = useMemo<boolean>(() => {
    return !(
      (currentDevice?.status == "using" && isUsingByMe) ||
      currentDevice?.status === "idle"
    )
  }, [currentDevice, isUsingByMe])

  const queryClient = useQueryClient()
  const onSubmit = () => {
    if (!currentDevice) return false
    if (!isUsingByMe && !isAlreadyCheckoutRequested) {
      if (!selectedLocation?._id) {
        toast.error("Please select primary Location")
        return false
      }
    }
    createDeviceRequest(
      {
        deviceId: currentDevice._id,
        locationId: selectedLocation?._id,
        type: isUsingByMe ? "in" : "out",
      },
      {
        onSuccess: (data: T_BackendResponse) => {
          queryClient.invalidateQueries({
            queryKey: ["device-request-in"],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-request-out"],
          })
          queryClient.invalidateQueries({
            queryKey: ["devices"],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-log", currentDevice._id],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-log"],
          })
          if (!data.error) {
            toast.success(String(data.message))
          } else {
            toast.error(String(data.message))
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(String(error.message))
        },
      }
    )
  }

  return (
    <div className="w-full px-4 py-2 bg-white border min-w-fit rounded-3xl border-slate-300 font-lato">
      <div className="text-center md:text-left md:text-sm uppercase !font-semibold">
        Check out an Ameritex Related Device
      </div>
      <div className="flex flex-col gap-4 px-2 pt-4">
        <div className="grid items-center grid-cols-7 gap-3 text-xs gap-y-1 md:grid-cols-12 md:text-2xs">
          <div className="flex items-center col-span-7 md:col-span-3">
            {/* <div className="flex-1 p-2 overflow-hidden text-gray-500 rounded-sm text-ellipsis break-keep bg-gray-yellow">
              <p className="line-clamp-1">Virtual Reality Headset</p>
            </div> */}
            <Select
              value={selectedDeviceType}
              onChange={(newVal) => {
                setSelectedDeviceType(newVal ?? null)
              }}
              placeholder={"Select Device Type"}
              options={deviceTypesOptions}
              classNames={defaultSelectClassNames}
            />
          </div>
          <div className="flex items-center col-span-7 gap-1 md:col-span-4">
            <Select
              value={selectedDevice}
              onChange={(newVal) => {
                setSelectedDevice(newVal ?? null)
              }}
              placeholder={"Select Device"}
              options={devicesOptions}
              classNames={{
                ...defaultSelectClassNames,
                container: () => "flex-1",
              }}
            />
            <button onClick={onResetClick} className="hidden md:block">
              <MdRefresh className="text-2xl" />
            </button>
          </div>

          <button onClick={onResetClick} className="block col-span-7 md:hidden">
            <MdRefresh className="text-2xl" />
          </button>
          <div
            className={`flex flex-col col-span-7 md:col-span-2 transition-opacity ${
              currentDevice ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="font-black">Serial Number</div>
            <div>{currentDevice?.sn ?? "undefined"}</div>
          </div>
          <div
            className={`flex flex-col col-span-7 md:col-span-2 transition-opacity ${
              currentDevice ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="font-black text-gold">Date Added</div>
            <div>
              {currentDevice
                ? dayjs(currentDevice?.addedAt)?.format("YYYY-MM-DD")
                : "undefined"}
            </div>
          </div>
        </div>
        <div
          className={`grid grid-cols-4 text-xs md:text-2xs ${
            currentDevice ? "opacity-100" : "opacity-0"
          } transition-opacity`}
        >
          <div className="col-span-4 md:border-r md:col-span-1 border-primary-dark-blue">
            <div className="flex flex-col gap-1 uppercase md:gap-4">
              <div className="flex flex-col col-span-2">
                <div className="font-black md:leading-4 md:text-xs text-gold">
                  Checked Out By
                </div>
                <div className="break-all lmd:eading-3 line-clamp-1">
                  {typeof currentDevice?.lastUserId == "object"
                    ? `${currentDevice.lastUserId?.firstName} ${currentDevice.lastUserId?.lastName}`
                    : "Unknown"}
                </div>
              </div>
              <div className="flex flex-col col-span-2">
                <div className="font-black md:leading-4 md:text-xs text-gold">
                  Primary Location
                </div>
                {locations && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      disabled={isAlreadyCheckoutRequested || isUsingByMe}
                      asChild
                    >
                      <div className="relative uppercase md:leading-3">
                        <button className="uppercase w-fit">
                          {!(isAlreadyCheckoutRequested || isUsingByMe) && (
                            <div className="absolute top-[50%] left-0 -translate-x-full -translate-y-[50%]">
                              <HiChevronRight className="md:text-xs text-gold" />
                            </div>
                          )}
                          {selectedLocation?.name ?? "Select City"}
                        </button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="relative max-w-full w-[300px] bg-white shadow-2xl md:w-auto">
                      <DropdownMenuRadioGroup
                        value={selectedLocation?._id}
                        onValueChange={(val: unknown) => {
                          if (val)
                            setSelectedLocation(
                              locations.items
                                .filter((item) => item._id !== undefined)
                                .find((item) => item._id == val)
                            )
                        }}
                      >
                        {locations.items.map((location) => (
                          <DropdownMenuRadioItem
                            key={location._id}
                            value={location._id ?? ""}
                          >
                            <div className="text-lg md:text-sm">
                              {location.name}
                            </div>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="flex flex-col col-span-2">
                <div className="font-black md:text-xs md:leading-4 text-gold">
                  Last User
                </div>
                <div className="md:leading-3">
                  {typeof currentDevice?.lastUserId == "object"
                    ? `${currentDevice.lastUserId?.firstName} ${currentDevice.lastUserId?.lastName}`
                    : "Unknown"}
                </div>
                <div className="break-all md:leading-3 line-clamp-1 text-disabled">
                  {/* Checked Out 03/11/24 */}
                  {typeof currentDevice?.history == "object"
                    ? `${
                        currentDevice.history?.status == "ended"
                          ? "Checked In"
                          : "Checked Out"
                      } ${
                        currentDevice.history?.startAt
                          ? dayjs(currentDevice.history?.startAt).format(
                              "MM/DD/YY"
                            )
                          : ""
                      }`
                    : `Unknown`}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full col-span-4 gap-2 pt-4 md:pl-4 md:pt-0 md:col-span-3">
            <p className="md:text-xs line-clamp-1">
              <span className="mr-2 font-black uppercase">Inside Look:</span>
              <span className="break-all">{currentDevice?.name}</span>
            </p>
            <div className="grid flex-1 w-full grid-cols-8 md:pl-6">
              <div className="col-span-8 md:col-span-3">
                <div className="flex items-center">
                  <Image
                    className="w-full mb-2 border rounded-lg md:mb-0 border-slate-400"
                    width={300}
                    height={150}
                    alt="image"
                    src={currentDeviceType?.image ?? "/no-image.png"}
                  />
                </div>
              </div>
              <div className="col-span-8 md:pl-4 md:col-span-5">
                <div className="flex flex-col justify-between h-full">
                  {!currentDevice?.note ? (
                    <div></div>
                  ) : (
                    <>
                      <p className="font-black leading-3 uppercase">Details</p>
                      <p className="flex-1 break-all whitespace-pre-line md:text-2xs">
                        {currentDevice?.note}
                      </p>
                    </>
                  )}
                  <div className="flex items-center justify-end gap-4 pt-1 border-t border-primary-dark-blue">
                    <button
                      disabled={isSubmitDisabled}
                      onClick={onSubmit}
                      className="flex-1 px-4 py-2 text-white uppercase rounded-md shadow-sm md:flex-none md:text-xxs disabled:bg-gray-400 bg-gold"
                    >
                      {isUsingByMe
                        ? isAlreadyCheckinRequested
                          ? "Cancel Check-In Request"
                          : "Check-In"
                        : isAlreadyCheckoutRequested
                        ? "Cancel Check-Out Request"
                        : "Check-Out"}
                    </button>
                    <button onClick={onFullResetClick}>
                      <MdRefresh className="text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
