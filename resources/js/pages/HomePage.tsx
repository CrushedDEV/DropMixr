import { Head } from "@inertiajs/react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/howitsworks";
import JoinUs from "@/components/joinus";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Head title="DropMix" />
      <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen font-sans">
        <Header />
        <HeroSection />
        <HowItWorks />
        <JoinUs />
        <Footer />
      </div>
    </>
  );
}
