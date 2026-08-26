import Hero from "@/components/Hero";
import FeaturedNotes from "@/components/FeaturedNotes";
import ProjectTeaser from "@/components/ProjectTeaser";
import GalleryTeaser from "@/components/GalleryTeaser";
import PlaygroundTeaser from "@/components/PlaygroundTeaser";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import HomeScrollMotion from "@/components/HomeScrollMotion";
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

      <section className="flex min-h-[100dvh] flex-col border-t border-[#36513B]/16 pt-20 dark:border-white/16 md:pt-28">
        <NewsletterSection />
        <div className="mt-auto pt-16 md:pt-24">
          <Footer />
        </div>
      </section>

      <HomeScrollMotion />
    </>
  );
}
