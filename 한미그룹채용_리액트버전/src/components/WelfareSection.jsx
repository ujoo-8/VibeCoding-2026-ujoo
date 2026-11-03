import { useEffect, useState } from "react";

function publicAsset(path) {
  if (!path) return path;
  return path.replace(/^\.\//, "./");
}

export default function WelfareSection() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    fetch("./data/benefits.json")
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("invalid");
        setCategories(data);
      })
      .catch((loadError) => {
        console.error("복지 데이터 로딩에 실패했습니다.", loadError);
        setError(
          "복지 데이터를 불러오지 못했습니다. 웹 서버로 페이지를 열고 data/benefits.json 파일을 확인해 주세요.",
        );
      })
      .finally(() => setBusy(false));
  }, []);

  return (
    <section className="welfare" id="welfare" aria-labelledby="welfare-title">
      <div className="welfare__inner">
        <header className="welfare__header">
          <h2 className="welfare__title" id="welfare-title">
            <span>한미 생활을</span> <span>더 즐겁게 만드는 방법</span>
          </h2>
          <p className="welfare__desc">
            건강부터 성장, 휴식까지 알차게 준비한 복지를 소개할게요.
          </p>
          <img
            className="welfare__mascot updown"
            src="./images/con5_char.png"
            alt="세면 도구를 들고 있는 주황색 한미 캐릭터"
          />
        </header>
        <div className="welfare__content">
          <div
            className="welfare__scroll"
            aria-label="회사 복지 목록 스크롤 영역"
            aria-busy={busy}
            tabIndex={0}
          >
            <div className="welfare__categories" id="welfare-categories">
              {categories.map((category, categoryIndex) => (
                <section
                  key={category.category}
                  className="welfare__category"
                  aria-labelledby={`welfare-category-title-${categoryIndex}`}
                >
                  <header className="welfare__lead">
                    <h3
                      className="welfare__lead-title"
                      id={`welfare-category-title-${categoryIndex}`}
                    >
                      {category.category}
                    </h3>
                    <p className="welfare__lead-desc">{category.category_description}</p>
                  </header>
                  <ul className="welfare__list">
                    {category.items.map((item) => (
                      <li key={item.title} className="welfare__item">
                        <article className="welfare__card">
                          <div className="welfare__copy">
                            <h4 className="welfare__card-title">{item.title}</h4>
                            <p className="welfare__card-desc">{item.description}</p>
                          </div>
                          {item.icon ? (
                            <img
                              className="welfare__icon"
                              src={publicAsset(item.icon)}
                              alt={item.icon_alt}
                            />
                          ) : null}
                        </article>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            {error ? (
              <p className="welfare__error" id="welfare-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <img
        className="welfare__mascot welfare__mascot--purple"
        src="./images/con5_cloud.png"
        alt="보라색 한미 캐릭터 아래에 놓인 장식 구름"
      />
    </section>
  );
}
