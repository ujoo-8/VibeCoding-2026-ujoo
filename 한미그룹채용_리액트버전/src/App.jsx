import { useRef } from "react";
import ApplyCtaSection from "./components/ApplyCtaSection";
import ExpositionSection from "./components/ExpositionSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HistorySection from "./components/HistorySection";
import JobsSection from "./components/JobsSection";
import MainVisual from "./components/MainVisual";
import MiraeSection from "./components/MiraeSection";
import MoreLinksSection from "./components/MoreLinksSection";
import NewsSection from "./components/NewsSection";
import RequirementSection from "./components/RequirementSection";
import TasksSection from "./components/TasksSection";
import WelfareSection from "./components/WelfareSection";
import { useMvScale } from "./hooks/useMvScale";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  const toggleRef = useRef(null);
  useMvScale();
  useScrollReveal();
  useSmoothScroll(toggleRef);

  return (
    <>
      <input
        className="scroll-smoothing-toggle"
        id="scroll-smoothing-toggle"
        type="checkbox"
        aria-label="부드러운 스크롤 끄기"
        title="체크하면 부드러운 스크롤을 끕니다"
        ref={toggleRef}
      />
      <Header />
      <main>
        <MainVisual />
        <MiraeSection />
        <HistorySection />
        <JobsSection />
        <NewsSection />
        <WelfareSection />
        <TasksSection />
        <RequirementSection />
        <ExpositionSection />
        <MoreLinksSection />
        <ApplyCtaSection />
      </main>
      <Footer />
    </>
  );
}
