export default function JobsSection() {
  return (
    <section className="jobs" id="jobs" aria-labelledby="jobs-title">
        <div className="jobs__inner">
          <header className="jobs__header">
            <h2 className="jobs__title" id="jobs-title">
              <img
                className="jobs__logo"
                src="/images/con3_logo.png"
                width="215"
                height="165"
                alt="Hanmi" />한미에서는 어떤 일을 할까요?
            </h2>
            <p className="jobs__desc">
              일의 보람부터 성장의 순간까지, 먼저 경험한 현직자들이 솔직하게
              들려드립니다.
            </p>
          </header>

          <ul className="jobs__list">
            <li className="jobs__item">
              <a className="jobs__card" href="#interview-quality">
                <figure className="jobs__photo">
                  <img
                    src="/images/con3_int1.jpg"
                    alt="의약품 품질관리 실험실에서 주먹을 쥐고 웃고 있는 이건호 사원" />
                </figure>
                <p className="jobs__summary">
                  정밀한 시험과 분석으로 의약품의 품질을 확인해<br
                    className="jobs__br" />
                  안전하고 신뢰할 수 있는 의약품을 만들어갑니다.
                </p>
                <div className="jobs__meta">
                  <p className="jobs__who">
                    <span className="jobs__dept">한미약품 품질관리</span>
                    <span className="jobs__bar" aria-hidden="true"></span>
                    <span className="jobs__name">이건호 사원</span>
                  </p>
                  <span className="jobs__arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="sr-only">인터뷰 자세히 보기</span>
                </div>
              </a>
            </li>

            <li className="jobs__item">
              <a className="jobs__card" href="#interview-research">
                <figure className="jobs__photo">
                  <img
                    src="/images/con3_int2.jpg"
                    alt="휴게 공간 소파에 앉아 미소 짓고 있는 박진하 연구원" />
                </figure>
                <p className="jobs__summary">
                  신약 후보물질의 가능성을 과학적으로 검증해<br
                    className="jobs__br" />
                  새로운 치료제가 환자에게 향하는 첫걸음을 만듭니다.
                </p>
                <div className="jobs__meta">
                  <p className="jobs__who">
                    <span className="jobs__dept">한미약품 전임상연구</span>
                    <span className="jobs__bar" aria-hidden="true"></span>
                    <span className="jobs__name">박진하 연구원</span>
                  </p>
                  <span className="jobs__arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="sr-only">인터뷰 자세히 보기</span>
                </div>
              </a>
            </li>
          </ul>

          <a className="jobs__more" href="#interviews">모든 현직자 알아가기!</a>
        </div>

        {/* 장식용 그래픽 (스크린리더 제외) */}
        <div className="jobs__bg__obj">
          <img
            className="jobs__deco jobs__deco--char updown"
            src="/images/con3_char.png"
            alt=""
            aria-hidden="true" />
          <img
            className="jobs__deco jobs__deco--bottle updown"
            src="/images/con3_bottle.png"
            alt=""
            aria-hidden="true" />
        </div>
      </section>
  );
}
