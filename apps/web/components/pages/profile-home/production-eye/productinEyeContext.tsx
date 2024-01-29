import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import useProfile from "../../../../hooks/users/useProfile"
import _ from "lodash"

type T_ProductionEyeContext = {
  isMobile: boolean
  setIsMobile: (val: boolean) => void
  selectedLocationIds: Array<string>
  setSelectedLocationIds: (value: Array<string>) => void
  primaryLocationId: string | undefined
  setPrimaryLocationId: (value?: string) => void
  onSelectLocation: (id: string, checked: boolean) => void
}

const defaultContextValues = {
  isMobile: false,
  setIsMobile: (val: boolean) => {},
  selectedLocationIds: [],
  setSelectedLocationIds: (value: Array<string>) => {},
  primaryLocationId: undefined,
  setPrimaryLocationId: (val?: string) => {},
  onSelectLocation: (id: string, checked: boolean) => {},
}

const productionEyeContext =
  createContext<T_ProductionEyeContext>(defaultContextValues)

export const useProductionEyeContext = () => useContext(productionEyeContext)

export default function ProductionEyeContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { data: userProfile } = useProfile()

  const [selectedLocationIds, setSelectedLocationIds] = useState<Array<string>>(
    []
  )
  const [primaryLocationId, setPrimaryLocationId] = useState<
    string | undefined
  >()

  const onSelectLocation = (id: string, checked: boolean) => {
    setSelectedLocationIds((prev) =>
      checked
        ? _.uniq([...prev, id])
        : _.uniq([...prev.filter((item) => item !== id)])
    )
  }

  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (userProfile?.item?.locationId) {
      const userLocationId = userProfile?.item.locationId as string
      setPrimaryLocationId(userLocationId)
      onSelectLocation(userLocationId, true)
    }
  }, [userProfile])

  return (
    <productionEyeContext.Provider
      value={{
        isMobile,
        setIsMobile,
        primaryLocationId,
        setPrimaryLocationId,
        selectedLocationIds,
        setSelectedLocationIds,
        onSelectLocation,
      }}
    >
      {children}
    </productionEyeContext.Provider>
  )
}
