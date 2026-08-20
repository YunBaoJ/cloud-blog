import Link from "next/link";
import { ArrowRight, Award, Bot, Dices, Gamepad2, Grid } from "lucide-react";
import { PLAYGROUND_ITEMS, type PlaygroundItem } from "@/data/siteContent";

function GameIcon({ iconName, inverted = false }: { iconName: string; inverted?: boolean }) {
  const className = inverted ? "h-5 w-5 text-[#FFFEF9]" : "h-5 w-5 text-[#36513B] dark:text-[#B8CEB4]";

  switch (iconName) {
    case "Snake":
      return <Dices className={className} aria-hidden="true" />;
    case "Grid":
      return <Grid className={className} aria-hidden="true" />;
    case "Bot":
      return <Bot className={className} aria-hidden="true" />;
    case "Award":
      return <Award className={className} aria-hidden="true" />;
    default:
      return <Gamepad2 className={className} aria-hidden="true" />;
  }
}

function GameShelfEntry({ item, index }: { item: PlaygroundItem; index: number }) {
  return (
    <Link
      href={`/playground#${item.id}`}
      className="group flex min-h-[76px] items-center gap-4 rounded-[16px] border border-transparent px-4 py-3 transition-[background-color,transform,border-color] duration-300 hover:-translate-x-1 hover:border-[#36513B]/16 hover:bg-[#FFFEF9]/76 focus-visible:border-[#36513B] focus-visible:outline-none dark:hover:border-white/16 dark:hover:bg-white/5 motion-reduce:transition-none"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#E4E9DD] dark:bg-[#314132]">
        <GameIcon iconName={item.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#26352A] dark:text-[#F0F5F1]">{item.title}</span>
          <span className="font-mono text-[10px] text-[#8A9A88]">{String(index + 2).padStart(2, "0")}</span>
        </span>
        <span className="mt-1 block truncate text-xs text-[#748176] dark:text-[#A7B5AA]">{item.tag}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#718F6E] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
    </Link>
  );
}

export default function PlaygroundTeaser() {
  const [featuredGame, ...shelfGames] = PLAYGROUND_ITEMS;

  if (!featuredGame) return null;

  return (
    <section id="playground" className="w-full border-t border-[#36513B]/16 bg-transparent px-4 py-16 dark:border-white/16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
            灵感<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">游乐场</em>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#627161] dark:text-[#9EB3A4] sm:text-base">
            一组可以随时打开的小实验，在写作和整理之间换一种轻松的思考方式。
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <Link
            href={`/playground#${featuredGame.id}`}
            className="group relative flex min-h-[342px] flex-col overflow-hidden rounded-[22px] border border-[#36513B]/16 bg-[#36513B] p-7 text-[#FFFEF9] shadow-[0_18px_38px_rgba(38,53,42,0.16)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(38,53,42,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#36513B] dark:border-white/16 motion-reduce:transition-none sm:p-8"
          >
            <span className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/10" aria-hidden="true" />
            <span className="pointer-events-none absolute right-8 top-10 h-28 w-28 rounded-[28px] border border-white/10 bg-white/5 rotate-12" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FFFEF9]/14 text-[#FFFEF9]">
                <GameIcon iconName={featuredGame.icon} inverted />
              </span>
              <span className="rounded-full border border-white/14 px-3 py-1 text-xs font-medium text-white/82">{featuredGame.tag}</span>
            </div>

            <div className="relative mt-auto">
              <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#D7E3D0]">随时可玩</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-[#FFFEF9] sm:text-4xl">{featuredGame.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/74">{featuredGame.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FFFEF9]">开始体验 <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" /></span>
            </div>
          </Link>

          <div className="rounded-[22px] border border-[#36513B]/14 bg-[#F6F4EC]/58 p-2 dark:border-white/14 dark:bg-[#1D2920]/50">
            {shelfGames.map((item, index) => <GameShelfEntry key={item.id} item={item} index={index} />)}
          </div>
        </div>

        <Link href="/playground" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#36513B] transition-colors hover:text-[#26352A] dark:text-[#B8CEB4] dark:hover:text-white">
          查看全部游戏
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
