import HeroSection from "@/components/landing/hero-section-v3"
import FeatureShowcase from "@/components/landing/feature-showcase-v3"
import PricingSection from "@/components/landing/pricing-section-v3"
import Navbar from "@/components/layout/navbar-v3"
import Footer from "@/components/layout/footer-v3"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureShowcase />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
