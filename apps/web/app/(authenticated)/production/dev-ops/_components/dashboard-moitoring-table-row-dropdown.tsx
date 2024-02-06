import { Button, Dropdown } from "antd"
import { memo } from "react"
import { LuMoreVertical } from "react-icons/lu"

const DashboardMonitoringTableRowDropDown: React.FC = memo(() => {
  return (
    <Dropdown
      menu={{
        items: [
          { key: "1", label: "1st menu item" },
          { key: "2", label: "2nd menu item" },
          { key: "3", label: "3rd menu item" },
        ],
      }}
      placement="bottomRight"
    >
      <Button>
        <LuMoreVertical />
      </Button>
    </Dropdown>
  )
})

DashboardMonitoringTableRowDropDown.displayName =
  "DashboardMonitoringTableRowDropDown"

export default DashboardMonitoringTableRowDropDown
