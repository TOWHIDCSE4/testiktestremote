import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Listbox, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"

const people = [
  { id: 1, name: "60x8x3 RUBBER GASKET" },
  { id: 2, name: "21x8 CL5 T&G RCP" },
  { id: 3, name: "90 X 8' CL3 Rubber Gasket" },
  { id: 4, name: "48x8 CL3 T&G RCP" },
]

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const products = [
  {
    id: 1,
    name: "Product Name",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 2,
    name: "Product Name",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 3,
    name: "Product Name",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-03.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
]

const TimerCard = () => {
  const [selected, setSelected] = useState(people[0])
  return (
    <div>
      <div className="mx-auto">
        <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-md border border-gray-200 drop-shadow-lg"
            >
              <div className="px-4 py-4 border-b border-gray-200">
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6">
                          <span className="block truncate">
                            {selected.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {people.map((person) => (
                              <Listbox.Option
                                key={person.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-blue-950 text-white"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {person.name}
                                    </span>
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div className="px-4 py-4 text-center space-y-2">
                <h3 className="text-gray-700 font-bold uppercase text-xl">
                  RP 1225
                </h3>
                <h1 className="font-bold text-stone-400 text-5xl">00:00:00</h1>
                <p className="text-amber-600">Please set Operator</p>
                <div>
                  <h2 className="font-semibold text-gray-400 text-3xl">000</h2>
                  <h6 className="text-gray-700 font-semibold uppercase text-sm">
                    Daily Units
                  </h6>
                </div>
              </div>
              <div className="px-4">
                <div className="flex justify-between text-gray-900">
                  <span>Total Tons:</span>
                  <span>0.000</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span>Average Ton/hr:</span>
                  <span>0.000</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span>Average Unit/hr:</span>
                  <span>0.000</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3 px-4 my-4">
                <button className="uppercase text-sm text-white bg-green-800 p-1 rounded-md">
                  Controller
                </button>
                <button className="uppercase text-sm text-white bg-stone-600 p-1 rounded-md">
                  Live Camera
                </button>
                <button className="uppercase text-sm text-white bg-blue-950 p-1 rounded-md">
                  Details
                </button>
                <button className="uppercase text-sm text-white bg-red-600 p-1 rounded-md">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimerCard
