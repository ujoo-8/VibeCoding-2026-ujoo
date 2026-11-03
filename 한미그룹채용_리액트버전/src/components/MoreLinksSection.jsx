export default function MoreLinksSection() {
  return (
    <section className="con8" aria-labelledby="con8-heading">
        <div className="con8__inner">
          <h2 className="con8__heading" id="con8-heading">
            한미그룹을 더 알아볼 수 있는 링크
          </h2>
          <p className="con8__description">
            한미그룹과 함께할 여러분을 위한 정보를 확인해 보세요.
          </p>
          <div className="con8__cards">
            <img
              className="con8__character updown"
              src="/images/con8_char.png"
              alt=""
              aria-hidden="true"
              loading="lazy" />
            <a className="con8__card" href="#welfare">
              <span className="con8__image-wrap">
                <img
                  className="con8__image"
                  src="/images/con8_img1.jpg"
                  alt=""
                  loading="lazy" />
                <span className="con8__image-copy">
                  <span className="con8__image-question">
                    한미그룹의 문화와 복지가 궁금하다면?
                  </span>
                  <span className="con8__image-link">
                    한미그룹 YouTube
                    <span className="con8__arrow" aria-hidden="true">›</span>
                  </span>
                </span>
                <img
                  className="con8__mark con8__mark--culture-arrow"
                  src="/images/con8_Image.png"
                  alt=""
                  aria-hidden="true" />
              </span>
              <span className="con8__card-title">
                한미그룹의 <span>문화와 복지</span>가 궁금하다면?
                <img
                  className="con8__mark con8__mark--culture-star"
                  src="/images/con8_Image-2.png"
                  alt=""
                  aria-hidden="true" />
                <img
                  className="con8__mark con8__mark--culture-underline"
                  src="/images/con8_Image-1.png"
                  alt=""
                  aria-hidden="true" />
              </span>
            </a>
            <a className="con8__card" href="#jobs">
              <span className="con8__image-wrap">
                <img
                  className="con8__image"
                  src="/images/con8_img2.jpg"
                  alt=""
                  loading="lazy" />
                <span className="con8__image-copy">
                  <span className="con8__image-question">
                    한미그룹의 직무가 궁금하다면?
                  </span>
                  <span className="con8__image-link">
                    한미그룹 직무 소개 페이지
                    <span className="con8__arrow" aria-hidden="true">›</span>
                  </span>
                </span>
                <img
                  className="con8__mark con8__mark--job-arrow"
                  src="/images/con8_Image-4.png"
                  alt=""
                  aria-hidden="true" />
              </span>
              <span className="con8__card-title">
                한미그룹의 <span>직무가</span> 궁금하다면?
                <img
                  className="con8__mark con8__mark--job-circle"
                  src="/images/con8_Image-3.png"
                  alt=""
                  aria-hidden="true" />
              </span>
            </a>
            <a className="con8__card" href="#requirement">
              <span className="con8__image-wrap">
                <img
                  className="con8__image"
                  src="/images/con8_img3.jpg"
                  alt=""
                  loading="lazy" />
                <span className="con8__image-copy">
                  <span className="con8__image-question">
                    한미그룹의 채용소식을 빠르게 받고 싶다면?
                  </span>
                  <span className="con8__image-link">
                    한미그룹 채용 홈페이지
                    <span className="con8__arrow" aria-hidden="true">›</span>
                  </span>
                </span>
              </span>
              <span className="con8__card-title">
                한미그룹의 <span>채용소식</span>을 빠르게 받고 싶다면?
                <img
                  className="con8__mark con8__mark--news-underline"
                  src="/images/con8_Image-5.png"
                  alt=""
                  aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>
  );
}
