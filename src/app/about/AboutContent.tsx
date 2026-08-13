import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Gamepad2,
  ImageIcon,
  Mail,
  Sprout,
} from "lucide-react";

const COTTAGE_ROOMS = [
  {
    href: "/notes",
    title: "文字",
    description: "写下技术实践，也整理阅读与生活中的想法。",
    action: "去阅读",
    icon: BookOpen,
  },
  {
    href: "/gallery",
    title: "图像",
    description: "收集原创插画、动漫作品与日常视觉灵感。",
    action: "看作品",
    icon: ImageIcon,
  },
  {
    href: "/playground",
    title: "实验",
    description: "把好奇心做成可以在浏览器里打开的小作品。",
    action: "去体验",
    icon: Gamepad2,
  },
] as const;

export default function AboutContent() {
  return (
    <main className="min-h-[100dvh] bg-transparent text-[var(--foreground)]">
      <section className="px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
              <Sprout className="size-4" strokeWidth={1.8} aria-hidden="true" />
              <span>关于小屋</span>
            </div>
            <h1 className="text-4xl font-light tracking-[-0.05em] sm:text-5xl">
              关于我
            </h1>
          </div>

          <div className="mt-12 grid items-end gap-9 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
            <div className="pb-1">
              <p className="max-w-[24ch] text-2xl font-medium leading-snug tracking-[-0.035em] sm:text-3xl">
                你好，我是 Cloud。这是我保存文字、图像与小实验的地方。
              </p>
              <p className="mt-6 max-w-[56ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
                我在这里整理正在学习的技术，也留下阅读、创作和日常生活中的灵感。比起展示一份履历，我更希望这间小屋能慢慢长成真实的个人记录。
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--surface-2)] shadow-[0_18px_50px_rgba(45,43,44,0.09)] dark:shadow-none">
              <Image
                src="/about-desk.jpg"
                alt="摆放着键盘、笔记本、绿植和咖啡的桌面"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              这间小屋
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
              内容没有严格边界，但始终围绕三件事展开。
            </p>
          </div>

          <div className="mt-10 divide-y divide-[var(--border-line-color)] border-y border-[var(--border-line-color)]">
            {COTTAGE_ROOMS.map((room) => {
              const Icon = room.icon;

              return (
                <Link
                  key={room.href}
                  href={room.href}
                  className="group grid min-h-24 items-center gap-3 py-5 outline-none transition-colors duration-200 hover:text-[var(--accent-green)] focus-visible:text-[var(--accent-green)] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none md:grid-cols-[9rem_minmax(0,1fr)_auto] md:gap-8"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-[var(--accent-green)]" strokeWidth={1.7} aria-hidden="true" />
                    <h3 className="text-lg font-semibold">{room.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-[var(--muted)]">{room.description}</p>
                  <span className="inline-flex min-h-11 items-center gap-1.5 justify-self-start text-sm font-semibold md:justify-self-end">
                    {room.action}
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl rounded-[1.5rem] bg-[var(--surface)] p-7 ring-1 ring-[var(--border-line-color)] sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              正在做的事
            </h2>
            <p className="mt-6 text-2xl font-medium leading-snug tracking-[-0.035em] sm:text-4xl">
              把学到的东西写清楚，把喜欢的东西留下来。
            </p>
            <p className="mt-6 max-w-[62ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
              目前主要在持续整理技术笔记、维护这间小屋，也尝试把一些想法做成能够直接打开和体验的网页作品。
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="mx-auto max-w-6xl rounded-[1.5rem] bg-[var(--accent-green)] p-7 text-[var(--background)] sm:p-10 lg:p-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              保持联系
            </h2>
            <p className="mt-4 text-sm leading-7 opacity-80 sm:text-base">
              如果你想聊聊文章、作品或网站本身，欢迎给我写信。
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--accent-green)] outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--surface)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--accent-green)] motion-reduce:transition-none"
            >
              <Mail className="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
              <span className="truncate">{CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
