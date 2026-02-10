import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PdfTranslateSection from "./components/PdfTranslateSection";
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PdfTranslateSection />
      </main>
    </>
  );
}
