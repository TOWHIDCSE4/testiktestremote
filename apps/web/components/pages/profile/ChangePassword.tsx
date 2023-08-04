import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const ChangePassword = () => {
  return (
    <form className="mt-7">
      <h2 className="text-gray-800 text-[23px] font-semibold">
        Change Password
      </h2>
      <div className="bg-white border border-gray-200 rounded-sm mt-4">
        <div className="grid grid-cols-4 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              New Password
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <input
                type="text"
                name="new-password"
                id="new-password"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 px-6 py-4 items-center border-t border-gray-200">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Confirm Password
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                type="text"
                name="confirm-password"
                id="confirm-password"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-light-blue py-4 px-6">
          <button
            type="submit"
            className="rounded-md w-full md:w-auto bg-cyan-500 mt-0 px-[38.5px] py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default ChangePassword
