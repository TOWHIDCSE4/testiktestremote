"use client"
import useStoreSession from "../../../store/useStoreSession"
import ParentTable from "./ParentTable"
import { USER_ROLES } from "../../../helpers/constants"
import useProfile from "../../../hooks/users/useProfile"

const TEAMMEMBERS_ADMIN_ROLES = [
  USER_ROLES.Super,
  USER_ROLES.Administrator,
  USER_ROLES.HR,
  USER_ROLES.Production,
  USER_ROLES.HR_Director,
]

const Content = () => {
  const storeSession = useStoreSession(
    //@ts-expect-error
    (
      state: {
        role:
          | "Administrator"
          | "Corporate"
          | "Production"
          | "Personnel"
          | "HR"
          | "HR_Director"
          | "Accounting"
          | "Sales"
          | "Super"
        email: string
        token: string | null
      } & {
        update: (session: {
          role:
            | "Administrator"
            | "Corporate"
            | "Production"
            | "Personnel"
            | "HR"
            | "HR_Director"
            | "Accounting"
            | "Sales"
            | "Super"
          email: string
          token: string | null
        }) => void
        reset: () => void
      }
    ) => state
  )

  if (!TEAMMEMBERS_ADMIN_ROLES.includes(storeSession.role))
    return (
      <div className="mt-28">
        <h2 className="text-center">Not authorized to access this page.</h2>
      </div>
    )
  return (
    <div className={`my-20 pb-10`}>
      <div className="content px-4 md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mx-auto mt-28">
        <div>
          <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
            Team Members
          </h2>
          {/* <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
            Team Members
          </h4> */}
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        <ParentTable userLog={storeSession.role} />
      </div>
    </div>
  )
}

export default Content
