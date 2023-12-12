const ErrorPage = ({ reset }: { reset: () => void }) => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div>
      <p>Something went wrong</p>
      <button
        className="px-4 py-2 bg-green-600 rounded-md text-white"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  </div>
)

export default ErrorPage
