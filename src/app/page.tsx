import Hero from "@/components/Hero";
import FeaturedNotes from "@/components/FeaturedNotes";
import ProjectTeaser from "@/components/ProjectTeaser";
import GalleryTeaser from "@/components/GalleryTeaser";
import PlaygroundTeaser from "@/components/PlaygroundTeaser";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { getFeaturedNotes } from "@/lib/notes";

export default function Home() {
  const featuredNotes = getFeaturedNotes();

  return (
    <>
      <Hero />

      <FeaturedNotes initialNotes={featuredNotes} />

      <ProjectTeaser />

      <GalleryTeaser />

      <PlaygroundTeaser />

      <section className="min-h-[100dvh] border-t border-[#36513B]/16 px-4 py-20 dark:border-white/16 sm:px-6 md:py-28">
        <NewsletterSection />
        <Footer />
      </section>
    </>
  );
}
