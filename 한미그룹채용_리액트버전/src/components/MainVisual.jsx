export default function MainVisual() {
  function scrollDown() {
    const mv = document.getElementById("main_visual");
    if (!mv) return;
    window.scrollTo({ top: mv.offsetHeight, behavior: "smooth" });
  }

  return (
    <section className="mv" id="main_visual" aria-labelledby="mv-title">
      <div className="mv__inner">
        <div className="mv__text">
          <header className="mv__info">
            <p className="mv__season">2026년 하반기</p>
            <h1 className="mv__title" id="mv-title">
              <span className="mv__title-em">한미그룹</span>
              <span className="mv__title-sub">공개채용</span>
            </h1>
            <p className="mv__period">
              모집기간 : <time dateTime="2026-09-28">2026.9.28(월)</time> ~{" "}
              <time dateTime="2026-10-18T23:59">2026.10.18(일) 23:59</time>
              까지
            </p>
          </header>
          <a className="btn btn--lg" href="#jobs">
            모집직무 바로가기!
          </a>
        </div>
        <div className="mv__visual" aria-hidden="true">
          <div className="mv__glow bigsmall" />
          <div className="mv__ring" />
          <img className="mv__micro updown" src="./images/mv_micro.png" alt="" />
          <img className="mv__char1 updown" src="./images/mv_char1.png" alt="" />
          <img className="mv__char2 updown" src="./images/mv_char2.png" alt="" />
          <img className="mv__char3 updown" src="./images/mv_char3.png" alt="" />
          <img className="mv__char4 updown" src="./images/mv_char4.png" alt="" />
          <span className="star star--1 updown" />
          <span className="star star--2 updown" />
          <span className="star star--3 updown" />
          <span className="star star--3b updown" />
          <span className="star star--4 updown" />
        </div>
        <button
          type="button"
          className="scroll-btn updown"
          id="scrollBtn"
          aria-label="아래로 스크롤"
          onClick={scrollDown}
        >
          <span className="chevron-down" />
        </button>
      </div>
    </section>
  );
}
