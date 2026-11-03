import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-10-18T23:59:00+09:00").getTime();

function pad(value) {
  return String(value).padStart(2, "0");
}

function remainingTime() {
  const remaining = DEADLINE - Date.now();
  if (remaining <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: pad(Math.floor(totalSeconds / 86400)),
    hours: pad(Math.floor((totalSeconds % 86400) / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
  };
}

export default function ApplyCtaSection() {
  const [time, setTime] = useState(remainingTime);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = remainingTime();
      setTime(next);
      if (Object.values(next).every((value) => value === "00")) {
        window.clearInterval(interval);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="con9" aria-labelledby="con9-heading" id="apply">
      <div className="con9__inner">
        <h2 className="con9__heading" id="con9-heading">
          당신에게 딱 맞는 자리를 찾으러 출발!
        </h2>
        <div
          className="con9__countdown"
          id="con9-countdown"
          role="timer"
          aria-label="지원 마감까지 남은 시간"
        >
          <span className="con9__unit">
            <span className="con9__number">{time.days}</span>
            <span className="con9__label">일</span>
          </span>
          <span className="con9__unit">
            <span className="con9__number">{time.hours}</span>
            <span className="con9__label">시간</span>
          </span>
          <span className="con9__unit">
            <span className="con9__number">{time.minutes}</span>
            <span className="con9__label">분</span>
          </span>
          <span className="con9__unit">
            <span className="con9__number">{time.seconds}</span>
            <span className="con9__label">초</span>
          </span>
          <span className="con9__remaining">남았어요</span>
        </div>
      </div>
      <p className="con9__hint" id="con9-status">
        <span aria-hidden="true">·</span>
        아이콘을 클릭해서 지원해주세요!
      </p>
      <a className="con9__apply" href="#requirement" aria-label="지원하기">
        지원하기
        <span aria-hidden="true">→</span>
      </a>
      <img className="con9__earth" src="./images/con9_earth.png" alt="" loading="lazy" />
      <img
        className="con9__cloud con9__cloud--left"
        src="./images/con9_cloud_l.png"
        alt=""
        loading="lazy"
      />
      <img
        className="con9__cloud con9__cloud--right"
        src="./images/con9_cloud_r.png"
        alt=""
        loading="lazy"
      />
    </section>
  );
}
