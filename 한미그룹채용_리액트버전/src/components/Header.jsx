import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#jobs", label: "직무소개" },
  { href: "#requirement", label: "지원자격 및 접수방법" },
  { href: "#exposition", label: "채용설명회 일정" },
];

function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 7 12" fill="none" aria-hidden="true">
      <path
        d="M1 1l5 5-5 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerClass, setHeaderClass] = useState("header");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("menu-open", menuOpen);
    return () => root.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 390px)");
    function onChange(event) {
      if (!event.matches) setMenuOpen(false);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let previousScrollY = Math.max(0, window.scrollY);
    let accumulatedScrollDelta = 0;
    let scrollDirection = 0;
    const scrollThreshold = 6;

    function updateHeaderVisibility() {
      const currentScrollY = Math.max(0, window.scrollY);
      const scrollDelta = currentScrollY - previousScrollY;
      const nextDirection = Math.sign(scrollDelta);

      if (currentScrollY === 0) {
        accumulatedScrollDelta = 0;
        scrollDirection = 0;
        setHeaderClass(menuOpen ? "header is-menu-open" : "header");
      } else if (menuOpen) {
        accumulatedScrollDelta = 0;
        scrollDirection = 0;
        setHeaderClass("header is-menu-open");
      } else if (nextDirection !== 0) {
        if (nextDirection !== scrollDirection) {
          accumulatedScrollDelta = 0;
          scrollDirection = nextDirection;
        }
        accumulatedScrollDelta += scrollDelta;
        if (accumulatedScrollDelta > scrollThreshold) {
          setHeaderClass("header is-hidden");
          accumulatedScrollDelta = 0;
        } else if (accumulatedScrollDelta < -scrollThreshold) {
          setHeaderClass("header is-visible");
          accumulatedScrollDelta = 0;
        }
      }
      previousScrollY = currentScrollY;
    }

    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
    updateHeaderVisibility();
    return () => window.removeEventListener("scroll", updateHeaderVisibility);
  }, [menuOpen]);

  return (
    <header className={headerClass}>
      <div className="header__inner">
        <a className="logo" href="./" aria-label="한미그룹 홈">
          <img src="./images/logo.svg" width="182" height="31" alt="Hanmi 한미그룹" />
        </a>
        <nav
          className={menuOpen ? "gnb is-open" : "gnb"}
          id="gnb"
          aria-label="주요 메뉴"
        >
          <button
            type="button"
            className="gnb__close"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
          />
          <ul className="gnb__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="gnb__link"
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--sm gnb__apply" href="#apply" onClick={() => setMenuOpen(false)}>
            지원하기
            <Chevron />
          </a>
        </nav>
        <a className="btn btn--sm header__apply" href="#apply">
          지원하기
        </a>
        <button
          type="button"
          className="gnb__toggle"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          aria-controls="gnb"
          onClick={() => setMenuOpen(true)}
        />
      </div>
    </header>
  );
}
