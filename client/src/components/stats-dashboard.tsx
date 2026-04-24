import { Link } from "wouter";
import { GraduationCap, Users, MessageSquare, Sparkles, ArrowUpRight } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { usePageContent, getVal } from "@/hooks/use-content";
import { AnimateIn } from "@/hooks/use-animate-on-scroll";

type StatItem = {
  count: number;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  testid: string;
  suffix?: string;
};

function StatCard({ stat }: { stat: StatItem }) {
  const { count, ref } = useCountUp(stat.count);
  const Icon = stat.icon;
  return (
    <Link href={stat.href} onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
      <div
        ref={ref}
        role="link"
        tabIndex={0}
        className="group glass-card rounded-2xl p-6 md:p-7 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 relative overflow-hidden"
        data-testid={`card-stat-${stat.testid}`}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div>
          <p
            className="font-heading font-bold text-3xl md:text-4xl text-foreground tabular-nums leading-none"
            data-testid={`text-stat-count-${stat.testid}`}
          >
            {count}
            <span className="text-primary">{stat.suffix ?? "+"}</span>
          </p>
          <p className="text-muted-foreground text-sm mt-2" data-testid={`text-stat-label-${stat.testid}`}>
            {stat.label}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function StatsDashboard() {
  const { data: consultation } = usePageContent("consultation");
  const { data: bootcamp } = usePageContent("bootcamp");
  const { data: mentorship } = usePageContent("mentorship");
  const { data: automati } = usePageContent("automati");
  const { data: globalContent } = usePageContent("global");

  const dashEyebrow = getVal(globalContent, "statsDashboard", "eyebrow", "By the numbers");
  const dashTitle = getVal(globalContent, "statsDashboard", "title", "Impact across every service");
  const dashSubtitle = getVal(globalContent, "statsDashboard", "subtitle", "A snapshot of the people, projects, and engagements behind the work. Tap any card to explore that service.");

  const parseCount = (raw: string, fallback: number) => {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : fallback;
  };

  const stats: StatItem[] = [
    {
      count: parseCount(getVal(mentorship, "stats", "count", "572"), 572),
      label: getVal(mentorship, "stats", "label", "Mentees Guided"),
      href: "/mentorship",
      icon: Users,
      testid: "mentorship",
    },
    {
      count: parseCount(getVal(bootcamp, "stats", "count", "320"), 320),
      label: getVal(bootcamp, "stats", "label", "BootcampAI Students"),
      href: "/bootcampai",
      icon: GraduationCap,
      testid: "bootcamp",
    },
    {
      count: parseCount(getVal(consultation, "stats", "count", "48"), 48),
      label: getVal(consultation, "stats", "label", "Consultations Delivered"),
      href: "/consultation",
      icon: MessageSquare,
      testid: "consultation",
    },
    {
      count: parseCount(getVal(automati, "valueStrip", "clientCount", "26"), 26),
      label: getVal(automati, "valueStrip", "clientLabel", "Automati Clients"),
      href: "/automati",
      icon: Sparkles,
      testid: "automati",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20" data-testid="section-stats-dashboard">
      <AnimateIn>
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-3 font-bold" data-testid="text-dashboard-eyebrow">
            {dashEyebrow}
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground" data-testid="text-dashboard-title">
            {dashTitle}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-3" data-testid="text-dashboard-subtitle">
            {dashSubtitle}
          </p>
        </div>
      </AnimateIn>
      <AnimateIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {stats.map((s) => (
            <StatCard key={s.testid} stat={s} />
          ))}
        </div>
      </AnimateIn>
    </section>
  );
}
