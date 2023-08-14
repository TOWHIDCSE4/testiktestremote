export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div
      className="m-4 animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full mt-20 lg:ml-20 lg:mt-28"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
