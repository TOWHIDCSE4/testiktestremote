import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const Updates = () => {
  return (
    <form className="mt-7">
      <h2 className="text-gray-800 text-[23px] font-semibold">
        Updates from Ameritex
      </h2>
      <div className="bg-white border border-gray-200 rounded-sm mt-4">
        <div className="px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="newsletter"
                aria-describedby="newsletter-description"
                name="newsletter"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label htmlFor="newsletter" className="font-medium text-gray-800">
                Ameritex Newsletter
              </label>
              <p
                id="newsletter-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Get the latest on company news.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="pf-updates"
                aria-describedby="new-content-description"
                name="new-content"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label
                htmlFor="new-content"
                className="font-medium text-gray-800"
              >
                New Content Releases
              </label>
              <p
                id="new-content-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Send me an email when new courses or bonus content is released.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="pf-updates"
                aria-describedby="pf-updates-description"
                name="pf-updates"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label htmlFor="pf-updates" className="font-medium text-gray-800">
                Product & Feature Updates
              </label>
              <p
                id="pf-updates-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Be the first to know when we announce new features and updates.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="emails"
                aria-describedby="emails-description"
                name="emails"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label htmlFor="emails" className="font-medium text-gray-800">
                Emails from Team Members
              </label>
              <p
                id="emails-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Get messages, encouragement and helpful information from your
                teachers.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="content-suggestions"
                aria-describedby="content-suggestions-description"
                name="content-suggestions"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className={`ml-3 text-sm leading-6 ${roboto.className}`}>
              <label
                htmlFor="content-suggestions"
                className="font-medium text-gray-800"
              >
                Content Suggestions
              </label>
              <p
                id="content-suggestions-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Get daily content suggestions to keep you on track.
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

export default Updates
