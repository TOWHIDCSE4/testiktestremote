const locationTabs = [
  {
    name: "Seguin",
    current: true,
  },
  {
    name: "Conroe",
    current: false,
  },
  {
    name: "Gunter",
    current: false,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const Content = () => {
  return (
    <div className={`mt-20 my-10 lg:ml-64`}>
      <div className="content px-4 md:px-7 lg:px-16 mt-28">
        <div className="flex justify-between items-center py-2">
          <div>
            <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
              Timer and Analytics
            </h2>
            <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
              Production<span className="text-black mx-2">&gt;</span>
              <span className="text-red-500">Texas</span>
            </h4>
          </div>
          <div>
            <button
              type="button"
              className="uppercase rounded-md bg-green-700 px-4 md:px-7 py-2 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              New Timer
            </button>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        {/* Location */}
        <div className="grid grid-cols-3 gap-x-6 md:gap-x-8 2xl:gap-x-24 mt-5">
          {locationTabs.map((tab) => (
            <div key={tab.name}>
              <button
                type="button"
                className={classNames(
                  tab.current
                    ? "bg-blue-950 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                  "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                )}
              >
                {tab.name}
              </button>
              <div className="flex mt-1">
                <div className="flex h-6 items-center">
                  <input
                    id="compare"
                    aria-describedby="compare-description"
                    name="compare"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div className="ml-2 md:ml-3 text-xs md:text-sm leading-6">
                  <label
                    htmlFor="compare"
                    className="font-medium text-gray-900 uppercase"
                  >
                    Compare
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-[1.5px] bg-gray-200 mt-5"></div>
        <div className="flex justify-between mt-5">
          <div>
            <h3 className="text-gray-700 font-bold uppercase">Clocks</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
