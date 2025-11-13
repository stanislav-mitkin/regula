import { HeroSection } from '../components/sections/HeroSection';
import { PenaltiesTable } from '../components/sections/PenaltiesTable';
import { HowItWorks } from '../components/sections/HowItWorks';
import { PricingCards } from '../components/sections/PricingCards';
import { SecondaryCTA } from '../components/sections/SecondaryCTA';
import { Footer } from '../components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PenaltiesTable />
      <HowItWorks />
      <PricingCards />
      <SecondaryCTA />
      <Footer />
    </main>
  );
}