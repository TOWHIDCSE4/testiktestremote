export default function useColor({
  variant,
}: {
  variant?: "idle" | "active" | "danger"
}) {
  if (variant == "idle") return "[#da8d00]"
  else if (variant == "active") return "green-500"
  else if (variant == "danger") return "red-500"
  return "gray-300"
}
