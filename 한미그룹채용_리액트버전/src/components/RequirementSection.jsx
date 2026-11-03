import { useEffect, useRef, useState } from "react";

const SALES_STEPS = [
  ["ico_step_apply.png", "지원접수", "9.28~10.18"],
  ["ico_step_doc.png", "서류전형", "10.19~10.20"],
  ["ico_step_ai.png", "AI역량검사", "10.21~10.25"],
  ["ico_step_interview1.png", "1차면접", "11월 중"],
  ["ico_step_field.png", "현장체험", "12월 초"],
  ["ico_step_interview2.png", "2차면접", "12월 중"],
  ["ico_step_edu.png", "교육전형", "27.1.4~"],
];

const OTHER_STEPS = [
  ["ico_step_apply.png", "지원접수", "9.28~10.18"],
  ["ico_step_doc.png", "서류전형", "10.19~10.20"],
  ["ico_step_ai.png", "AI역량검사", "10.21~10.25"],
  ["ico_step_interview1.png", "1차면접", "11월 중"],
  ["ico_step_interview2.png", "2차면접", "12월 중"],
  ["ico_step_join.png", "입사", "27.1.4\n(경력직 협의 가능)"],
];

function Steps({ items }) {
  return (
    <div className="requirement__steps">
      {items.map(([icon, title, date], index) => (
        <div key={title} style={{ display: "contents" }}>
          {index > 0 ? (
            <span className="requirement__step-arrow" aria-hidden="true">
              ›
            </span>
          ) : null}
          <div className="requirement__step">
            <img
              className="requirement__step-icon"
              src={`./images/${icon}`}
              alt=""
            />
            <h4 className="requirement__step-title">{title}</h4>
            <p className="requirement__step-date">
              {date.split("\n").map((line, lineIndex) => (
                <span key={line}>
                  {lineIndex > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RequirementSection() {
  const [tab, setTab] = useState("qualification");
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    function fitProcessTrack() {
      const processViewport = viewportRef.current;
      const processTrack = trackRef.current;
      if (!processViewport || !processTrack) return;
      if (window.innerWidth <= 1024) {
        processTrack.style.removeProperty("--requirement-process-scale");
        processViewport.style.height = "auto";
        return;
      }
      const scale = Math.min(1, processViewport.clientWidth / 1128);
      processTrack.style.setProperty("--requirement-process-scale", String(scale));
      processViewport.style.height = `${processTrack.offsetHeight * scale}px`;
    }
    if (tab === "process") fitProcessTrack();
    window.addEventListener("resize", fitProcessTrack);
    return () => window.removeEventListener("resize", fitProcessTrack);
  }, [tab]);

  function onTabKey(event, current) {
    const order = ["qualification", "process"];
    const index = order.indexOf(current);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % order.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + order.length) % order.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = order.length - 1;
    else return;
    event.preventDefault();
    setTab(order[nextIndex]);
    document.getElementById(`requirement-tab-${order[nextIndex]}`)?.focus();
  }

  return (
    <section className="requirement" id="requirement" aria-labelledby="requirement-title">
      <div className="requirement__inner">
        <h2 className="requirement__title" id="requirement-title">
          한미그룹과 함께하는 문은
          <br />
          활짝 열려 있습니다
        </h2>
        <img className="requirement__bulb" src="./images/require_bulb.png" alt="" />
        <div className="requirement__tabs" role="tablist" aria-label="지원 안내">
          <button
            className="requirement__tab"
            id="requirement-tab-qualification"
            type="button"
            role="tab"
            aria-selected={tab === "qualification"}
            aria-controls="requirement-panel-qualification"
            tabIndex={tab === "qualification" ? 0 : -1}
            onClick={() => setTab("qualification")}
            onKeyDown={(event) => onTabKey(event, "qualification")}
          >
            지원자격
          </button>
          <button
            className="requirement__tab"
            id="requirement-tab-process"
            type="button"
            role="tab"
            aria-selected={tab === "process"}
            aria-controls="requirement-panel-process"
            tabIndex={tab === "process" ? 0 : -1}
            onClick={() => setTab("process")}
            onKeyDown={(event) => onTabKey(event, "process")}
          >
            전형절차 및 접수방법
          </button>
        </div>
        <div
          className="requirement__panel"
          id="requirement-panel-qualification"
          role="tabpanel"
          aria-labelledby="requirement-tab-qualification"
          hidden={tab !== "qualification"}
        >
          <div className="requirement__candidates">
            <article className="requirement__candidate">
              <img
                className="requirement__candidate-icon"
                src="./images/require_ico_calendar_3d.png"
                alt=""
              />
              <h3 className="requirement__candidate-title">27년 1월 입사가 가능한 자</h3>
            </article>
            <article className="requirement__candidate">
              <img
                className="requirement__candidate-icon"
                src="./images/require_ico_gradcap_3d.png"
                alt=""
              />
              <h3 className="requirement__candidate-title">
                기졸업자 또는 27년 2월 졸업 예정자
              </h3>
            </article>
          </div>
          <ul className="requirement__bullets">
            <li>남성의 경우 병역을 마쳤거나 면제인 분</li>
            <li>해외여행 (또는 해외 출장)에 결격사유가 없는 분</li>
            <li>취업보호대상자는 관련 법령에 의거하여 우대</li>
          </ul>
          <p className="requirement__notice">
            모집 직무별로 지원자격이 상이하오니 반드시
            <strong>채용 공고</strong>를 확인해 주시기 바랍니다.
          </p>
        </div>
        <div
          className="requirement__panel"
          id="requirement-panel-process"
          role="tabpanel"
          aria-labelledby="requirement-tab-process"
          hidden={tab !== "process"}
        >
          <div className="requirement__process-viewport" ref={viewportRef}>
            <div className="requirement__process-track" ref={trackRef}>
              <section className="requirement__process-group">
                <h3 className="requirement__process-title">영업직군</h3>
                <Steps items={SALES_STEPS} />
              </section>
              <section className="requirement__process-group">
                <h3 className="requirement__process-title">영업 외 전직군</h3>
                <Steps items={OTHER_STEPS} />
              </section>
            </div>
          </div>
          <ul className="requirement__process-notes">
            <li>
              상기 일정은 상황에 따라 변경될 수 있으며 각 전형별 상세 일정은
              대상자에 한해 개별 안내 예정입니다
            </li>
            <li>
              입사지원서에 허위 기재가 있거나 제출서류가 허위로 판명되는 경우,
              또는 입사 이후 자격 미확보 및 상실하는 경우는 입사가 취소될 수
              있습니다.
            </li>
            <li>지원서 제출 후에는 수정이 절대 불가하오니, 주의하시기 바랍니다.</li>
            <li>
              전형단계별 결과는 E-Mail 및 SMS를 통하여 안내하오니 E-Mail 주소
              및 휴대전화 번호를 정확히 기재해주시기 바랍니다.
            </li>
            <li>
              입사 후 3개월간 수습기간이 적용되며, 수습 기간 중 성적이
              불량하거나 직무 수행 능력이 부족하다고 판단되는 경우 입사가
              취소될 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
