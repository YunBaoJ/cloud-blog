import Footer from "@/components/Footer";
import { GALLERY_PHOTOS, PLAYGROUND_ITEMS } from "@/data/siteContent";
import { getAllNotes } from "@/lib/notes";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock3,
  Code2,
  Gamepad2,
  Heart,
  ImageIcon,
  Layers3,
  Mail,
  Palette,
  Rss,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutContent() {
  const notes = getAllNotes();
  const notesCount = notes.length;
  const galleryCount = GALLERY_PHOTOS.length;
  const playgroundCount = PLAYGROUND_ITEMS.length;

  const COTTAGE_ROOMS = [
    {
      href: "/notes",
      title: "随笔笔记",
      tag: `${notesCount} 篇沉淀`,
      description: "记录系统架构、前端设计与日常思考，持续积累可回溯的知识库。",
      action: "前往阅读",
      icon: BookOpen,
    },
    {
      href: "/gallery",
      title: "作品画廊",
      tag: `${galleryCount} 幅收藏`,
      description: "收录原创插画、二次元灵感与光影瞬间，在纸感长卷中静静漫步。",
      action: "漫步图集",
      icon: ImageIcon,
    },
    {
      href: "/projects",
      title: "工程档案",
      tag: "实战案例",
      description: "包含多角色智慧宿舍系统等真实项目，涵盖完整的前后端架构与闭环实践。",
      action: "查看案例",
      icon: Layers3,
    },
    {
      href: "/playground",
      title: "游乐实验",
      tag: `${playgroundCount} 款游戏`,
      description: "把好奇心做成浏览器即开即玩的轻巧游戏，从复古像素到博弈 AI。",
      action: "立刻体验",
      icon: Gamepad2,
    },
  ] as const;

  const PHILOSOPHY_ITEMS = [
    {
      icon: Sparkles,
      title: "内容为先，界面克制",
      description: "让文字、代码与艺术画面自然呼吸，减少冗余装饰与视觉噪音，保持长久阅读的舒适感。",
    },
    {
      icon: Heart,
      title: "温润持久，不随波逐流",
      description: "像经典胶片与手工工艺一样注重细节与时间沉淀，追求经得起反复翻阅的自留地质感。",
    },
    {
      icon: CheckCircle2,
      title: "真实可用，全端闭环",
      description: "每一个组件、每一个 API 契约、每一款游戏都真实可交互、可验证，不呈现虚饰数据。",
    },
  ] as const;

  const TECH_STACK_GROUPS = [
    {
      label: "前端与交互",
      skills: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "GSAP 动效"],
    },
    {
      label: "后端与服务",
      skills: ["Spring Boot 3", "Java 17", "MyBatis-Plus", "MySQL", "JWT 鉴权", "RESTful API"],
    },
    {
      label: "审美与设计",
      skills: ["Mossland Warm Light 调色盘", "WCAG 4.5:1 无障碍", "响应式流式布局", "深浅自适应"],
    },
  ] as const;

  const HOBBIES = [
    {
      title: "界面美学",
      subtitle: "反俗套前端审美与秩序",
      description: "探索去模板化的微动效、克制的调色盘与呼吸感排版。用严谨的代码实现设计师级的视觉质感与无障碍体验。",
      link: "/notes/design-taste-frontend-craft",
      linkText: "阅读《反俗套前端审美与工程化实践》",
      icon: Palette,
    },
    {
      title: "胶片光影",
      subtitle: "Wabi-Sabi 残缺美学",
      description: "银盐颗粒的物理质感、机械快门的清脆声响与未知的显影等待。接纳偶得的过曝与光斑，在不完美与时间流逝中记录生活的质朴诗意。",
      link: "/notes/film-photography-wabisabi",
      linkText: "阅读《胶片摄影中的侘寂美学》",
      icon: Camera,
    },
    {
      title: "算法博弈",
      subtitle: "逻辑推演的纯粹乐趣",
      description: "从 8-bit 复古贪吃蛇到基于 Minimax 剪枝的象棋 AI。在经典规则与有限状态机中构筑微缩宇宙，体验算法对弈与交互落子的纯粹乐趣。",
      link: "/playground",
      linkText: "前往体验游乐场",
      icon: Gamepad2,
    },
  ] as const;

  return (
    <main className="min-h-[100dvh] bg-transparent text-[var(--foreground)]">
      {/* 1. Header & Intro Hero */}
      <section className="px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          {/* Standard Inner Page Header Rhythm */}
          <div className="flex items-end justify-between gap-8 border-b border-[var(--border-line-color)] pb-10">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--accent-green)]">
                <User className="size-4" strokeWidth={1.8} aria-hidden="true" />
                <span>关于</span>
              </div>
              <h1 className="text-4xl font-light tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
                关于 Kasumi
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
                一间坐落在互联网角落的数字小屋，记录技术探索、视觉灵感与生活趣味。
              </p>
            </div>
            <span className="hidden shrink-0 pb-1 text-xs font-medium text-[var(--muted)] sm:block">
              自 2025 年持续耕耘
            </span>
          </div>

          {/* Asymmetric Editorial Hero */}
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)]/70 px-3.5 py-1 text-xs font-medium text-[var(--accent-green)] shadow-xs backdrop-blur-xs">
                <span>你好，欢迎来到这里</span>
              </div>

              <h2 className="mt-5 text-2xl font-medium leading-snug tracking-[-0.035em] sm:text-3xl lg:text-4xl">
                我是 Kasumi，一名喜欢把代码写得工整、把界面调得舒心的创作者。
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
                <p>
                  这间小屋建于 Next.js 之上，是我在喧嚣网络之外保留的一处自留地。这里不追求高频流量或刻板履历，而是专注于三件事：把学到的工程技术理清、把打动自己的视觉画面收录、把有趣的灵感做成能够直接在浏览器里玩耍的小实验。
                </p>
                <p>
                  从 Spring Boot 与 Java 企业级后端架构，到 React、Next.js 与现代前端审美工程；从设计系统里的呼吸节奏，到胶片摄影里的残缺美学。这里记录着我真实走过的技术脉络与生活侧影。
                </p>
              </div>

              {/* Persona Capsules */}
              <div className="mt-8 flex flex-wrap items-center gap-2.5" aria-label="个人志趣标签">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-2xs">
                  <Palette className="size-3.5 text-[var(--accent-clay)]" strokeWidth={1.8} />
                  界面美学
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-2xs">
                  <Camera className="size-3.5 text-[var(--accent-green)]" strokeWidth={1.8} />
                  胶片光影
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-2xs">
                  <Code2 className="size-3.5 text-[var(--accent-green)]" strokeWidth={1.8} />
                  现代全栈
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-2xs">
                  <Gamepad2 className="size-3.5 text-[var(--accent-clay)]" strokeWidth={1.8} />
                  算法博弈
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/projects/dormitory-system"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent-green)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] shadow-xs transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none"
                >
                  <span>查看实战案例（智慧宿舍系统）</span>
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden="true" />
                </Link>
                <Link
                  href="/now"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-[background-color,border-color,transform] duration-200 hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none"
                >
                  <Clock3 className="size-4 text-[var(--accent-green)]" strokeWidth={1.8} />
                  <span>查看近况脉络</span>
                </Link>
              </div>
            </div>

            {/* Right Desk Image */}
            <div className="relative">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/80 bg-[var(--surface-2)] shadow-[0_20px_50px_rgba(51,72,58,0.09)] dark:border-white/10 dark:shadow-none">
                <Image
                  src="/about/about-space.png"
                  alt="木质书桌与漫射光的数字工坊空间"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02] motion-reduce:transition-none"
                />
                <figcaption className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/60 bg-[var(--surface)]/85 px-3.5 py-2 text-xs font-medium text-[var(--foreground)] shadow-xs backdrop-blur-md dark:border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">编码、写作与思考的数字工坊角落</span>
                    <span className="shrink-0 text-[10px] text-[var(--muted)]">Kasumi Space</span>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cottage Rooms Map (小屋空间导览) */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20" aria-labelledby="cottage-rooms-title">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-line-color)] pb-6 sm:flex-row sm:items-end">
            <div>
              <h2 id="cottage-rooms-title" className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                这间小屋的空间版图
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--muted)]">
              内容没有生硬的边界，而是自然流淌在四个彼此连通的房间里。
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COTTAGE_ROOMS.map((room) => {
              const Icon = room.icon;
              return (
                <Link
                  key={room.href}
                  href={room.href}
                  className="group flex min-h-[14.5rem] flex-col justify-between rounded-3xl border border-white/70 bg-[var(--surface)]/75 p-6 shadow-[0_12px_32px_rgba(51,72,58,0.06)] backdrop-blur-md transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-[0_20px_45px_rgba(51,72,58,0.1)] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] active:scale-[0.99] motion-reduce:transition-none dark:border-white/10"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent-green)] transition-colors group-hover:bg-[var(--accent-green)] group-hover:text-[var(--background)]">
                        <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <span className="rounded-full border border-[var(--border-line-color)] bg-[var(--surface-2)]/60 px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]">
                        {room.tag}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] transition-colors group-hover:text-[var(--accent-green)]">
                      {room.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-[var(--muted)] line-clamp-3">
                      {room.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[var(--border-line-color)]/60 pt-4 text-xs font-semibold text-[var(--accent-green)]">
                    <span>{room.action}</span>
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" strokeWidth={1.8} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Philosophy & Tech Stack (营造哲学与技术工坊) */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20" aria-labelledby="craft-philosophy-title">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Left: Building Principles */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-white/70 bg-[var(--surface)]/80 p-7 shadow-[0_16px_40px_rgba(51,72,58,0.06)] backdrop-blur-md sm:p-10 dark:border-white/10">
              <div>
                <h2 id="craft-philosophy-title" className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  让软件回归温润与纯粹
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  在追求速度与模板化的数字世界里，坚持手工打磨带来的秩序感与舒适度。
                </p>

                <div className="mt-8 space-y-6">
                  {PHILOSOPHY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex gap-4">
                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent-green)]">
                          <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--foreground)]">{item.title}</h3>
                          <p className="mt-1 text-xs leading-6 text-[var(--muted)]">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Digital Workbench Tech Stack */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-white/70 bg-[var(--surface)]/80 p-7 shadow-[0_16px_40px_rgba(51,72,58,0.06)] backdrop-blur-md sm:p-10 dark:border-white/10">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  支撑这间小屋的基石
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  全栈工程实践与现代化工具箱，保证性能、安全性与可维护性。
                </p>

                <div className="mt-8 space-y-6">
                  {TECH_STACK_GROUPS.map((group) => (
                    <div key={group.label} className="rounded-2xl border border-[var(--border-line-color)]/70 bg-[var(--surface-2)]/40 p-4">
                      <h3 className="text-xs font-semibold text-[var(--foreground)]">{group.label}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--foreground)] shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hobbies & Life Rituals (日常侧影与志趣) */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20" aria-labelledby="hobbies-section-title">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-line-color)] pb-6 sm:flex-row sm:items-end">
            <div>
              <h2 id="hobbies-section-title" className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                代码之外的日常志趣
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--muted)]">
              技术是表达的工具，而生活的温度赋予了创造更深层的意义。
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {HOBBIES.map((hobby) => {
              const Icon = hobby.icon;
              return (
                <div
                  key={hobby.title}
                  className="flex flex-col justify-between rounded-3xl border border-white/70 bg-[var(--surface)]/75 p-6 shadow-[0_12px_32px_rgba(51,72,58,0.06)] backdrop-blur-md dark:border-white/10"
                >
                  <div>
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent-green)]">
                      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{hobby.title}</h3>
                    <p className="text-xs font-medium text-[var(--accent-clay)]">{hobby.subtitle}</p>
                    <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                      {hobby.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[var(--border-line-color)]/60 pt-4">
                    <Link
                      href={hobby.link}
                      className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-green)] transition-colors hover:text-[var(--foreground)]"
                    >
                      <span>{hobby.linkText}</span>
                      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Stay Connected / Postbox (信箱与常驻入口) */}
      <section className="px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pb-32 lg:pt-20" aria-labelledby="contact-section-title">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.25rem] border border-white/80 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)]/80 p-8 shadow-[0_20px_50px_rgba(51,72,58,0.08)] backdrop-blur-md sm:p-12 lg:p-16 dark:border-white/10 dark:from-[var(--surface)] dark:to-[var(--surface-2)]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-14 lg:items-center">
              <div>
                <h2 id="contact-section-title" className="text-2xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  保持联系，欢迎给我写信
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  如果你对小屋里的随笔、工程案例或图集有任何想法，亦或是有有趣的技术灵感想一起交流探讨，欢迎随时投递信件。
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-xs transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none"
                  >
                    <Mail className="size-4 shrink-0 transition-transform group-hover:scale-110" strokeWidth={1.8} aria-hidden="true" />
                    <span>写信给 Kasumi ({CONTACT_EMAIL})</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                  </a>

                  <Link
                    href="/feed.xml"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--border-line-color)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-[border-color,background-color,transform] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none"
                  >
                    <Rss className="size-4 text-[var(--accent-clay)]" strokeWidth={1.8} />
                    <span>订阅 RSS 动态</span>
                  </Link>
                </div>
              </div>

              {/* Quick Jump List */}
              <div className="rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface)]/70 p-6 shadow-2xs">
                <p className="text-xs font-semibold text-[var(--foreground)]">常驻探索入口</p>
                <ul className="mt-4 space-y-3 text-xs font-medium">
                  <li>
                    <Link
                      href="/now"
                      className="group flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent-green)]"
                    >
                      <span className="flex items-center gap-2">
                        <Clock3 className="size-3.5 text-[var(--accent-green)]" />
                        近况脉络与最新动态
                      </span>
                      <ArrowUpRight className="size-3 text-[var(--muted)] group-hover:text-[var(--accent-green)]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/projects/dormitory-system"
                      className="group flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent-green)]"
                    >
                      <span className="flex items-center gap-2">
                        <Layers3 className="size-3.5 text-[var(--accent-green)]" />
                        智慧宿舍系统工程案例
                      </span>
                      <ArrowUpRight className="size-3 text-[var(--muted)] group-hover:text-[var(--accent-green)]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/playground"
                      className="group flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent-green)]"
                    >
                      <span className="flex items-center gap-2">
                        <Gamepad2 className="size-3.5 text-[var(--accent-clay)]" />
                        浏览器经典游戏游乐场
                      </span>
                      <ArrowUpRight className="size-3 text-[var(--muted)] group-hover:text-[var(--accent-green)]" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
