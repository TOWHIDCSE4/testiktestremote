import { T_MachineClass } from "custom-validator"
import { useEffect } from "react"

export default function TimerTableMobileComponent({
  location,
  machineClass,
}: {
  location: {
    name: string
    _id?: string
  }
  machineClass: T_MachineClass
}) {
  useEffect(() => {
    console.log(location, machineClass)
  }, [location, machineClass])
  return (
    <table className="w-full text-md">
      <thead className="font-bold">
        <td className="px-2">Timer</td>
        <td className="px-2">Unit:</td>
        <td className="px-2">Tons</td>
        <td></td>
      </thead>
      <tbody>
        {[0, 1, 2, 3].map((item) => (
          <>
            <tr
              className={`border-t border-gray-400 border-opacity-20 ${
                item == 3 ? "opacity-30" : ""
              }`}
            >
              <td className="w-full px-2">RP1625</td>
              <td className="px-2">20</td>
              <td className="px-2">1240</td>
              <td className="">
                <div
                  className={`${
                    item == 0
                      ? "bg-green-500"
                      : item == 1
                      ? "bg-red-500"
                      : item == 2
                      ? "bg-yellow-500"
                      : "bg-transparent"
                  } border border-slate-500 rounded-full w-[6px] h-[6px]`}
                ></div>
              </td>
            </tr>
            <tr className="text-xs">
              <td className="pl-4" colSpan={5}>
                <td className="opacity-30 line-clamp-1">
                  66X4 CL4 RUBBER GASKET blah blah blah blah blah blah
                </td>
              </td>
            </tr>
          </>
        ))}
        <tr className="font-bold bg-white bg-opacity-20">
          <td></td>
          <td className="text-right uppercase">Total</td>
          <td className="px-2">100</td>
          <td className="px-2">4960</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}
