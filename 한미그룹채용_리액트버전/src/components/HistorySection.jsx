import { useEffect, useRef, useState } from "react";

export default function HistorySection() {
  const [collapsed, setCollapsed] = useState(true);
  const bodyRef = useRef(null);
  const flowRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    const flow = flowRef.current;
    if (!body || !flow) return undefined;
    const COLLAPSE_RATIO = 0.8 / 3;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function fullHeight() {
      return flow.offsetHeight;
    }
    function collapsedHeight() {
      return Math.round(fullHeight() * COLLAPSE_RATIO);
    }
    function refit() {
      if (collapsed) {
        body.style.transition = "none";
        body.style.maxHeight = `${collapsedHeight()}px`;
        body.offsetHeight;
        body.style.transition = "";
      }
    }

    if (collapsed) {
      body.style.transition = "none";
      body.style.maxHeight = `${collapsedHeight()}px`;
      body.offsetHeight;
      body.style.transition = "";
    } else {
      body.style.maxHeight = `${fullHeight()}px`;
      function done(event) {
        if (event && event.propertyName !== "max-height") return;
        body.removeEventListener("transitionend", done);
        if (!collapsed) body.style.maxHeight = "none";
      }
      if (reduce.matches) done();
      else body.addEventListener("transitionend", done);
    }

    const observer = window.ResizeObserver ? new ResizeObserver(refit) : null;
    observer?.observe(flow);
    return () => observer?.disconnect();
  }, [collapsed]);

  function toggleHistory() {
    const section = sectionRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!collapsed && section?.getBoundingClientRect().top < 0) {
      section.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start",
      });
    }
    setCollapsed((value) => !value);
  }

  return (
    <section
        className={collapsed ? "history is-collapsed" : "history is-expanded"}
        id="history"
        aria-labelledby="history-title"
        ref={sectionRef}
      >
        <div className="history-body" id="history-body" ref={bodyRef}>
          <div className="history-flow" ref={flowRef}>
            <header className="history-head">
              <h2 className="history-title" id="history-title">
                한미의 도전은 작은 가능성에서<br />시작되었습니다.
              </h2>
              <p className="history-count" role="img" aria-label="한미 창립 53주년">
                <span className="history-count-num">53</span
                ><span className="history-count-unit">th</span>
              </p>
              <img
                className="history-deco history-deco--star"
                src="/images/obj_star_big.png"
                alt="반짝이는 노란 별 세 개" />
            </header>

            <div className="history-timeline">
              {/* 1973~2001 */}
              <div className="history-block history-block--text-left">
                <h3 className="history-period">1973~2001</h3>
                <p className="history-lead">한계를 하나씩 넘을 때마다,</p>
                <ul className="history-list">
                  <li>
                    <span className="history-year">1973</span
                    ><span className="history-text">한미약품공업주식회사 설립</span>
                  </li>
                  <li>
                    <span className="history-year">1984</span
                    ><span className="history-text">팔탄 GMP 공장 신축</span>
                  </li>
                  <li>
                    <span className="history-year">1989</span
                    ><span className="history-text"
                      >세프트리악손 제조방법 Roche사 기술 수출</span
                    >
                  </li>
                  <li>
                    <span className="history-year">1997</span
                    ><span className="history-text"
                      >마이크로에멀전 제제기술 Novartis사 기술 수출</span
                    >
                  </li>
                </ul>
                <figure className="history-figure history-figure--1">
                  <img
                    src="/images/his1.png"
                    alt="한미약품 초기 대표 제품 텐텐 어린이 영양제와 쎄쎄 비타민C 캐러멜" />
                </figure>
                <img
                  className="history-deco history-deco--beaker updown"
                  src="/images/obj_beaker.png"
                  alt="분홍색 액체가 담긴 실험용 비커" />
              </div>

              {/* 2002~2010 */}
              <div className="history-block history-block--text-right">
                <h3 className="history-period">2002~2010</h3>
                <ul className="history-list">
                  <li>
                    <span className="history-year">2004</span
                    ><span className="history-text"
                      >국내 최초 고혈압치료제 ‘아모디핀’ 미국특허 획득</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2006</span
                    ><span className="history-text"
                      >세계 최초 유소아 해열 시럽제 개량신약 ‘맥시부펜’ 개발
                      성공</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2008</span
                    ><span className="history-text"
                      >국내 최초 주사용항생제 세프트리악손 美 FDA 승인</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2009</span
                    ><span className="history-text"
                      >세계최초 암로디핀+로살탄 복합제 ‘아모잘탄’ 발매</span
                    >
                  </li>
                </ul>
                <figure className="history-figure history-figure--2">
                  <img
                    src="/images/his2.png"
                    alt="석양을 배경으로 손을 잡고 함께 뛰어오르는 다섯 사람의 실루엣" />
                </figure>
                <img
                  className="history-deco history-deco--mol-blur1"
                  src="/images/obj_mol_blur1.png"
                  alt="흐릿하게 번진 푸른 분자 구조" />
                <img
                  className="history-deco history-deco--microscope updown"
                  src="/images/obj_microscope.png"
                  alt="파란색 현미경" />
              </div>

              {/* 2011~2015 */}
              <div className="history-block history-block--text-left">
                <h3 className="history-period">2011~2015</h3>
                <p className="history-lead">새로운 가능성이 현실이 되었어요.</p>
                <ul className="history-list">
                  <li>
                    <span className="history-year">2011</span
                    ><span className="history-text"
                      >MSD와 ‘아모잘탄’ 50여개국 수출 계약 체결</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2012</span
                    ><span className="history-text"
                      >‘LAPS-GCSF’ 美 스펙트럼사와 공동개발 및 상업화 계약</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2013</span
                    ><span className="history-text"
                      >국내 개량신약 최초 미국 FDA 승인 및 미국 출시
                      ‘에소메졸’</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2014</span
                    ><span className="history-text"
                      >‘트리악손’ 국내 최초 유럽 4개국 시판 허가</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2015</span
                    ><span className="history-text"
                      >한국 사상 최대규모 릴레이 기술수출</span
                    >
                  </li>
                </ul>
                <figure className="history-figure history-figure--3">
                  <img
                    src="/images/his3.png"
                    alt="스펙트럼 파마슈티컬스 로고와 인체 모형, 에소메졸 제품 용기" />
                </figure>
              </div>

              {/* 2016~2020 */}
              <div className="history-block history-block--text-right">
                <h3 className="history-period">2016~2020</h3>
                <ul className="history-list">
                  <li>
                    <span className="history-year">2016</span
                    ><span className="history-text"
                      >차세대 RAF 저해제, Roche 제넨텍 기술수출</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2017</span
                    ><span className="history-text"
                      >‘에소메졸’ 국내 제약회사 최초 미국약전(USP) 등재</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2018</span
                    ><span className="history-text"
                      >‘Glucagon Analog’, ‘오락솔’ 차세대 AML 치료제 美
                      희귀의약품 지정</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2019</span
                    ><span className="history-text"
                      >최근 10년간 처방실적 최다 4조 4,176억원</span
                    >
                  </li>
                </ul>
                <figure className="history-figure history-figure--4">
                  <img
                    src="/images/his4.png"
                    alt="미국임상종양학회 ASCO와 미국약전 USP 로고, 로수젯 제품 패키지" />
                </figure>
                <img
                  className="history-deco history-deco--mol-blur2"
                  src="/images/obj_mol_blur2.png"
                  alt="흐릿하게 번진 분홍빛 분자 구조" />
              </div>

              {/* 2021~2026 */}
              <div className="history-block history-block--text-left">
                <h3 className="history-period">2021~2026</h3>
                <p className="history-lead">
                  하지만 아직, 가야 할 길이 더 남아 있습니다.
                </p>
                <ul className="history-list">
                  <li>
                    <span className="history-year">2021</span
                    ><span className="history-text"
                      >‘로수젯’, 국내사 개발 처방의약품 매출 1위 달성</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2022</span
                    ><span className="history-text"
                      >‘롤론티스’ 한국 최초 FDA 허가 받은 바이오신약 등재<br />‘로수젯
                      RACING 연구’ 세계 최고 권위 의학저널 ‘LANCET’ 등재</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2023</span
                    ><span className="history-text"
                      >비만 프로젝트 ‘H.O.P’ 프로젝트 가동</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2024</span
                    ><span className="history-text"
                      >근손실 한계 뛰어넘은 신개념 비만 신약 ‘HM17321’
                      발표</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2025</span
                    ><span className="history-text"
                      >‘로수젯’ 한국 전문의약품 시장 1위 품목 등록<br />한미약품
                      8년 연속 원외처방 1위<br />미국암연구학회(AACR)서 국내
                      최다 11개 연구 성과 발표<br />한미사이언스 약국화장품
                      ‘EGF크림’ 27만개 완판</span
                    >
                  </li>
                  <li>
                    <span className="history-year">2026</span
                    ><span className="history-text"
                      >희귀질환치료제 ‘LAPS-GLP2’ 릴리 기술수출<br />한미
                      ‘완전두유·케어미’ 국제 우수 미각상 수상</span
                    >
                  </li>
                </ul>
                <figure className="history-figure history-figure--5">
                  <img
                    src="/images/his5.png"
                    alt="THE LANCET 창간 200주년 표지와 롤론티스 작용 원리, 롤론티스 제품 패키지" />
                </figure>
                <img
                  className="history-deco history-deco--mol-big updown"
                  src="/images/obj_mol_big.png"
                  alt="유리 질감의 큰 분자 구조 모형" />
              </div>
            </div>

            <footer className="history-end">
              <p
                className="history-count history-count--end"
                role="img"
                aria-label="한미 창립 100주년"
              >
                <span className="history-count-num">100</span
                ><span className="history-count-unit">th</span>
              </p>
              <div className="history-end-copy">
                <p className="history-end-sub">
                  한계를 넘을 때마다, 건강한 미래는 가까워졌습니다. 한계를 넘는
                  일, 우리에게는 꽤 익숙하니까.
                </p>
                <p className="history-end-main">
                  수많은 도전이 오늘의 한미를 만들었습니다.<br />이제 또 다른
                  가능성을 향해 당신과 함께 나아갑니다.
                </p>
              </div>
              <img
                className="history-deco history-deco--cloud leftright"
                src="/images/cloud_blur_medium.png"
                alt="캐릭터 아래에 깔린 흐릿한 구름 그림자" />
              <img
                className="history-deco history-deco--char leftright"
                src="/images/con2_char.png"
                alt="사원증을 목에 걸고 달려가는 파란색 알약 캐릭터" />
            </footer>
          </div>
        </div>

        <div className="history-foot">
          <button
            className="history-toggle"
            type="button"
            aria-expanded={!collapsed}
            aria-controls="history-body"
            onClick={toggleHistory}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 11l7-7 7 7M5 19l7-7 7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="history-toggle-label">{collapsed ? "펼치기" : "접기"}</span>
          </button>
        </div>
      </section>
  );
}
