export default function NewsSection() {
  return (
    <section className="news" id="news" aria-labelledby="news-title">
        <div className="news__inner">
          <header className="news__header">
            <h2 className="news__title" id="news-title">
              당신의 가능성,<br />한미그룹에서 더 크게 성장합니다
            </h2>
            <p className="news__desc">
              연구와 혁신으로 성장하며 글로벌 제약/바이오 기업을 향해
              나아갑니다.
            </p>
          </header>

          <div className="news__card">
            {/* 장식용 그래픽 (스크린리더 제외) */}
            <img
              className="news__deco news__deco--chem"
              src="/images/inno_chemical.png"
              alt=""
              aria-hidden="true" />
            <img
              className="news__deco news__deco--atom bigsmall"
              src="/images/inno_molecule1.png"
              alt=""
              aria-hidden="true" />
            <img
              className="news__deco news__deco--mol updown"
              src="/images/inno_molecule2.png"
              alt=""
              aria-hidden="true" />

            {/* 말풍선: 주황(꼬리 좌하단, 좌측 정렬) / 흰색(꼬리 우하단, 우측 정렬) 교차 */}
            <ul className="news__list">
              <li className="news__item news__item--left">
                <a className="news__bubble news__bubble--orange" href="#news-1">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >한미약품, 상반기 누적 매출 8,602억원…2분기 영업이익 117%
                    증가</span
                  >
                </a>
              </li>

              <li className="news__item news__item--right">
                <a className="news__bubble news__bubble--white" href="#news-2">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >“사업형 지주사 경쟁력 입증”…한미사이언스, 2분기 영업이익
                    71%↑<br />2분기 매출 3,679억원…상반기 누적 매출 7,216억원
                    돌파</span
                  >
                </a>
              </li>

              <li className="news__item news__item--left">
                <a className="news__bubble news__bubble--orange" href="#news-3">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >한미약품, 로슈 제넨텍에 비만신약 기술수출…최대 3조 2,000억
                    규모</span
                  >
                </a>
              </li>

              <li className="news__item news__item--right">
                <a className="news__bubble news__bubble--white" href="#news-4">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >“UCN2 이어 또…” 한미약품, 두 번째 근육 증가 비만신약
                    공개</span
                  >
                </a>
              </li>

              <li className="news__item news__item--left">
                <a className="news__bubble news__bubble--orange" href="#news-5">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >명품 반열 오른 한미 ‘로수젯’…압도적 데이터 경쟁력으로 시장
                    석권<br />2년 연속 국내사 개발 전문의약품 시장 ‘1위’…올해
                    상반기 누적 처방액도 선두</span
                  >
                </a>
              </li>

              <li className="news__item news__item--right">
                <a className="news__bubble news__bubble--white" href="#news-6">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >“비만 넘어 항암으로 혁신 확장”…한미, AACR서 차세대 신약
                    대거 공개</span
                  >
                </a>
              </li>

              <li className="news__item news__item--left">
                <a className="news__bubble news__bubble--orange" href="#news-7">
                  <svg className="news__bg" aria-hidden="true">
                    <rect width="100%" height="100%" rx="13" ry="13" />
                  </svg>
                  <svg
                    className="news__tail"
                    viewBox="0 0 22 14"
                    aria-hidden="true"
                  >
                    <rect x="8" y="0" width="14" height="14" />
                    <path
                      d="M9 3.5V14H1.8C.6 14 .2 12.9 1.1 12.3C5.2 9.8 8.2 7.2 9 3.5Z"
                    />
                  </svg>
                  <span className="news__text"
                    >한미 완전두유·케어미, 영양에 ‘맛’까지 인정…국제 우수 미각상
                    수상</span
                  >
                </a>
              </li>
            </ul>

            <p className="news__note">말풍선을 클릭해서 기사를 확인해 보세요.</p>
          </div>
        </div>
      </section>
  );
}
