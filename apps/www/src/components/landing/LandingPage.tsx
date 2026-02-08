import { useState, useEffect, useRef, type FC } from "react";

const Counter: FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = "",
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const FeatureCard: FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative p-6 rounded-2xl transition-all duration-500 hover:bg-[var(--landing-surface-hover)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, background-color 0.3s ease`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl border border-[var(--landing-border)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-[var(--landing-accent)]/10 flex items-center justify-center mb-4 text-[var(--landing-accent)] group-hover:bg-[var(--landing-accent)]/15 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-[var(--landing-text)] mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--landing-text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
};

const BrowserBar: FC = () => (
  <div className="flex items-center gap-2 px-4 py-3 bg-[#141416] rounded-t-2xl border-b border-white/[0.04]">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
    </div>
    <div className="flex-1 mx-8">
      <div className="bg-white/[0.06] rounded-lg px-4 py-1.5 text-xs text-[var(--landing-text-muted)] font-mono flex items-center gap-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          className="opacity-40"
        >
          <path
            d="M8 1L1 8l7 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          className="opacity-20"
        >
          <path
            d="M8 1l7 7-7 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="ml-2 opacity-60">example.com</span>
      </div>
    </div>
  </div>
);

const icons = {
  audit: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  meta: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  headings: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h8M4 18V6M12 18V6M17 10l3-4h-6l3 4M17 10v8" />
    </svg>
  ),
  images: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  links: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  social: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  accessibility: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v6M9 20l3-6 3 6M6 9h12" />
    </svg>
  ),
  export: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--landing-surface)] text-[var(--landing-text)] overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--landing-accent-glow)_0%,_transparent_70%)] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(232,164,74,0.04)_0%,_transparent_70%)]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 landing-stagger-1">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <nav className="flex items-center justify-between h-16 sm:h-20">
            <a href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="MetaBear"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[var(--landing-text)]">
                MetaBear
              </span>
            </a>
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[var(--landing-accent)] text-[#1a1a1e] text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-[var(--landing-accent)]/20"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="hidden sm:inline">Add to Chrome</span>
                <span className="sm:hidden">Install</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </nav>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--landing-border)] to-transparent" />
      </header>

      <section className="relative pt-32 sm:pt-44 pb-16 sm:pb-24 px-6 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="landing-stagger-2 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)] text-xs font-medium text-[var(--landing-text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--landing-accent)] animate-pulse" />
              Chrome Extension
              <span className="text-[var(--landing-text-dim)]">&middot;</span>
              Free & Open Source
            </span>
          </div>

          <h1 className="landing-stagger-3 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-6 sm:mb-8">
            <span className="block">See what search</span>
            <span className="block">
              engines{" "}
              <span className="relative inline-block">
                <span className="relative z-10">really</span>
                <span
                  className="absolute bottom-2 sm:bottom-3 left-0 right-0 h-5 sm:h-7"
                  style={{
                    background:
                      "linear-gradient(90deg, #6B8DD6 0%, #5B7AC7 100%)",
                    opacity: 0.3,
                    borderRadius: "2px",
                  }}
                />
              </span>{" "}
              see
            </span>
          </h1>

          <p className="landing-stagger-4 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-[var(--landing-text-muted)] leading-relaxed mb-10 sm:mb-14">
            Professional SEO & accessibility auditing, right in your browser.
            Analyze meta tags, heading structure, images, links, and social
            previews &mdash; all in one click.
          </p>

          <div className="landing-stagger-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--landing-accent)] text-[#1a1a1e] font-semibold text-base transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-[var(--landing-accent)]/25 hover:-translate-y-0.5"
              style={{
                animation: "landing-pulse-glow 4s ease-in-out infinite",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Add to Chrome &mdash; It's Free
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-[var(--landing-text-muted)] font-medium text-base transition-all duration-300 hover:text-[var(--landing-text)] hover:bg-white/[0.04]"
            >
              See features
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="landing-stagger-6 mx-auto max-w-5xl">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/50">
              <BrowserBar />
              <div className="relative bg-gradient-to-br from-[#0f1117] to-[#1a1a2e] aspect-[16/9] sm:aspect-[2/1] flex items-center justify-end overflow-hidden p-4 sm:p-8">
                <img
                  src="/showcase.webp"
                  alt="MetaBear Extension Panel"
                  className="h-full w-auto object-contain rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--landing-accent)]/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--landing-accent)]/3 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 py-8 px-6 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)]/50 backdrop-blur-sm">
            {[
              { value: 6, suffix: "", label: "Audit Panels" },
              { value: 100, suffix: "+", label: "SEO Checks" },
              { value: 50, suffix: "+", label: "Accessibility Rules" },
              { value: 1, suffix: "-Click", label: "Full Analysis" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--landing-accent)] tracking-tight">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-[var(--landing-text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything you need to
              <br />
              <span className="text-[var(--landing-accent)]">
                debug your SEO
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--landing-text-muted)] text-base sm:text-lg">
              Six powerful panels, one extension. Instantly audit any page
              without leaving your browser.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <FeatureCard
              icon={icons.audit}
              title="SEO Audit Score"
              description="Get an instant 0-100 SEO score with categorized issues by severity. See exactly what needs fixing and why."
              delay={0}
            />
            <FeatureCard
              icon={icons.meta}
              title="Meta Tag Inspector"
              description="Inspect title, description, canonical URL, language, and robots directives with character counts and validation."
              delay={80}
            />
            <FeatureCard
              icon={icons.headings}
              title="Heading Hierarchy"
              description="Visualize your heading structure at a glance. Click any heading to scroll directly to it on the page."
              delay={160}
            />
            <FeatureCard
              icon={icons.images}
              title="Image Analysis"
              description="Find missing alt text, broken images, and oversized files. Every image listed with actionable details."
              delay={240}
            />
            <FeatureCard
              icon={icons.links}
              title="Link Checker"
              description="Analyze internal, external, and nofollow links. Catch broken links and audit your link profile instantly."
              delay={320}
            />
            <FeatureCard
              icon={icons.social}
              title="Social Previews"
              description="Preview how your page appears on Google, Facebook, and Twitter. Inspect OG and Twitter Card meta tags."
              delay={400}
            />
            <FeatureCard
              icon={icons.accessibility}
              title="Accessibility Audit"
              description="Powered by axe-core, catch WCAG violations and accessibility issues with clear remediation guidance."
              delay={480}
            />
            <FeatureCard
              icon={icons.export}
              title="Export & AI Ready"
              description="Export full audit results as JSON. Copy issues as AI prompts for instant fix suggestions from your favorite LLM."
              delay={560}
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              }
              title="Blazing Fast"
              description="Native browser extension performance. No external API calls, no loading spinners. Results appear the instant you click."
              delay={640}
            />
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Three steps. That's it.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Install",
                desc: "Add MetaBear to Chrome from the Web Store. One click, zero configuration.",
              },
              {
                step: "02",
                title: "Click",
                desc: "Navigate to any webpage and click the MetaBear icon in your toolbar.",
              },
              {
                step: "03",
                title: "Fix",
                desc: "Review the audit, export issues, and fix them. Watch your SEO score climb.",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl sm:text-7xl font-black text-[var(--landing-accent)]/[0.07] absolute -top-4 -left-2 select-none transition-all duration-500 group-hover:text-[var(--landing-accent)]/[0.12]">
                  {item.step}
                </div>
                <div className="relative pt-8 sm:pt-10">
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-[var(--landing-text)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--landing-text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-12 -right-6 text-[var(--landing-text-dim)]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative py-16 sm:py-20 px-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--landing-accent)]/10 via-transparent to-[var(--landing-accent)]/5 rounded-3xl" />
            <div className="absolute inset-0 border border-[var(--landing-border)] rounded-3xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Start auditing today
              </h2>
              <p className="text-[var(--landing-text-muted)] text-base sm:text-lg mb-8 max-w-md mx-auto">
                Free, open source, and built for developers who care about SEO.
              </p>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--landing-accent)] text-[#1a1a1e] font-semibold text-base transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-[var(--landing-accent)]/25 hover:-translate-y-0.5"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Add to Chrome
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative px-6 sm:px-8 pb-8 pt-8 border-t border-[var(--landing-border)]">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="MetaBear" className="w-5 h-5 rounded" />
              <span className="text-sm text-[var(--landing-text-muted)]">
                MetaBear
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/berkinory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-text-dim)] hover:text-[var(--landing-text-muted)] transition-colors duration-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/berkinory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-text-dim)] hover:text-[var(--landing-text-muted)] transition-colors duration-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
