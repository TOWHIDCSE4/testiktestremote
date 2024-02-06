import Image from "next/image"
import sliderImage1 from "../assets/images/sliders/slider-image-1.jpg"
import sliderImage2 from "../assets/images/sliders/slider-image-2.jpg"
import sliderImage3 from "../assets/images/sliders/slider-image-1.jpg"
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
// import required modules
import { Autoplay, Navigation } from "swiper/modules"

const Slider = () => {
  const images = [sliderImage1, sliderImage2, sliderImage3]

  const slideContainer = (slideIndex: number) => {
    return (
      <>
        <Image
          src={images[slideIndex]}
          fill
          className="absolute inset-0 h-full w-full object-cover"
          alt="Carousel image"
        />
        <div className="flex items-center justify-center h-full">
          <h1 className="uppercase absolute text-[5vw] text-white font-semibold tracking-wider">
            SUSTAINABILITY
          </h1>
        </div>
      </>
    )
  }
  return (
    <>
      <Swiper
        //@ts-ignore
        navigation={true}
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="relative hidden w-0 lg:flex-1 lg:block"
      >
        <SwiperSlide>{slideContainer(0)}</SwiperSlide>
        <SwiperSlide>{slideContainer(1)}</SwiperSlide>
        <SwiperSlide>{slideContainer(2)}</SwiperSlide>
      </Swiper>
    </>
  )
}

export default Slider
