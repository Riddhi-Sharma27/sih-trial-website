"use client" 

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function LandingPage() {
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoMoved, setLogoMoved] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setLogoLoaded(true)
      setTimeout(() => {
        setLogoMoved(true)
        setTimeout(() => setShowContent(true), 800)
      }, 1000)
    }, 2000)

    return () => clearTimeout(logoTimer)
  }, [])

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  return (
    <div className="bg-transparent relative overflow-x-hidden">
      {/* Decorative blue blobs */}
      {showContent && (
        <>
          <div className="absolute top-60 right-330 w-80 h-100 bg-blue-500/20 rounded-full blur-3xl animate-blob -z-20"></div>
          <div className="absolute top-0 left-320 w-96 h-80 bg-blue-500/10 rounded-full blur-2xl animate-blob -z-20"></div>
          <div className="absolute top-150 left-300 w-400 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob -z-20"></div>
        </>
      )}

      {/* Landing Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-blue-900/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Navbar */}
        <nav
          className={`fixed top-5 left-1/2 -translate-x-1/2 w-3/4 md:w-1/3 px-8 py-4 flex justify-center space-x-16 transition-all duration-1000 z-50 ${
            showContent ? "opacity-100" : "opacity-0"
          } bg-blue-200/10 backdrop-blur-md rounded-3xl`}
        >
          <a href="#home" className="text-lg md:text-xl text-blue-200 hover:text-blue-600 transition font-medium">Home</a>
          <a href="#features" className="text-lg md:text-xl text-blue-200 hover:text-blue-600 transition font-medium">About Us</a>
          <a href="#contact" className="text-lg md:text-xl text-blue-200 hover:text-blue-600 transition font-medium">Contact Us</a>
        </nav>

        {/* Login/Signup */}
        {showContent && (
          <div className="fixed top-7 right-7 z-50 transition-all duration-1000">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 border border-blue-500 hover:border-blue-400 hover:bg-blue-800 text-white"
            >
              Login / Signup
            </Button>
          </div>
        )}

        {/* Logo */}
        <div
          className={`absolute transition-all duration-1000 ${
            logoMoved
              ? "top-6 left-6 w-16 h-16"
              : "top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-pulse">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary rounded-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-white rounded-full relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-full h-0.5 top-1/2 -translate-y-1/2 ${
                      logoLoaded ? "animate-pulse" : ""
                    }`}
                  />
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-black transition-all duration-1000 ${
                  logoLoaded ? "scale-y-0" : "scale-y-100"
                } origin-top rounded-full`}
              />
            </div>

            {/* Scanning rings */}
            <div
              className={`absolute inset-0 border border-blue-400/30 rounded-full animate-ping ${
                logoLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ animationDuration: "3s" }}
            />
            <div
              className={`absolute inset-2 border border-blue-400/20 rounded-full animate-ping ${
                logoLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ animationDuration: "2s", animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Landing Content */}
        <div
          className={`relative z-10 text-center transition-all duration-1000 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <img
            src="/cctv-camera.jpg"
            className="absolute inset-0 mx-auto my-auto w-120 opacity-30 -z-10"
            style={{ top: "110%", left: "50%", transform: "translate(-50%, -50%)" }}
          />

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight relative z-10">
            WatcherAI
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-2 font-light relative z-10">
            Advanced Surveillance Solutions
          </p>
          <p className="text-sm md:text-lg text-gray-400 mb-8 max-w-md mx-auto leading-relaxed relative z-10">
            Protecting what matters most with cutting-edge security technology and 24/7 monitoring systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Access System
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-medium transition-all duration-300 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen w-full flex flex-col justify-center items-center bg-transparent md:px-20 snap-start relative z-0"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
          Features
        </h2>

        <div className="w-full max-w-6xl">
          {/* Top Headings Pagination Container */}
         <div
          id="feature-pagination"
          className="grid grid-cols-4 w-full mb-2 border-b border-gray-600"
        ></div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{
            clickable: true,
            el: "#feature-pagination",
            renderBullet: (index, className) => {
              const titles = [
                "Detect events in 24 surveillance footage",
                "Smart Alerts in Real-time",
                "AI-based search",
              ]
              return `<span class="${className} block text-center font-bold px-2 pb-10 cursor-pointer text-gray-400 text-4xl md:text-5xl transition-colors duration-300 hover:text-blue-400 swiper-pagination-bullet-active:text-blue-400">
                        ${titles[index]}
                      </span>`
            },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="rounded-3xl">

            {/* Slide 1 */}
            <SwiperSlide>
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-blue-400/5 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex-1 flex flex-col items-start space-y-6">
                
                {/* Heading with emoji inline at the end */}
                <h3 className="flex items-center gap-3 text-3xl md:text-4xl pl-10 font-semibold text-blue-200 -mt-2">
                  Find Events in 3 Clicks
                  <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20">
                    🔍
                  </span>
                </h3>

                {/* Paragraph */}
                <p className="text-gray-300 text-lg md:text-xl pl-10 leading-relaxed -mt-1">
                  Quickly search past recordings using AI-powered 
                  <br />
                  filters and object recognition.
                </p>
              </div>

              {/* Right side video placeholder */}
              <div className="flex-1 flex justify-center -ml-10">
                <div className="w-full h-64 md:h-96 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center text-blue-300 -ml-10">
                  <span className="text-lg">[ Video Placeholder ]</span>
                </div>
              </div>
            </div>
          </SwiperSlide>



            {/* Slide 2 */}
            <SwiperSlide>
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-blue-400/5 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex-1 flex flex-col items-start space-y-6">
                
                {/* Heading with emoji inline at the end */}
                <h3 className="flex items-center gap-3 text-2xl md:text-3xl pl-10 font-semibold text-blue-200 -mt-2">
                  Smart Alerts in Real-time
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500/20">
                    🚨
                  </span>
                </h3>

                {/* Paragraph */}
                <p className="text-gray-300 text-lg md:text-xl pl-10 leading-relaxed -mt-1">
                  Get real-time alerts for anomalies and suspicious activity across all connected cameras.
                </p>
              </div>

              {/* Right side video placeholder */}
              <div className="flex-1 flex justify-center -ml-10">
                <div className="w-full h-64 md:h-96 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center text-blue-300 -ml-10">
                  <span className="text-lg">[ Video Placeholder ]</span>
                </div>
              </div>
            </div>
          </SwiperSlide>


            {/* Slide 3 */}
            <SwiperSlide>
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-blue-400/5 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex-1 flex flex-col items-start space-y-6 max-w-md">
                
                {/* Heading with emoji inline at the end */}
                <h3 className="flex items-center gap-3 text-2xl md:text-3xl pl-10 font-semibold text-blue-200 -mt-2">
                  Share Clips Instantly
                  <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20">
                    📹
                  </span>
                </h3>

                {/* Paragraph */}
                <p className="text-gray-300 text-lg md:text-xl pl-10 leading-relaxed -mt-1">
                  Quick video sharing features take away the frustration of collaborating with witness accounts and sending video to those that need it.
                </p>
              </div>

              {/* Right side video placeholder */}
              <div className="flex-1 flex justify-center -ml-10">
                <div className="w-12/13 h-64 md:h-96 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center text-blue-300 -ml-5">
                  <span className="text-lg">[ Video Placeholder ]</span>
                </div>
              </div>
            </div>
          </SwiperSlide>


          </Swiper>
        </div>
      </section>

      {/* Domain Section */}
        <section
          id="domain"
          className="w-full flex flex-col justify-start items-center bg-transparent md:px-20 snap-start relative z-0 overflow-hidden pt-32 pb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
            Domains
          </h2>

          {/* Domain carousel */}
          <div className="w-full overflow-hidden relative mb-16">
            <div className="flex animate-slideLeft gap-6">
              {["AI Security", "Smart Cities", "IoT Monitoring", "Surveillance Analytics"].map((title, index) => (
                <div
                  key={index}
                  className="flex-none w-72 h-64 md:h-80 bg-blue-500/10 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-4 relative"
                >
                  <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-2 z-10">{title}</h3>
                  <img
                    src={`/domain-${index + 1}.jpg`}
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-30 -z-10"
                  />
                </div>
              ))}
              {["AI Security", "Smart Cities", "IoT Monitoring", "Surveillance Analytics"].map((title, index) => (
                <div
                  key={`dup-${index}`}
                  className="flex-none w-72 h-64 md:h-80 bg-blue-400/10 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-4 relative"
                >
                  <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-2 z-10">{title}</h3>
                  <img
                    src={`/domain-${index + 1}.jpg`}
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-30 -z-10"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Full-width Feature Card */}
          <div className="w-full bg-blue-500/10 backdrop-blur-md rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-10">
            
            {/* Left Side Image */}
            <div className="flex-1 flex justify-center">
              <img
                src="/smart-city.png"
                alt="Feature"
                className="w-full md:w-auto h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Right Side Text + Bullets */}
            <div className="flex-1 flex flex-col justify-between items-center h-full max-w-xl mx-auto">
            <ul className="flex flex-col gap-6">
              {/* Bullet 1 */}
              <li className="flex items-start gap-3">
                {/* Icon at start */}
                <img src="/icons/computer.svg" className="w-6 h-6 mt-1" alt="Computer Icon" />
                <span className="text-lg md:text-2xl text-gray-300 pb-5">
                  High Performance Computing
                </span>
              </li>

              {/* Bullet 2 */}
              <li className="flex items-start gap-3">
                <img src="/icons/rocket.svg" className="w-6 h-6 mt-1" alt="Rocket Icon" />
                <span className="text-lg md:text-2xl text-gray-300 pb-5">
                  Fast Deployment
                </span>
              </li>

              {/* Bullet 3 */}
              <li className="flex items-start gap-3">
                <img src="/icons/security.svg" className="w-6 h-6 mt-1" alt="Security Icon" />
                <span className="text-lg md:text-2xl text-gray-300 pb-5">
                  Secure & Reliable
                </span>
              </li>

              {/* Bullet 4 */}
              <li className="flex items-start gap-3">
                <img src="/icons/cloud.svg" className="w-6 h-6 mt-1" alt="Cloud Icon" />
                <span className="text-lg md:text-2xl text-gray-300 pb-5">
                  Cloud Integration
                </span>
              </li>

              {/* Bullet 5 */}
              <li className="flex items-start gap-3">
                <img src="/icons/analytics.svg" className="w-6 h-6 mt-1" alt="Analytics Icon" />
                <span className="text-lg md:text-2xl text-gray-300 pb-5">
                  Advanced Analytics
                </span>
              </li>
            </ul>

          </div>




          </div>
        </section>


      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-xs text-gray-500">© 2024 SecureVision. Advanced Security Solutions.</p>
      </footer>
    </div>
  )
}
