import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import CraftSection from "@/components/site/CraftSection";
import SectionHead from "@/components/site/SectionHead";
import ProductRow from "@/components/site/ProductRow";
import FinderSection from "@/components/site/FinderSection";
import QuoteBand from "@/components/site/QuoteBand";
import Footer from "@/components/site/Footer";
import { RACKETS } from "@/lib/rackets";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CraftSection />

        <section className="pt-8 pb-20 lg:pt-12 lg:pb-[104px]">
          <SectionHead
            id="characters"
            lines={[
              "Three",
              <span key="c" className="text-green">
                Characters.
              </span>,
            ]}
            ctaLabel="View all"
            ctaHref="#finder"
          />

          <div className="mt-14 flex flex-col gap-20 lg:mt-[52px] lg:gap-[80px]">
            {RACKETS.map((racket, i) => (
              <ProductRow
                key={racket.id}
                racket={racket}
                index={i}
                imageSide={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </section>

        <FinderSection />
        <QuoteBand />
      </main>
      <Footer />
    </>
  );
}
