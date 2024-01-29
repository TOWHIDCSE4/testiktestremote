import { T_Device } from "custom-validator"
import dayjs from "dayjs"
import Image from "next/image"

export default function DeviceInformationPopupComponent({
  item,
}: {
  item: T_Device
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-1 mt-2 text-2xs">
      <div className="flex flex-col">
        <div className="mr-2 font-black uppercase">Device Type:</div>
        <div>
          {item.typeId && typeof item.typeId == "object"
            ? item.typeId.name
            : ""}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mr-2 font-black uppercase">Device Serial:</div>
        <div>{item.sn}</div>
      </div>
      <div className="flex flex-col">
        <div className="mr-2 font-black uppercase">Device Name:</div>
        <div>{item.name}</div>
      </div>
      <div className="flex flex-col">
        <div className="mr-2 font-black uppercase">Last Updated:</div>
        <div>{dayjs(item.lastUpdatedAt).format("YYYY-MM-DD")}</div>
      </div>
      <div className="flex flex-col">
        <div className="mr-2 font-black uppercase text-gold">
          Last Known User:
        </div>
        <div className="">
          {item.lastUserId && typeof item.lastUserId == "object"
            ? `${item.lastUserId?.firstName} ${item.lastUserId?.lastName}`
            : "Unknown"}
        </div>
        <div className="text-disabled">
          {item.history && typeof item.history == "object"
            ? dayjs(item.history.startAt).format("YYYY-MM-DD")
            : ""}
        </div>
      </div>
      <div className="">
        <Image
          className="w-[100px] border rounded-lg border-slate-400"
          width={150}
          height={80}
          alt="image"
          src={
            item.typeId && typeof item.typeId == "object"
              ? item.typeId.image
              : "/no-image.png"
          }
        />
      </div>
    </div>
  )
}
