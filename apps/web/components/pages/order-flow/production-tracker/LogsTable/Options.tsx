import { Select as AntdSelect, Checkbox } from "antd"

const { Option } = AntdSelect

function CustomOption({ type, children, ...props }: any) {
  return (
    <Option {...props}>
      {type === "checkbox" && <Checkbox />}
      {children}
    </Option>
  )
}

export default CustomOption
