export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="content px-4 md:px-7 lg:px-16 2xl:px-80 mt-28">
      <div
        className="m-4 animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
