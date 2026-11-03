import HanmiWalker from "./HanmiWalker";

export default function MiraeSection() {
  return (
    <section className="mirae" id="mirae" aria-labelledby="mirae-title">
      <div className="mirae__stage">
        <h2 className="mirae__title" id="mirae-title">
          <span className="mirae__em">새로운 미래</span>를 향해 나아갑니다
        </h2>
      </div>
      <div className="mirae__visual">
        <div className="mirae__art">
          <img className="mirae__blur-l" src="./images/mirae_cloud1.png" alt="" />
          <HanmiWalker
            className="mirae__walker hanmi-walker"
            variant="walk"
            ariaLabel="마우스를 바라보며 걷는 캐릭터"
          />
          <img className="mirae__star1" src="./images/mirae_star1.png" alt="" />
          <img className="mirae__star2" src="./images/mirae_star2.png" alt="" />
          <img className="mirae__cloud-l" src="./images/mirae_cloud4.png" alt="" />
        </div>
        <img className="mirae__blur-s" src="./images/mirae_cloud2.png" alt="" />
        <img className="mirae__cloud-r" src="./images/mirae_cloud3.png" alt="" />
      </div>
    </section>
  );
}
