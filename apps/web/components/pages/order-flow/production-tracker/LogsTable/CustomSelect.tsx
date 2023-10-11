import React from "react"
import { Select as AntSelect } from "antd"

function CustomSelect({
  width = "normal",
  mode,
  error = false,
  children,
  ...props
}: any) {
  return (
    <AntSelect
      style={{ minWidth: "100%" }}
      optionLabelProp="label"
      mode={mode}
      {...props}
    >
      {children}
    </AntSelect>
  )
}

export default CustomSelect
