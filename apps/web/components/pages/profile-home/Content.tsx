"use client"
import useProfile from "../../../hooks/users/useProfile"

const Content = () => {
  const { data, isLoading: basicInfoLoading } = useProfile()
  return (
    <>
      <div className="mt-20">
        <div className="content px-4 md:px-7 lg:px-16 mt-28">
          <h1 className="text-gray-800 text-3xl font-bold">
            {!basicInfoLoading ? (
              <>
                {data?.item?.firstName} {data?.item?.lastName} Portal
              </>
            ) : (
              <div className="animate-pulse flex space-x-4">
                <div className="h-9 w-80 bg-slate-200 rounded"></div>
              </div>
            )}
          </h1>
        </div>
      </div>
    </>
  )
}

export default Content
