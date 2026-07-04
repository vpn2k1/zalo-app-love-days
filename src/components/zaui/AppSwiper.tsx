import { Swiper } from "zmp-ui";
import type { SwiperProps } from "zmp-ui/swiper";

type Slide = {
  id: string;
  content: React.ReactNode;
  className?: string;
};

type Props = Omit<SwiperProps, "children"> & {
  slides: Slide[];
};

export function AppSwiper({
  dots = true,
  duration = 3500,
  slides,
  ...swiperProps
}: Props) {
  return (
    <Swiper {...swiperProps} dots={dots} duration={duration}>
      {slides.map((slide) => (
        <Swiper.Slide key={slide.id} className={slide.className}>
          {slide.content}
        </Swiper.Slide>
      ))}
    </Swiper>
  );
}
