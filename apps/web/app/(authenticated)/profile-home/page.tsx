import Content from "../../../components/pages/profile-home/Content"
import ProductionEyeContextProvider from "../../../components/pages/profile-home/production-eye/productinEyeContext"

export const metadata = {
  title: "APMS - Profile Home",
  description: "Concrete pipe maker based in Texas, USA",
}

const ProfileHome = () => {
  return (
    <ProductionEyeContextProvider>
      <Content />
    </ProductionEyeContextProvider>
  )
}

export default ProfileHome
