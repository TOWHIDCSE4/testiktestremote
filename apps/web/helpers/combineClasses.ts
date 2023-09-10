// @ts-expect-error
function combineClasses(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default combineClasses
