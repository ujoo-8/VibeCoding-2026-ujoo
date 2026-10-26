// main.js : 메인 페이지(index.html) 전용 기능 (메인 배너 클릭 시 헤더 변화)

// document는 전체 문서객체(DOM-Document Object Model)
// 점(.)은 객체의 하위 속성으로 들어감
// 요소 선택법: querySelector(CSS선택자)
// -> 첫번째 만난 요소 하나만 가져옴
// ->참고로 여러 요소 선택은 querySelectorAll(CSS선택자)

//변수(저장주소)
let 나야나 = document.querySelector('.header-inner');
// 변수는 따옴표로 싸지 않는 문자다.
// 변수는 let으로 선언한다.
// 이퀄(=)은 오른쪽의 값이 왼쪽 변수에 할당되는 것
// 변수는 왜 쓰나? 재사용


// 아래의 코드가 바로 실행하지 않고 호출시에만 실행하도록 하려면? 함수안에 넣어준다
// 함수 이름을 호출할 때 실행됨

// 원래 함수
function 함수명(전달변수){코드}
// 화살표 함수가 유행~!
//let 함수담을변수 = (전달변수)=>{코드}//()=>붙여써도 됨

// const 는 상수 또는 함수를 담는 변수 선언
// 보안상 let보다 const를 함수담을 때 많이 씀.

const 나야나함수 = (색상)=>{
  console.log('함수호출! 전달값은?', 색상);
  나야나.style.backgroundColor = 색상;
  나야나.style.transition = '2s ease-in-out';
  // 회전은 로고가 하도록 변경
  나야나.querySelector('.header-logo').style.rotate = '360deg';
  나야나.querySelector('.header-logo').style.transition = '1s ease-in-out 2s';
};/////////// 나야나함수 /////////////

// 할당된 화살표함수는 반드시 함수 아래쪽에서 호출해야함
// 또는 이벤트 발생시엔 상관없음

// 함수는 호출시 함수명(전달값) -> 소괄호 필수
// 만약 전달변수가 있다면 값을 써서 보내야함.
// 나야나함수('lightgreen');

// 최종 요구사항
// -> 상단배너 클릭 시
// 상단 메뉴 배경색을 변경하고
// 상단 메뉴는 360도 회전함
// 트랜지션으로 애니메이션 2초간 되게함

// 대상선정:
// 1. 이벤트대상 : 상단배너 (.main-visual-img)
let 너를클릭해 = document.querySelector('.main-visual-img');
// 2. 변경대상 : 상단영역은 이미 위에서 선택
// 3. 이벤트 설정하기 : 클릭이벤트
// 클릭이벤트는 onclick 속성으로 세팅
// 클릭 시 함수호출은 바로 실행 안되게 화살표함수로 표시
// -> 메인 배너와 헤더가 있는 페이지에서만 실행하도록 확인 후 연결
if (나야나 && 너를클릭해) {
  너를클릭해.onclick = ()=>{
    // 해당 요소에 클릭이벤트가 발생하면 이 구역을 실행함
    나야나함수('lightgreen');
  };//////  onclick 함수 ///////

  console.log('나는 누구인가?',나야나)
}


// 상단 요소의 배경색 바꾸기
//나야나.style.backgroundColor = 'red'


// ===== place 영역 배경 슬라이더 (바닐라 JS) =====
// 동작: 첫 이미지 표시 → 2초 대기 → 1초간 왼쪽으로 밀려나며 다음 이미지가 들어옴 → 반복
// 마지막(3번째) 이미지 다음에는 복제된 1번째 이미지가 오른쪽에서 들어오고,
// 이동이 끝나면 트랜지션 없이 진짜 1번째 위치로 순간 이동해서 끊김 없이 무한 반복함.




//  (()=>{})();
// 이 구역
// 전역변수는 함수바깥에 있는 변수
// 지역변수는 함수 내부에 있는 변수 
// 아래처럼 쓰고 중괄호안에 코드를 넣으면 된다.
/* 
      (()=>{
            내 코드.....

      })();
*/




const placeTrack = document.querySelector('.place-track');

if (placeTrack) {
  const WAIT_MS = 6000;  // 멈춰 있는 시간
  const MOVE_MS = 1000;  // 이동 시간

  // 무한 반복용: 첫 슬라이드를 복제해서 맨 뒤에 붙임
  const slides = placeTrack.children;
  const total = slides.length;              // 원본 슬라이드 수 (3)
  placeTrack.appendChild(slides[0].cloneNode(true));

  let index = 0;

  const moveTo = (i, animate) => {
    placeTrack.style.transition = animate ? `transform ${MOVE_MS}ms ease-in-out` : 'none';
    placeTrack.style.transform = `translateX(-${i * 100}%)`;
  };

  const next = () => {
    index++;
    moveTo(index, true);

    // 이동이 끝나면(1초 뒤) 처리
    setTimeout(() => {
      if (index === total) {
        // 복제본(=1번째 이미지)까지 왔다면 진짜 1번째로 순간 복귀
        index = 0;
        moveTo(0, false);
      }
      setTimeout(next, WAIT_MS); // 다시 2초 대기 후 다음 이동
    }, MOVE_MS);
  };

  moveTo(0, false);
  setTimeout(next, WAIT_MS); // 처음엔 첫 이미지를 2초간 보여줌
}

// 메인 비주얼 등장 애니메이션 (사용 안 함)
// window.addEventListener("DOMContentLoaded", function () {
//   setTimeout(function () {
//     document.getElementById("mainVisualImg").classList.add("visible");
//   }, 180); // a slight delay feels smooth
// });