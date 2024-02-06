export const TotalsComponent = ({ locationId }: { locationId: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:space-x-4 pb-4">
      <div className="w-16">
        <h3 className="font-bold text-gray-700 uppercase">Totals</h3>
      </div>
      <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4 my-4 md:my-0">
        <div className="flex justify-between p-2 text-sm bg-white rounded-md shadow">
          <div className="font-bold">GBL UNITS:</div>
          <div>0</div>
        </div>
        <div className="flex justify-between p-2 text-sm bg-white rounded-md shadow">
          <div className="font-bold">GBL TONS:</div>
          <div>0.00</div>
        </div>
        <div className="flex justify-between p-2 text-sm bg-white rounded-md shadow">
          <div className="font-bold">AVG UNITS:</div>
          <div>0.00</div>
        </div>
        <div className="flex justify-between p-2 text-sm bg-white rounded-md shadow">
          <div className="font-bold">AVG TONS:</div>
          <div>0.00</div>
        </div>
      </div>
    </div>
  )
}
