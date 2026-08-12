import Hero from "@/components/Hero";
import HomepageStats from "@/components/HomepageStats";
import FeaturedNotes from "@/components/FeaturedNotes";
import GalleryTeaser from "@/components/GalleryTeaser";
import PlaygroundTeaser from "@/components/PlaygroundTeaser";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { getFeaturedNotes } from "@/lib/notes";

export default function Home() {
  const notes = getFeaturedNotes();

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden">
      <main className="relative z-10 flex-grow w-full">
        <Hero />
        <HomepageStats />
        <FeaturedNotes initialNotes={notes} />
        <GalleryTeaser />
        <PlaygroundTeaser />
        <NewsletterSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
