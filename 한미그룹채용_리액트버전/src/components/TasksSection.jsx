import { useEffect, useMemo, useRef, useState } from "react";
import HanmiWalker from "./HanmiWalker";
import popupData from "../data/popupData.json";
import taskData from "../data/taskData.json";

const TAB_LABELS = {
  rnd: "R&D",
  prod: "생산/품질",
  sales: "영업",
  mps: "경영지원",
  cl: "임상",
  global: "글로벌",
  healthcare: "헬스케어",
};

function publicAsset(path) {
  return path.replace(/^\.\//, "./");
}

export default function TasksSection() {
  const [activeTab, setActiveTab] = useState(taskData[0].category);
  const [openGroup, setOpenGroup] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [visualImage, setVisualImage] = useState("./images/tasks_rnd_bg.jpg");
  const closeRef = useRef(null);
  const previousFocus = useRef(null);
  const popupByTitle = useMemo(() => {
    const map = Object.create(null);
    popupData.forEach((item) => {
      map[item.title] = item;
    });
    return map;
  }, []);

  useEffect(() => {
    if (!selectedJob) return undefined;
    const fallback = "./images/tasks_rnd_bg.jpg";
    setVisualImage(fallback);
    const image = new Image();
    image.onload = () => setVisualImage(publicAsset(selectedJob.image));
    image.src = publicAsset(selectedJob.image);

    document.documentElement.classList.add("menu-open");
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") closeModal();
      if (event.key !== "Tab") return;
      const dialog = document.querySelector(".tasks-modal__dialog");
      if (!dialog) return;
      const focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("menu-open");
    };
  }, [selectedJob]);

  function closeModal() {
    setSelectedJob(null);
    previousFocus.current?.focus();
  }

  function handleTabKey(event, index) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % taskData.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + taskData.length) % taskData.length;
    else return;
    event.preventDefault();
    setActiveTab(taskData[nextIndex].category);
    document.getElementById(`tasks-tab-${taskData[nextIndex].category}`)?.focus();
  }

  return (
    <section className="tasks" id="tasks" aria-labelledby="tasks-title">
      <div className="tasks__hero">
        <HanmiWalker
          className="tasks__walker hanmi-walker"
          variant="read"
          lazy
          ariaLabel="마우스를 바라보며 돋보기로 살펴보는 캐릭터"
        />
      </div>
      <div className="tasks__inner">
        <header className="tasks__intro">
          <h2 className="tasks__title" id="tasks-title">
            알약이를 따라
            <br />
            나에게 맞는 직무를 찾아봐요!
          </h2>
          <p className="tasks__description">
            연구부터 생산, 영업, 경영지원까지 당신의 가능성이 빛날 자리를
            안내해 드릴게요.
          </p>
        </header>
        <div className="tasks__tabs" role="tablist" aria-label="직무 분야">
          {taskData.map((category, index) => {
            const selected = category.category === activeTab;
            return (
              <button
                key={category.category}
                className="tasks__tab"
                id={`tasks-tab-${category.category}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`tasks-panel-${category.category}`}
                data-task-tab={category.category}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setActiveTab(category.category);
                  setOpenGroup(null);
                }}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                {TAB_LABELS[category.category]}
              </button>
            );
          })}
        </div>
        <div className="tasks__panels">
          {taskData.map((category) => (
            <div
              key={category.category}
              className="tasks__panel"
              id={`tasks-panel-${category.category}`}
              role="tabpanel"
              aria-labelledby={`tasks-tab-${category.category}`}
              data-task-panel={category.category}
              hidden={category.category !== activeTab}
            >
              {category.details.map((detail) => {
                const groupKey = `${category.category}-${detail.location}`;
                const isOpen = openGroup === groupKey;
                return (
                  <details
                    key={groupKey}
                    className="tasks__group"
                    open={isOpen}
                    onToggle={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <summary
                      className="tasks__group-title"
                      onClick={(event) => {
                        event.preventDefault();
                        setOpenGroup(isOpen ? null : groupKey);
                      }}
                    >
                      <span>{detail.location}</span>
                      <span className="tasks__count">{detail.count}</span>
                    </summary>
                    <div
                      className="tasks__accordion-content"
                      style={{ height: isOpen ? "auto" : "0px" }}
                    >
                      <div className="tasks__cards">
                        {detail.fields.map((role) => (
                          <button
                            key={role}
                            className="tasks__card"
                            type="button"
                            onClick={(event) => {
                              previousFocus.current = event.currentTarget;
                              setSelectedJob({
                                ...popupByTitle[role],
                                tabLabel: TAB_LABELS[category.category],
                                groupLocation: detail.location,
                              });
                            }}
                          >
                            <span>{role}</span>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div
        className="tasks-modal"
        id="tasks-modal"
        hidden={!selectedJob}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <section
          className="tasks-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tasks-modal-title"
        >
          <div
            className="tasks-modal__visual"
            aria-hidden="true"
            style={{ backgroundImage: `url(${JSON.stringify(visualImage).slice(1, -1)})` }}
          />
          <button
            className="tasks-modal__close"
            type="button"
            aria-label="상세 창 닫기"
            ref={closeRef}
            onClick={closeModal}
          >
            ×
          </button>
          {selectedJob ? (
            <div className="tasks-modal__content">
              <header className="tasks-modal__header">
                <div className="tasks-modal__heading">
                  <h3 className="tasks-modal__title" id="tasks-modal-title">
                    {selectedJob.title}
                  </h3>
                  <span className="tasks-modal__category">{selectedJob.department}</span>
                  <span className="tasks-modal__location">{selectedJob.location}</span>
                </div>
                <p className="tasks-modal__employment">{selectedJob.category}</p>
              </header>
              <div className="tasks-modal__body" id="tasks-modal-body">
                <section className="tasks-modal__section">
                  <h4>직무내용</h4>
                  <ul className="tasks-modal__list">
                    {selectedJob.job_description.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="tasks-modal__section">
                  <h4>지원 자격</h4>
                  <ul className="tasks-modal__list">
                    {selectedJob.qualifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                {selectedJob.preferred.length ? (
                  <section className="tasks-modal__section">
                    <h4>우대사항</h4>
                    <ul className="tasks-modal__list">
                      {selectedJob.preferred.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
