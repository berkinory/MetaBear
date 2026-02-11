import type { FC } from "react";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ChromeIcon,
  DashboardSpeed02Icon,
  Download04Icon,
  FlashIcon,
  GithubIcon,
  Heading01Icon,
  Image02Icon,
  LinkSquare02Icon,
  Menu03Icon,
  MessageMultiple02Icon,
  NewTwitterIcon,
  Notification02Icon,
  PuzzleIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FeatureCard: FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description }) => {
  return (
    <div className="group relative p-6 rounded-2xl transition-all duration-500 hover:bg-[var(--landing-surface-hover)]">
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

const WebContent: FC = () => (
  <div className="h-full overflow-hidden bg-[#f8f9fa] text-gray-900 p-8">
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="h-8 bg-gray-300/60 rounded w-3/4 animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300/60 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-300/60 rounded w-32 animate-pulse" />
            <div className="h-2 bg-gray-300/60 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="w-full h-48 bg-gradient-to-br from-gray-300/60 to-gray-400/60 rounded-lg animate-pulse" />

      <div className="space-y-3">
        <div className="h-3 bg-gray-300/60 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-300/60 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-300/60 rounded w-5/6 animate-pulse" />
        <div className="h-3 bg-gray-300/60 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-300/60 rounded w-4/5 animate-pulse" />
      </div>

      <div className="h-6 bg-gray-300/60 rounded w-2/3 animate-pulse mt-8" />

      <div className="space-y-3">
        <div className="h-3 bg-gray-300/60 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-300/60 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-300/60 rounded w-3/4 animate-pulse" />
      </div>
    </div>
  </div>
);

const BrowserBar: FC = () => (
  <div className="flex items-center gap-3 px-4 py-3 bg-[#141416] rounded-t-2xl border-b border-white/[0.04]">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
    </div>
    <div className="bg-white/[0.06] rounded-lg px-4 py-1.5 text-xs text-[var(--landing-text-muted)] font-mono flex items-center gap-2 flex-1 ml-8 mr-3">
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        strokeWidth={2}
        className="w-3 h-3 opacity-40 hidden sm:block"
      />
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        strokeWidth={2}
        className="w-3 h-3 opacity-20 hidden sm:block"
      />
      <span className="sm:ml-2 opacity-60 truncate">localhost:4001</span>
    </div>
    <img src="/logo.png" alt="MetaBear" className="w-5 h-5 rounded flex-none" />
    <HugeiconsIcon
      icon={PuzzleIcon}
      strokeWidth={2}
      className="w-4 h-4 text-[var(--landing-text-muted)] flex-none"
    />
    <div className="w-px h-4 bg-white/[0.08] flex-none hidden sm:block" />
    <HugeiconsIcon
      icon={Menu03Icon}
      strokeWidth={2}
      className="w-4 h-4 text-[var(--landing-text-muted)] flex-none hidden sm:block"
    />
  </div>
);

const icons = {
  audit: (
    <HugeiconsIcon
      icon={DashboardSpeed02Icon}
      strokeWidth={1.5}
      className="w-6 h-6"
    />
  ),
  meta: (
    <HugeiconsIcon
      icon={MessageMultiple02Icon}
      strokeWidth={1.5}
      className="w-6 h-6"
    />
  ),
  headings: (
    <HugeiconsIcon icon={Heading01Icon} strokeWidth={1.5} className="w-6 h-6" />
  ),
  images: (
    <HugeiconsIcon icon={Image02Icon} strokeWidth={1.5} className="w-6 h-6" />
  ),
  links: (
    <HugeiconsIcon
      icon={LinkSquare02Icon}
      strokeWidth={1.5}
      className="w-6 h-6"
    />
  ),
  social: (
    <HugeiconsIcon
      icon={Notification02Icon}
      strokeWidth={1.5}
      className="w-6 h-6"
    />
  ),
  accessibility: (
    <HugeiconsIcon
      icon={UserMultiple02Icon}
      strokeWidth={1.5}
      className="w-6 h-6"
    />
  ),
  export: (
    <HugeiconsIcon
      icon={Download04Icon}
      strokeWidth={1.5}
      className="w-6 h-6"
    />
  ),
  flash: (
    <HugeiconsIcon icon={FlashIcon} strokeWidth={1.5} className="w-6 h-6" />
  ),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--landing-surface)] text-[var(--landing-text)] overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--landing-accent-glow)_0%,_transparent_70%)] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(232,164,74,0.04)_0%,_transparent_70%)]" />
      </div>

      <header className="relative z-40 landing-stagger-1">
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
                href="/blog"
                className="text-[var(--landing-text-muted)] hover:text-[var(--landing-text)] text-sm font-medium transition-colors duration-200"
              >
                Blog
              </a>
              <a
                href="https://chrome.google.com/webstore/detail/jklebfmomoajnoocichmchpdbkcbibac"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[var(--landing-accent)] text-[#1a1a1e] text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-[var(--landing-accent)]/20"
              >
                <HugeiconsIcon
                  icon={ChromeIcon}
                  strokeWidth={2}
                  className="w-4 h-4"
                />
                <span className="hidden sm:inline">Add to Chrome</span>
                <span className="sm:hidden">Install</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="w-3.5 h-3.5 transition-all duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </nav>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--landing-border)] to-transparent" />
      </header>

      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 px-6 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="landing-stagger-2 mb-8">
            <a
              href="https://github.com/berkinory/MetaBear"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)] text-xs font-medium text-[var(--landing-text-muted)] hover:border-[var(--landing-accent)]/30 hover:bg-[var(--landing-surface-elevated)]/80 transition-all duration-200"
            >
              <HugeiconsIcon
                icon={GithubIcon}
                strokeWidth={2}
                className="w-3.5 h-3.5"
              />
              Free & Open Source
            </a>
          </div>

          <h1 className="landing-stagger-3 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-6 sm:mb-8">
            <span className="block">See What Search Engines</span>
            <span className="block">
              <span className="relative inline-block">
                <span className="relative z-10">Really</span>
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
              See
            </span>
          </h1>

          <p className="landing-stagger-4 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-[var(--landing-text-muted)] leading-relaxed mb-10 sm:mb-14">
            Free Chrome extension for instant SEO audits and accessibility
            testing. Analyze meta tags, Open Graph, heading structure, and WCAG
            compliance in one click. No sign-up, no tracking, 100% private.
          </p>

          <div className="landing-stagger-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://chrome.google.com/webstore/detail/jklebfmomoajnoocichmchpdbkcbibac"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--landing-accent)] text-[#1a1a1e] font-semibold text-base transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-[var(--landing-accent)]/25 hover:-translate-y-0.5"
              style={{
                animation: "landing-pulse-glow 4s ease-in-out infinite",
              }}
            >
              <HugeiconsIcon
                icon={ChromeIcon}
                strokeWidth={2}
                className="w-5 h-5"
              />
              Add to Chrome - It's Free
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-[var(--landing-text-muted)] font-medium text-base transition-all duration-300 hover:text-[var(--landing-text)] hover:bg-white/[0.04]"
            >
              See features
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="landing-stagger-6 mx-auto max-w-5xl">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/50">
              <BrowserBar />
              <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden">
                <WebContent />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-8">
                  <img
                    src="/showcase.webp"
                    alt="MetaBear Extension Panel"
                    className="h-[36vh] sm:h-[calc(100vh*0.6)] w-auto object-contain rounded-lg sm:rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--landing-accent)]/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--landing-accent)]/3 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <section
        className="relative px-6 sm:px-8 pb-24 sm:pb-32"
        aria-label="Key Statistics"
      >
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 py-8 px-6 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)]/50 backdrop-blur-sm">
            {[
              {
                value: 12,
                suffix: "",
                label: "SEO Checks",
                description: "Essential SEO validations",
              },
              {
                value: 16,
                suffix: "",
                label: "Accessibility Checks",
                description: "WCAG compliance tests",
              },
              {
                value: 1,
                suffix: "-Click",
                label: "Instant Audit",
                description: "Complete website analysis",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl sm:text-3xl font-bold text-[var(--landing-accent)] tracking-tight"
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
                >
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-xs sm:text-sm text-[var(--landing-text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative px-6 sm:px-8 pb-24 sm:pb-32"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16 sm:mb-20">
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            >
              Complete SEO & Accessibility Tools
            </h2>
            <p className="max-w-xl mx-auto text-[var(--landing-text-muted)] text-base sm:text-lg">
              Six powerful panels for comprehensive website auditing. Test SEO,
              accessibility, meta tags, and social media previews instantly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <FeatureCard
              icon={icons.audit}
              title="SEO Score & Audit"
              description="Get instant SEO score from 0-100 with categorized issues by severity. Identify title tags, meta descriptions, canonical URLs, and technical SEO problems instantly."
              delay={0}
            />
            <FeatureCard
              icon={icons.meta}
              title="Meta Tags & Open Graph"
              description="Inspect HTML meta tags including title, description, canonical URL, robots directives, Open Graph tags, and Twitter Cards with character count validation."
              delay={80}
            />
            <FeatureCard
              icon={icons.headings}
              title="Heading Structure Checker"
              description="Visualize H1-H6 heading hierarchy for SEO optimization. Detect skipped heading levels and validate semantic HTML structure for better search rankings."
              delay={160}
            />
            <FeatureCard
              icon={icons.images}
              title="Image SEO Analyzer"
              description="Find missing alt text, broken images, and large file sizes. Optimize images for search engines with detailed analysis of every image on your page."
              delay={240}
            />
            <FeatureCard
              icon={icons.links}
              title="Link Analysis Tool"
              description="Audit internal links, external links, nofollow attributes, and broken links. Analyze your link profile and detect redirect chains for better SEO."
              delay={320}
            />
            <FeatureCard
              icon={icons.social}
              title="Social Media Preview"
              description="Preview how your page appears on Google Search, Facebook, and Twitter. Test Open Graph images, Twitter Card meta tags, and social sharing optimization."
              delay={400}
            />
            <FeatureCard
              icon={icons.accessibility}
              title="WCAG Accessibility Testing"
              description="Powered by axe-core for WCAG 2.1 compliance testing. Check color contrast, ARIA attributes, form labels, keyboard navigation, and screen reader compatibility."
              delay={480}
            />
            <FeatureCard
              icon={icons.export}
              title="Export Audit Results"
              description="Export complete SEO audit data as JSON for reporting. Copy issues as AI prompts for ChatGPT, Claude, or other LLMs to get instant fix recommendations."
              delay={560}
            />
            <FeatureCard
              icon={icons.flash}
              title="Instant Browser Testing"
              description="100% client-side processing with zero external API calls. Fast, private SEO and accessibility testing directly in your Chrome browser without data collection."
              delay={640}
            />
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How to Use MetaBear SEO Extension
            </h2>
            <p className="text-[var(--landing-text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
              Start auditing your website's SEO and accessibility in three
              simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Install Chrome Extension",
                desc: "Add MetaBear SEO checker to Chrome from the Web Store. One-click installation with zero configuration required.",
              },
              {
                step: "02",
                title: "Click to Audit",
                desc: "Navigate to any webpage and click the MetaBear extension icon in your browser toolbar to start the SEO audit.",
              },
              {
                step: "03",
                title: "Fix SEO Issues",
                desc: "Review audit results, export issues as JSON or AI prompts, and fix them. Watch your SEO score improve instantly.",
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
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={1.5}
                      className="w-6 h-6"
                    />
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
                Start Your Free SEO Audit Today
              </h2>
              <p className="text-[var(--landing-text-muted)] text-base sm:text-lg mb-8 max-w-md mx-auto">
                Free, open source Chrome extension built for developers and SEO
                professionals
              </p>
              <a
                href="https://chrome.google.com/webstore/detail/jklebfmomoajnoocichmchpdbkcbibac"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--landing-accent)] text-[#1a1a1e] font-semibold text-base transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-[var(--landing-accent)]/25 hover:-translate-y-0.5"
              >
                <HugeiconsIcon
                  icon={ChromeIcon}
                  strokeWidth={2}
                  className="w-5 h-5"
                />
                Add to Chrome
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--landing-text-muted)] text-base sm:text-lg">
              Everything you need to know about MetaBear
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-[var(--landing-border)] rounded-xl px-6 bg-[var(--landing-surface-elevated)]/30"
            >
              <AccordionTrigger className="text-[var(--landing-text)] hover:no-underline py-4">
                What is MetaBear?
              </AccordionTrigger>
              <AccordionContent className="text-[var(--landing-text-muted)]">
                MetaBear is a free Chrome extension that helps you audit and
                optimize your website's SEO and accessibility. It provides
                instant analysis of meta tags, heading structure, images, links,
                social previews, and accessibility issues, all in one click.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-[var(--landing-border)] rounded-xl px-6 bg-[var(--landing-surface-elevated)]/30"
            >
              <AccordionTrigger className="text-[var(--landing-text)] hover:no-underline py-4">
                Is MetaBear really free?
              </AccordionTrigger>
              <AccordionContent className="text-[var(--landing-text-muted)]">
                Yes! MetaBear is 100% free and open source. There are no hidden
                fees, premium tiers, or subscriptions. You get full access to
                all features forever.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-[var(--landing-border)] rounded-xl px-6 bg-[var(--landing-surface-elevated)]/30"
            >
              <AccordionTrigger className="text-[var(--landing-text)] hover:no-underline py-4">
                How does MetaBear protect my privacy?
              </AccordionTrigger>
              <AccordionContent className="text-[var(--landing-text-muted)]">
                MetaBear runs entirely in your browser. All audits are performed
                locally. No data is sent to external servers. Your browsing data
                and audit results stay completely private.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-[var(--landing-border)] rounded-xl px-6 bg-[var(--landing-surface-elevated)]/30"
            >
              <AccordionTrigger className="text-[var(--landing-text)] hover:no-underline py-4">
                What accessibility checks does MetaBear perform?
              </AccordionTrigger>
              <AccordionContent className="text-[var(--landing-text-muted)]">
                MetaBear uses axe-core to check for WCAG violations including
                color contrast, ARIA attributes, form labels, and more. It also
                performs custom checks for missing alt text, broken images, and
                heading hierarchy issues.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-[var(--landing-border)] rounded-xl px-6 bg-[var(--landing-surface-elevated)]/30"
            >
              <AccordionTrigger className="text-[var(--landing-text)] hover:no-underline py-4">
                Can I export audit results?
              </AccordionTrigger>
              <AccordionContent className="text-[var(--landing-text-muted)]">
                Yes! You can export full audit results as JSON for further
                analysis or documentation. You can also copy individual issues
                as AI prompts to get instant fix suggestions from your favorite
                LLM.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border border-[var(--landing-border)] rounded-xl px-6 bg-[var(--landing-surface-elevated)]/30"
            >
              <AccordionTrigger className="text-[var(--landing-text)] hover:no-underline py-4">
                Does MetaBear work on any website?
              </AccordionTrigger>
              <AccordionContent className="text-[var(--landing-text-muted)]">
                Yes! MetaBear works on any website you visit. Simply navigate to
                a page and click the MetaBear icon in your toolbar to run an
                instant audit.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="relative px-6 sm:px-8 py-6 border-t border-[var(--landing-border)]">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MetaBear" className="w-7 h-7 rounded" />
              <span className="text-base font-medium text-[var(--landing-text)]">
                MetaBear
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/berkinory/MetaBear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-text-dim)] hover:text-[var(--landing-text-muted)] transition-colors duration-200"
              >
                <HugeiconsIcon
                  icon={GithubIcon}
                  strokeWidth={2}
                  className="w-[18px] h-[18px]"
                />
              </a>
              <a
                href="https://twitter.com/berkinory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--landing-text-dim)] hover:text-[var(--landing-text-muted)] transition-colors duration-200"
              >
                <HugeiconsIcon
                  icon={NewTwitterIcon}
                  strokeWidth={2}
                  className="w-[18px] h-[18px]"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
