import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid"
import { Fragment, useState } from "react"
import { NextPage } from "next"

interface Props {
  menuList: any[]
  labelText: string
  optionText: string
  registerType: string
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const DropDownMenu: NextPage<Props> = (props) => {
  const menuList = props.menuList
  const [selected, setSelected] = useState(menuList[0])
  const options = menuList.slice(1)

  return (
    <div>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-900">
              {props.labelText}
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button
                className={`${
                  selected === menuList[0] ? "text-gray-400" : "text-gray-900"
                } relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6`}
              >
                <span className="block truncate">{selected.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 border-l border-gray-300 my-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-900 ml-2"
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
                  <span className="py-2 pl-3 pr-9 select-none text-xs text-gray-400">
                    {props.optionText}
                  </span>
                  {options.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-blue-300 text-white" : "text-gray-900",
                          "relative cursor-pointer select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {person.name}
                          </span>
                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-blue-950",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
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
  )
}

export default DropDownMenu
