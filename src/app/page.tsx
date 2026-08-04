import Hero from "@/components/Hero";
import HomepageStats from "@/components/HomepageStats";
import FeaturedNotes from "@/components/FeaturedNotes";
import GalleryTeaser from "@/components/GalleryTeaser";
import PlaygroundTeaser from "@/components/PlaygroundTeaser";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FAF7F2] text-[#2D2B2C] overflow-x-hidden">
      {/* Main Content Pipeline */}
      <main className="flex-grow w-full">
        {/* 1. Welcome Hero Component with Hitokoto Quote Capsule */}
        <Hero />

        {/* 2. Persona Status Pill & Focus Area Metrics Bar */}
        <HomepageStats />

        {/* 3. Featured Notes — Asymmetric Bento 7:5 Grid */}
        <FeaturedNotes />

        {/* 4. Polaroid Photography Showcase Teaser */}
        <GalleryTeaser />

        {/* 5. Digital Playground Interactive Lab Showcase */}
        <PlaygroundTeaser />

        {/* 6. Weekly Newsletter & Essay Subscription */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
