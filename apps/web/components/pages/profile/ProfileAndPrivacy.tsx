import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const ProfileAndPrivacy = () => {
  return (
    <form className="mt-7">
      <h2 className="text-gray-800 text-[23px] font-semibold">
        Profile & Privacy
      </h2>
      <div className="bg-white border border-gray-200 rounded-sm mt-4">
        <div className="grid grid-cols-4 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Your Photo
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 flex items-center space-x-4 mt-2 md:mt-0">
            <div className="relative h-12 w-16 md:w-14 lg:w-12">
              <Image
                className="rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile image"
                fill
              />
            </div>
            <div className="w-full">
              <div
                className={`flex items-center justify-between block w-full rounded-md border-0 pl-3 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
              >
                Choose File
                <label
                  htmlFor="profile-photo"
                  className="cursor-pointer bg-cyan-500 text-white px-3 py-1.5 rounded-r-md"
                >
                  Browse
                </label>
              </div>
              <input
                type="file"
                name="profile-photo"
                id="profile-photo"
                className="sr-only"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Ameritex Profile Name
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="profile-name" className="sr-only">
                Ameritex Profile Name
              </label>
              <input
                type="text"
                name="profile-name"
                id="profile-name"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                placeholder="Your profile name..."
              />
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-4 md:col-span-3">
            <p
              className={`text-[13px] text-gray-700 font-light mt-2 ${roboto.className}`}
            >
              Your profile name will be used as part of your public profile URL
              address.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              About You
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div className="">
              <textarea
                rows={3}
                name="about-you"
                id="about-you"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                placeholder="About you..."
                defaultValue={""}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="display-real-name"
                aria-describedby="display-description"
                name="display-real-name"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label
                htmlFor="display-real-name"
                className="font-medium text-gray-800"
              >
                Display your real name on your profile
              </label>
              <p
                id="display-description"
                className="text-gray-700 text-[13px] font-light"
              >
                If unchecked, your profile name will be displayed instead of
                your full name.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="allow-view"
                aria-describedby="allow-view-description"
                name="allow-view"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label htmlFor="allow-view" className="font-medium text-gray-800">
                Allow everyone to see your profile
              </label>
              <p
                id="allow-view-description"
                className="text-gray-700 text-[13px] font-light"
              >
                If unchecked, your profile will be private and no one except you
                will able to view it.
              </p>
            </div>
          </div>
        </div>
        <div className="md:flex justify-end bg-light-blue py-4 px-6">
          <button
            type="submit"
            className="uppercase rounded-md w-full md:w-auto bg-cyan-500 mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProfileAndPrivacy
