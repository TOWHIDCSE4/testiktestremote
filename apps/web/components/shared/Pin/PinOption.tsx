import { MdOutlinePushPin, MdPushPin } from "react-icons/md"
import { Button, ButtonGroup, IconButton, Popover } from "@mui/material"
import { useRef, useState } from "react"
import useProfile, { useProfileQueryKey } from "../../../hooks/users/useProfile"
import useAddToPinDashboard from "../../../hooks/users/useAddToPinDashboard"
import { T_UserPinnedComponents } from "custom-validator/ZUser"
import { FaSpinner } from "react-icons/fa"
import { useQueryClient } from "@tanstack/react-query"
import { set } from "lodash"
import useAddToPinPopup from "../../../hooks/users/useAddToPinPopup"

interface Props {
  pinnedComponentType: T_UserPinnedComponents
}
const PinOption = ({ pinnedComponentType }: Props) => {
  const [open, setOpen] = useState(false)
  const { data: profileData } = useProfile()
  const { mutate: addToPinDashboard, isLoading: isPinToDashboardLoading } =
    useAddToPinDashboard()
  const { mutate: addToPinPopup, isLoading: isPinToPopupLoading } =
    useAddToPinPopup()
  const { getProfileQueryKey } = useProfileQueryKey()
  const anchorRef = useRef()
  const queryClient = useQueryClient()
  const pinnedComponentsDashboard = profileData?.item?.pinnedComponentsDashboard
  const pinnedComponentsPopup = profileData?.item?.pinnedComponentsPopup
  const onPinToDashboard = () => {
    if (!pinnedComponentsDashboard) {
      return
    }
    if (pinnedComponentsDashboard.includes(pinnedComponentType)) {
      addToPinDashboard(
        {
          userId: profileData?.item?._id as string,
          pinnedComponentsDashboard: pinnedComponentsDashboard.filter(
            (d) => d !== pinnedComponentType
          ),
        },
        {
          onSuccess: (data) => {
            queryClient.setQueriesData(getProfileQueryKey(), (query: any) => {
              return set(query, "item", { ...query.item, ...data.item })
            })
            // queryClient.invalidateQueries(getProfileQueryKey())
          },
        }
      )
      return
    }
    addToPinDashboard(
      {
        userId: profileData?.item?._id as string,
        pinnedComponentsDashboard: [
          ...pinnedComponentsDashboard,
          pinnedComponentType,
        ],
      },
      {
        onSuccess: (data) => {
          queryClient.setQueriesData(getProfileQueryKey(), (query: any) => {
            return set(query, "item", { ...query.item, ...data.item })
          })
          // queryClient.invalidateQueries(getProfileQueryKey())
        },
      }
    )
  }
  const onPinToPopup = () => {
    if (!pinnedComponentsPopup) {
      return
    }
    if (pinnedComponentsPopup.includes(pinnedComponentType)) {
      addToPinPopup(
        {
          userId: profileData?.item?._id as string,
          pinnedComponentsPopup: pinnedComponentsPopup.filter(
            (d) => d !== pinnedComponentType
          ),
        },
        {
          onSuccess: (data) => {
            queryClient.setQueriesData(getProfileQueryKey(), (query: any) => {
              return set(query, "item", { ...query.item, ...data.item })
            })
            queryClient.invalidateQueries(getProfileQueryKey())
          },
        }
      )
      return
    }
    addToPinPopup(
      {
        userId: profileData?.item?._id as string,
        pinnedComponentsPopup: [...pinnedComponentsPopup, pinnedComponentType],
      },
      {
        onSuccess: (data) => {
          queryClient.setQueriesData(getProfileQueryKey(), (query: any) => {
            return set(query, "item", { ...query.item, ...data.item })
          })
          queryClient.invalidateQueries(getProfileQueryKey())
        },
      }
    )
  }

  const isPinnedToDashboard =
    pinnedComponentsDashboard?.includes(pinnedComponentType)
  const isPinnedToPopup = pinnedComponentsPopup?.includes(pinnedComponentType)
  return (
    <div className={"relative z-20 non-draggable p-2"}>
      <IconButton
        className={"non-draggable "}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setOpen(true)
        }}
        ref={anchorRef as any}
      >
        {isPinnedToDashboard && isPinnedToPopup ? (
          <MdPushPin />
        ) : (
          <MdOutlinePushPin />
        )}
      </IconButton>
      <Popover
        open={open}
        className="non-draggable"
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <ButtonGroup orientation="vertical" className="non-draggable">
          <Button onClick={(e) => onPinToDashboard()}>
            {isPinToDashboardLoading ? (
              <div className="animate-spin">
                <FaSpinner />
              </div>
            ) : isPinnedToDashboard ? (
              <>
                <MdPushPin /> Unpin from dashboard
              </>
            ) : (
              <>
                <MdOutlinePushPin /> Pin to dashboard
              </>
            )}
          </Button>
          <Button onClick={(e) => onPinToPopup()}>
            {isPinToPopupLoading ? (
              <div className="animate-spin">
                <FaSpinner />
              </div>
            ) : isPinnedToPopup ? (
              <>
                <MdPushPin /> Unpin from popup
              </>
            ) : (
              <>
                <MdOutlinePushPin /> Pin to popup
              </>
            )}
          </Button>
        </ButtonGroup>
      </Popover>
    </div>
  )
}

export default PinOption
