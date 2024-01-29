import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../@/components/ui/tabs"
import { USER_ROLES } from "../../../../helpers/constants"
import useProfile from "../../../../hooks/users/useProfile"
import CheckinTabContent from "./sidebar/checkin"
import CheckoutTabContent from "./sidebar/checkout"
import DeviceListTabContent from "./sidebar/list"
import LogsTabContent from "./sidebar/log"
import "./styles.scss"

export default function SidebarComponent() {
  const { data: userProfile } = useProfile()
  const isAdmin = [
    USER_ROLES.Super,
    USER_ROLES.Administrator,
    USER_ROLES.HR,
    USER_ROLES.HR_Director,
  ].includes(userProfile?.item?.role ?? "")

  return (
    <div className="w-full max-h-full overflow-x-hidden overflow-y-auto xl:max-h-none">
      <Tabs defaultValue={"checkout"}>
        <TabsList>
          <TabsTrigger
            className="px-2 uppercase border-b-2 rounded-none data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:font-black border-disabled text-2xs TabsTrigger"
            value="checkout"
          >
            Checked-Out
          </TabsTrigger>
          <TabsTrigger
            className="px-2 uppercase border-b-2 rounded-none data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:font-black border-disabled text-2xs TabsTrigger"
            value="checkin"
          >
            Checked-In
          </TabsTrigger>
          <TabsTrigger
            className="px-2 uppercase border-b-2 rounded-none data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:font-black border-disabled text-2xs TabsTrigger"
            value="systemlog"
          >
            System Log
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger
              className="px-2 uppercase border-b-2 rounded-none data-[state=active]:border-gold data-[state=active]:text-gold data-[state=active]:font-black border-disabled text-2xs TabsTrigger"
              value="devices"
            >
              Devices
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent className="px-2" value="checkout">
          <CheckoutTabContent />
        </TabsContent>
        <TabsContent className="px-2" value="checkin">
          <CheckinTabContent />
        </TabsContent>
        <TabsContent className="px-2" value="systemlog">
          <LogsTabContent />
        </TabsContent>
        {isAdmin && (
          <TabsContent className="px-2" value="devices">
            <DeviceListTabContent />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
