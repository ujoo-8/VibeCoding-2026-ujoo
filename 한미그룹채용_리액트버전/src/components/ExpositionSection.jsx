import { useEffect, useState } from "react";
import { buildCampusRegions } from "../lib/campusSchedule";

function Schedule({ days, emptyMessage, interactive, openEvent, onToggleEvent }) {
  if (!days) return null;
  if (!days.length) {
    return (
      <div className="exposition__schedule exposition__schedule--empty">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="exposition__day" aria-hidden="true">
            <h3 className="exposition__date" />
            <div className="exposition__events" />
          </div>
        ))}
        <p className="exposition__empty">
          {emptyMessage || "해당 지역의 캠퍼스 방문 일정은 추후 안내 예정입니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="exposition__schedule">
      {days.map((day, dayIndex) => (
        <div
          key={`${day.date}-${dayIndex}`}
          className="exposition__day"
          aria-hidden={day.date ? undefined : true}
        >
          <h3 className="exposition__date">{day.date}</h3>
          <div className="exposition__events">
            {day.events.map((eventData) => {
              const eventName = typeof eventData === "string" ? eventData : eventData.name;
              if (!interactive) {
                return (
                  <span key={eventName} className="exposition__event-label">
                    {eventName}
                  </span>
                );
              }
              const eventKey = `${day.date}-${eventName}`;
              const isOpen = openEvent === eventKey;
              return (
                <span key={eventKey} style={{ display: "contents" }}>
                  <div
                    className="exposition__venue-card"
                    hidden={!isOpen}
                    aria-label={`${eventName} 방문 장소 및 시간`}
                  >
                    {[
                      {
                        label: "⚑ 장소",
                        value:
                          typeof eventData === "object" && eventData.location
                            ? eventData.location
                            : "추후 안내",
                      },
                      {
                        label: "◷ 시간",
                        value:
                          typeof eventData === "object" && eventData.time
                            ? eventData.time
                            : "추후 안내",
                      },
                    ].map((item) => (
                      <div key={item.label} className="exposition__venue-item">
                        <span className="exposition__venue-label">{item.label}</span>
                        <span className="exposition__venue-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="exposition__event"
                    type="button"
                    aria-pressed={isOpen}
                    onClick={() => onToggleEvent(eventKey)}
                  >
                    {eventName}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExpositionSection() {
  const [tab, setTab] = useState("fair");
  const [fairDays, setFairDays] = useState([]);
  const [regions, setRegions] = useState([]);
  const [regionIndex, setRegionIndex] = useState(0);
  const [openEvent, setOpenEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("./data/exposition.json"),
      fetch("./data/campus_schedule.json"),
    ])
      .then(async ([fairResponse, campusResponse]) => {
        if (!fairResponse.ok || !campusResponse.ok) {
          throw new Error("일정 데이터 요청에 실패했습니다.");
        }
        const data = await fairResponse.json();
        const campusScheduleData = await campusResponse.json();
        setFairDays(data.exhibition);
        setRegions(buildCampusRegions(data, campusScheduleData));
      })
      .catch((loadError) => {
        console.error("박람회 및 캠퍼스 일정 로딩에 실패했습니다.", loadError);
        setError(
          "일정 데이터를 불러오지 못했습니다. data/exposition.json 및 data/campus_schedule.json 파일을 확인해 주세요.",
        );
      });
  }, []);

  useEffect(() => {
    function onDocumentClick(event) {
      if (!event.target?.closest?.(".exposition__venue-card, .exposition__event")) {
        setOpenEvent(null);
      }
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  const selectedRegion = regions[regionIndex];

  function onTabKey(event, current) {
    const order = ["fair", "campus"];
    const index = order.indexOf(current);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % order.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + order.length) % order.length;
    else return;
    event.preventDefault();
    setTab(order[nextIndex]);
    setOpenEvent(null);
    document.getElementById(`exposition-tab-${order[nextIndex]}`)?.focus();
  }

  return (
    <section className="exposition" id="exposition" aria-labelledby="exposition-title">
      <div className="exposition__inner">
        <header className="exposition__intro">
          <div className="obj">
            <img
              className="exposition__character updown"
              src="./images/expo_char.png"
              alt="학교 박람회를 찾아가는 보라색 한미 캐릭터"
            />
          </div>
          <div className="exposition__copy">
            <h2 className="exposition__heading" id="exposition-title">
              Hanmi 박람회/캠퍼스로 출발!
            </h2>
            <p className="exposition__description">
              한미그룹이 여러분을 만나러 박람회와 캠퍼스로 찾아갑니다.
              <br />
              우리가 어디서 만날지 궁금하다면 아래 지역에서 찾아보세요!
            </p>
            <p className="exposition__hint">
              학교명/장소를 클릭하거나 터치하면 세부장소를 확인할 수 있습니다.
            </p>
          </div>
        </header>
        <div className="exposition__tabs" role="tablist" aria-label="방문 일정 종류">
          <button
            className="exposition__tab"
            id="exposition-tab-fair"
            type="button"
            role="tab"
            aria-selected={tab === "fair"}
            aria-controls="exposition-panel-fair"
            tabIndex={tab === "fair" ? 0 : -1}
            onClick={() => {
              setTab("fair");
              setOpenEvent(null);
            }}
            onKeyDown={(event) => onTabKey(event, "fair")}
          >
            박람회
          </button>
          <button
            className="exposition__tab"
            id="exposition-tab-campus"
            type="button"
            role="tab"
            aria-selected={tab === "campus"}
            aria-controls="exposition-panel-campus"
            tabIndex={tab === "campus" ? 0 : -1}
            onClick={() => {
              setTab("campus");
              setOpenEvent(null);
            }}
            onKeyDown={(event) => onTabKey(event, "campus")}
          >
            캠퍼스
          </button>
        </div>
        <div
          className="exposition__panel"
          id="exposition-panel-fair"
          role="tabpanel"
          aria-labelledby="exposition-tab-fair"
          hidden={tab !== "fair"}
        >
          <div id="exposition-fair-schedule" aria-label="박람회 일정" aria-live="polite">
            <Schedule days={fairDays} interactive={false} />
          </div>
        </div>
        <div
          className="exposition__panel"
          id="exposition-panel-campus"
          role="tabpanel"
          aria-labelledby="exposition-tab-campus"
          hidden={tab !== "campus"}
        >
          <div
            className="exposition__regions"
            id="exposition-regions"
            role="group"
            aria-label="캠퍼스 방문 지역"
            hidden={tab !== "campus"}
          >
            {regions.map((region, index) => (
              <button
                key={region.name}
                className="exposition__region"
                type="button"
                aria-pressed={index === regionIndex}
                onClick={() => {
                  setRegionIndex(index);
                  setOpenEvent(null);
                }}
              >
                {region.name}
              </button>
            ))}
          </div>
          <div id="exposition-campus-schedule" aria-label="캠퍼스 방문 일정" aria-live="polite">
            {selectedRegion ? (
              <Schedule
                days={selectedRegion.schedule}
                emptyMessage={`${selectedRegion.name} 지역의 캠퍼스 방문 일정은 추후 안내 예정입니다.`}
                interactive
                openEvent={openEvent}
                onToggleEvent={(eventKey) =>
                  setOpenEvent((current) => (current === eventKey ? null : eventKey))
                }
              />
            ) : null}
          </div>
        </div>
        {error ? (
          <p className="exposition__empty" id="exposition-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
