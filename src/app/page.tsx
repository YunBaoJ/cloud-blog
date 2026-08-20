import Hero from "@/components/Hero";
import HomepageStats from "@/components/HomepageStats";
import FeaturedNotes from "@/components/FeaturedNotes";
import ProjectTeaser from "@/components/ProjectTeaser";
import GalleryTeaser from "@/components/GalleryTeaser";
import PlaygroundTeaser from "@/components/PlaygroundTeaser";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getAllNotes, getFeaturedNotes } from "@/lib/notes";
import { getAllGalleryPhotos } from "@/lib/gallery";
import { PLAYGROUND_ITEMS } from "@/data/siteContent";

export default function Home() {
  const allNotes = getAllNotes();
  const featuredNotes = getFeaturedNotes();
  const allPhotos = getAllGalleryPhotos();

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden">
      <main className="relative z-10 flex-grow w-full">
        {/* 1. Hero 顶部首屏直接呈现 */}
        <Hero />

        {/* 2. 状态指标分栏：向下滑动滚动渐入并上滑 */}
        <ScrollReveal yOffset={32} duration={0.75}>
          <HomepageStats
            notesCount={allNotes.length}
            photosCount={allPhotos.length}
            gamesCount={PLAYGROUND_ITEMS.length}
          />
        </ScrollReveal>

        {/* 3. 随笔手记分栏：向下滑动滚动渐入并上滑 */}
        <ScrollReveal yOffset={40} duration={0.8}>
          <FeaturedNotes
            initialNotes={featuredNotes}
            totalNotesCount={allNotes.length}
          />
        </ScrollReveal>

        {/* 4. 精选项目分栏：向下滑动滚动渐入并上滑 */}
        <ScrollReveal yOffset={40} duration={0.8}>
          <ProjectTeaser />
        </ScrollReveal>

        {/* 5. 摄影画廊分栏：向下滑动滚动渐入并上滑 */}
        <ScrollReveal yOffset={40} duration={0.8}>
          <GalleryTeaser totalPhotosCount={allPhotos.length} />
        </ScrollReveal>

        {/* 6. 灵感游乐场分栏：向下滑动滚动渐入并上滑 */}
        <ScrollReveal yOffset={40} duration={0.8}>
          <PlaygroundTeaser />
        </ScrollReveal>

        {/* 7. 保持联络分栏：向下滑动滚动渐入并上滑 */}
        <ScrollReveal yOffset={40} duration={0.8}>
          <NewsletterSection />
        </ScrollReveal>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
