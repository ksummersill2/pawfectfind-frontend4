import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight, Dog, Search, Heart, Activity, Shield, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const heroSlides = [
  {
    id: 'bundle-builder',
    title: "Create the Pawfect Gift Bundle",
    subtitle: "Personalized Pet Gift Sets",
    description: "Mix and match premium products to create the perfect gift bundle for any dog lover. Save up to 20% when you bundle!",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1920&q=80",
    buttonText: "Start Building",
    buttonLink: "/bundle-builder",
    theme: "dark",
    duration: 5000
  },
  {
    id: 'winter2024',
    title: "Winter Essentials",
    subtitle: "Keep your furry friend warm & cozy",
    description: "Shop our collection of winter coats, boots, and accessories",
    image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=1920&q=80",
    buttonText: "Shop Winter Collection",
    buttonLink: "/category/winter",
    theme: "dark",
    duration: 5000
  },
  {
    id: 'blackfriday',
    title: "Black Friday Deals",
    subtitle: "Up to 70% off",
    description: "Massive savings on premium pet products",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1920&q=80",
    buttonText: "View Deals",
    buttonLink: "/black-friday",
    theme: "light",
    duration: 5000
  },
  {
    id: 'community',
    title: "Join Our Community",
    subtitle: "Connect with fellow pet lovers",
    description: "Share experiences, get advice, and make friends with other dog owners",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1920&q=80",
    buttonText: "Join Community",
    buttonLink: "/community",
    theme: "dark",
    duration: 5000
  }
];

const HeroSlider: React.FC = () => {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<any>(null);

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        stopOnLastSlide: false
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      loop={true}
      className="h-[600px] w-full"
      onSwiper={setSwiper}
      onSlideChange={(swiper) => {
        const currentSlide = heroSlides[swiper.realIndex];
        swiper.params.autoplay.delay = currentSlide.duration;
        swiper.autoplay.start();
      }}
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-full w-full">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${
                slide.theme === 'dark' 
                  ? 'from-black/60 to-black/30'
                  : 'from-white/60 to-white/30'
              }`} />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-xl">
                <p className={`text-lg font-semibold mb-2 ${
                  slide.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {slide.subtitle}
                </p>
                <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                  slide.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {slide.title}
                </h2>
                <p className={`text-xl mb-8 ${
                  slide.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {slide.description}
                </p>
                <Link
                  to={slide.buttonLink}
                  className={`inline-flex items-center px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
                    slide.theme === 'dark'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {slide.buttonText}
                  <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;