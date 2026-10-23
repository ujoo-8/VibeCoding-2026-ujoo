// common.js : 모든 페이지에서 쓰는 공통 기능 (햄버거 메뉴 열기/닫기)
console.log('안녕');

//////// 햄버거 클릭 시 메뉴 보이기/숨기기  /////////
// 1.대상선정
// 1-1. 이벤트 대상 : 햄버거 버튼(.menu-btn)
let 햄버거 = document.querySelector('.menu-btn');

// 1-2. 변경대상 : 상단영역(.header-area)
let 상단박스 = document.querySelector('.header-area');

// 2. 이벤트 함수 만들기
// 햄버거 클릭 시 상단박스 클래스 on넣기
// -> 헤더 요소가 없는 페이지에서는 실행하지 않도록 확인 후 연결
if (햄버거 && 상단박스) {
  햄버거.onclick = () => {
    상단박스.classList.toggle('on');
    // classList 객체는 클래스를 넣고 빼는 기능을 가짐
    // add(클래스명) - 클래스 넣기
    // remove(클래스명) - 클래스 빼기
    // toggle(클래스명) - 클래스 넣기/빼기 전환
  }; /////////  클릭함수  //////////

  console.log('선택확인:', 햄버거, 상단박스);
}

// 햄버거 메뉴 열기/닫기
// const body = document.body;
// const menuBtn = document.querySelector(".menu-btn");
// function setMenu(open) {
//   body.classList.toggle("menu-open", open);n
//   menuBtn.setAttribute("aria-expanded", open);
//   menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
// }
// menuBtn.addEventListener("click", () =>
//   setMenu(!body.classList.contains("menu-open")),
// );
// // 메뉴 항목 클릭 시 닫기
// document
//   .querySelectorAll(".menu-list a")
//   .forEach((a) => a.addEventListener("click", () => setMenu(false)));
// // PC 폭으로 돌아오면 닫기
// window.addEventListener("resize", () => {
//   if (window.innerWidth > 1199) setMenu(false);
// });
