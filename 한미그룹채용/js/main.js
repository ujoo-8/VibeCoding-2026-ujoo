/* main.js : 사이트 전체 스크립트 (defer, 아래 순서대로 실행) */


/* ================ 두 번째 섹션(#mirae) 캐릭터: 데스크탑 포인터에서만 마우스 추적 ================ */
(function () {
  var walker = document.querySelector("#mirae [data-hanmi-walker]");
  if (!walker) return;

  walker.removeAttribute("data-hanmi-walker");
  var desktopPointer = window.matchMedia(
    "(min-width: 1025px) and (hover: hover) and (pointer: fine)",
  );

  function syncTrackingMode() {
    var player = walker.hanmiWalker;
    if (!player) return;
    player.tracking = desktopPointer.matches;
    player.pointer = null;
    player.gaze = { x: 0, y: 0 };
    player.update();
  }

  syncTrackingMode();
  if (desktopPointer.addEventListener) {
    desktopPointer.addEventListener("change", syncTrackingMode);
  } else {
    desktopPointer.addListener(syncTrackingMode);
  }
})();

/* ================ 직무 탐색(#tasks) 캐릭터: 화면에 가까워지면 reading 플레이어를 지연 로드 ================ */
(function () {
  var walker = document.querySelector(
    ".tasks__walker[data-hanmi-walker-lazy]",
  );
  if (!walker) return;

  function loadPlayer() {
    // 최초 로드 시 player.js 가 이 캐릭터를 잡지 않도록, 여기서 속성을 붙인 뒤 reading 플레이어를 불러옵니다.
    walker.setAttribute("data-hanmi-walker", "");
    var metadataScript = document.createElement("script");
    metadataScript.src =
      "./data/hanmi-reading-eye-tracking/metadata-v3.js";
    metadataScript.onload = function () {
      var playerScript = document.createElement("script");
      playerScript.src =
        "./data/hanmi-reading-eye-tracking/player-v3.js";
      playerScript.onload = function () {
        var desktopPointer = window.matchMedia(
          "(min-width: 1025px) and (hover: hover) and (pointer: fine)",
        );

        function syncTrackingMode() {
          var player = walker.hanmiWalker;
          if (!player) return;
          player.tracking = desktopPointer.matches;
          player.pointer = null;
          player.gaze = { x: 0, y: 0 };
          player.update();
        }

        syncTrackingMode();
        desktopPointer.addEventListener("change", syncTrackingMode);
      };
      document.body.appendChild(playerScript);
    };
    document.body.appendChild(metadataScript);
  }

  if (!window.IntersectionObserver) {
    loadPlayer();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      loadPlayer();
    },
    { rootMargin: "240px" },
  );
  observer.observe(walker);
})();

/* ================ 메인 비주얼 아래로 스크롤 버튼 ================ */
(function () {
  var btn = document.getElementById("scrollBtn");
  var mv = document.getElementById("main_visual");
  if (btn && mv) {
    btn.addEventListener("click", function () {
      window.scrollTo({ top: mv.offsetHeight, behavior: "smooth" });
    });
  }
})();

/* ================ 지원 마감 카운트다운 ================ */
(function () {
  var countdown = document.getElementById("con9-countdown");
  if (!countdown) return;

  var deadline = new Date("2026-10-18T23:59:00+09:00").getTime();
  var units = {
    days: countdown.querySelector('[data-countdown="days"]'),
    hours: countdown.querySelector('[data-countdown="hours"]'),
    minutes: countdown.querySelector('[data-countdown="minutes"]'),
    seconds: countdown.querySelector('[data-countdown="seconds"]'),
  };
  if (
    Object.keys(units).some(function (key) {
      return !units[key];
    })
  ) {
    throw new Error("지원 마감 카운트다운 영역을 찾을 수 없습니다.");
  }

  function updateCountdown() {
    var remaining = deadline - Date.now();
    if (remaining <= 0) {
      Object.keys(units).forEach(function (key) {
        units[key].textContent = "00";
      });
      return false;
    }

    var totalSeconds = Math.floor(remaining / 1000);
    var values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
    Object.keys(values).forEach(function (key) {
      units[key].textContent = String(values[key]).padStart(2, "0");
    });
    return true;
  }

  if (updateCountdown()) {
    var countdownInterval = window.setInterval(function () {
      if (!updateCountdown()) window.clearInterval(countdownInterval);
    }, 1000);
  }
})();

/* ================ 지원자격 / 전형절차 탭 ================ */
(function () {
  var tabs = Array.prototype.slice.call(
    document.querySelectorAll(".requirement__tab"),
  );
  var panels = tabs.map(function (tab) {
    return document.getElementById(tab.getAttribute("aria-controls"));
  });
  var processViewport = document.querySelector(
    ".requirement__process-viewport",
  );
  var processTrack = document.querySelector(
    ".requirement__process-track",
  );
  if (
    !tabs.length ||
    panels.some(function (panel) {
      return !panel;
    }) ||
    !processViewport ||
    !processTrack
  ) {
    throw new Error("지원자격 및 전형절차 영역을 찾을 수 없습니다.");
  }

  function fitProcessTrack() {
    if (window.innerWidth <= 1024) {
      processTrack.style.removeProperty("--requirement-process-scale");
      processViewport.style.height = "auto";
      return;
    }
    var scale = Math.min(1, processViewport.clientWidth / 1128);
    processTrack.style.setProperty(
      "--requirement-process-scale",
      String(scale),
    );
    processViewport.style.height =
      processTrack.offsetHeight * scale + "px";
  }

  function selectTab(selectedIndex, moveFocus) {
    tabs.forEach(function (tab, index) {
      var selected = index === selectedIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });
    if (moveFocus) tabs[selectedIndex].focus();
    if (selectedIndex === 1) fitProcessTrack();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(index, false);
    });
    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      selectTab(nextIndex, true);
    });
  });

  window.addEventListener("resize", fitProcessTrack);
})();

/* ================ 박람회 / 캠퍼스 일정 (data/exposition.json, data/campus_schedule.json) ================ */
(function () {
  var tabs = Array.prototype.slice.call(
    document.querySelectorAll(".exposition__tab"),
  );
  var panels = tabs.map(function (tab) {
    return document.getElementById(tab.getAttribute("aria-controls"));
  });
  var regionsContainer = document.getElementById("exposition-regions");
  var fairSchedule = document.getElementById("exposition-fair-schedule");
  var campusSchedule = document.getElementById(
    "exposition-campus-schedule",
  );
  var errorMessage = document.getElementById("exposition-error");
  if (
    !tabs.length ||
    panels.some(function (panel) {
      return !panel;
    }) ||
    !regionsContainer ||
    !fairSchedule ||
    !campusSchedule ||
    !errorMessage
  ) {
    throw new Error("박람회 및 캠퍼스 일정 영역을 찾을 수 없습니다.");
  }

  function showError(error) {
    errorMessage.hidden = false;
    errorMessage.textContent =
      "일정 데이터를 불러오지 못했습니다. data/exposition.json 및 data/campus_schedule.json 파일을 확인해 주세요.";
    console.error("박람회 및 캠퍼스 일정 로딩에 실패했습니다.", error);
  }

  function renderSchedule(container, days, emptyMessage, interactive) {
    if (!Array.isArray(days)) {
      throw new Error("일정은 날짜 배열이어야 합니다.");
    }
    container.replaceChildren();
    container.classList.toggle(
      "exposition__schedule--empty",
      days.length === 0,
    );

    if (days.length === 0) {
      var emptyFragment = document.createDocumentFragment();
      for (var index = 0; index < 5; index += 1) {
        var emptyDay = document.createElement("div");
        emptyDay.className = "exposition__day";
        emptyDay.setAttribute("aria-hidden", "true");
        var emptyDate = document.createElement("h3");
        emptyDate.className = "exposition__date";
        var emptyEvents = document.createElement("div");
        emptyEvents.className = "exposition__events";
        emptyDay.appendChild(emptyDate);
        emptyDay.appendChild(emptyEvents);
        emptyFragment.appendChild(emptyDay);
      }
      var empty = document.createElement("p");
      empty.className = "exposition__empty";
      empty.textContent =
        emptyMessage ||
        "해당 지역의 캠퍼스 방문 일정은 추후 안내 예정입니다.";
      emptyFragment.appendChild(empty);
      container.appendChild(emptyFragment);
      return;
    }

    var fragment = document.createDocumentFragment();
    days.forEach(function (day) {
      if (
        !day ||
        typeof day !== "object" ||
        typeof day.date !== "string" ||
        !Array.isArray(day.events)
      ) {
        throw new Error("일정 날짜 데이터 형식이 올바르지 않습니다.");
      }

      var dayElement = document.createElement("div");
      dayElement.className = "exposition__day";
      var date = document.createElement("h3");
      date.className = "exposition__date";
      date.textContent = day.date;
      dayElement.appendChild(date);
      if (!day.date) {
        dayElement.setAttribute("aria-hidden", "true");
      }

      var events = document.createElement("div");
      events.className = "exposition__events";
      day.events.forEach(function (eventData) {
        if (
          typeof eventData !== "string" &&
          (!eventData || typeof eventData !== "object")
        ) {
          throw new Error("일정 장소 데이터 형식이 올바르지 않습니다.");
        }
        var eventName =
          typeof eventData === "string" ? eventData : eventData.name;
        if (typeof eventName !== "string" || !eventName.trim()) {
          throw new Error("일정 장소 이름이 올바르지 않습니다.");
        }
        if (
          typeof eventData === "object" &&
          ["location", "time"].some(function (key) {
            return (
              eventData[key] !== undefined &&
              (typeof eventData[key] !== "string" ||
                !eventData[key].trim())
            );
          })
        ) {
          throw new Error(
            "일정의 장소 또는 시간 정보가 올바르지 않습니다.",
          );
        }

        if (!interactive) {
          var eventLabel = document.createElement("span");
          eventLabel.className = "exposition__event-label";
          eventLabel.textContent = eventName;
          events.appendChild(eventLabel);
          return;
        }

        var eventButton = document.createElement("button");
        eventButton.className = "exposition__event";
        eventButton.type = "button";
        eventButton.textContent = eventName;
        eventButton.setAttribute("aria-pressed", "false");

        var venueCard = document.createElement("div");
        venueCard.className = "exposition__venue-card";
        venueCard.hidden = true;
        venueCard.setAttribute(
          "aria-label",
          eventName + " 방문 장소 및 시간",
        );
        [
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
        ].forEach(function (item) {
          var detailItem = document.createElement("div");
          detailItem.className = "exposition__venue-item";
          var label = document.createElement("span");
          label.className = "exposition__venue-label";
          label.textContent = item.label;
          var value = document.createElement("span");
          value.className = "exposition__venue-value";
          value.textContent = item.value;
          detailItem.appendChild(label);
          detailItem.appendChild(value);
          venueCard.appendChild(detailItem);
        });

        eventButton.addEventListener("click", function () {
          var shouldOpen = venueCard.hidden;
          document
            .querySelectorAll(".exposition__venue-card")
            .forEach(function (card) {
              card.hidden = true;
            });
          document
            .querySelectorAll(".exposition__event[aria-pressed='true']")
            .forEach(function (selected) {
              selected.setAttribute("aria-pressed", "false");
            });
          venueCard.hidden = !shouldOpen;
          eventButton.setAttribute("aria-pressed", String(shouldOpen));
        });
        events.appendChild(venueCard);
        events.appendChild(eventButton);
      });
      dayElement.appendChild(events);
      fragment.appendChild(dayElement);
    });
    container.appendChild(fragment);
  }

  function closeVenueCards() {
    document
      .querySelectorAll(".exposition__venue-card")
      .forEach(function (card) {
        card.hidden = true;
      });
    document
      .querySelectorAll(".exposition__event[aria-pressed='true']")
      .forEach(function (selected) {
        selected.setAttribute("aria-pressed", "false");
      });
  }

  function selectTab(selectedIndex, moveFocus) {
    tabs.forEach(function (tab, index) {
      var selected = index === selectedIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });
    regionsContainer.hidden = selectedIndex !== 1;
    closeVenueCards();
    if (moveFocus) tabs[selectedIndex].focus();
  }

  function selectRegion(region, button) {
    regionsContainer
      .querySelectorAll(".exposition__region")
      .forEach(function (regionButton) {
        regionButton.setAttribute(
          "aria-pressed",
          String(regionButton === button),
        );
      });
    closeVenueCards();
    renderSchedule(
      campusSchedule,
      region.schedule,
      region.name + " 지역의 캠퍼스 방문 일정은 추후 안내 예정입니다.",
      true,
    );
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(index, false);
    });
    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }
      event.preventDefault();
      selectTab(nextIndex, true);
    });
  });

  document.addEventListener("click", function (event) {
    if (
      !event.target ||
      typeof event.target.closest !== "function" ||
      !event.target.closest(".exposition__venue-card, .exposition__event")
    ) {
      closeVenueCards();
    }
  });

  Promise.all([
    fetch("./data/exposition.json"),
    fetch("./data/campus_schedule.json"),
  ])
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          if (!response.ok) {
            throw new Error(
              "일정 데이터 요청에 실패했습니다: " + response.status,
            );
          }
          return response.json();
        }),
      );
    })
    .then(function (datasets) {
      var data = datasets[0];
      var campusScheduleData = datasets[1];
      if (
        !data ||
        !Array.isArray(data.exhibition) ||
        !Array.isArray(data.regions) ||
        !data.regions.length ||
        data.regions.some(function (region) {
          return (
            !region ||
            typeof region.name !== "string" ||
            !region.name.trim()
          );
        })
      ) {
        throw new Error(
          "박람회 및 지역 일정 데이터 형식이 올바르지 않습니다.",
        );
      }
      if (
        !campusScheduleData ||
        typeof campusScheduleData !== "object" ||
        Array.isArray(campusScheduleData)
      ) {
        throw new Error("캠퍼스 일정 데이터는 지역별 객체여야 합니다.");
      }
      renderSchedule(fairSchedule, data.exhibition, "", false);

      var campusRegions = data.regions.map(function (region) {
        return { name: region.name, schedule: [] };
      });
      var campusRegionMap = new Map();
      campusRegions.forEach(function (region) {
        campusRegionMap.set(region.name, region);
      });
      var campusDays = new Map();
      Object.keys(campusScheduleData).forEach(function (regionName) {
        var records = campusScheduleData[regionName];
        if (!Array.isArray(records)) {
          throw new Error(
            regionName + " 캠퍼스 일정은 배열이어야 합니다.",
          );
        }
        var region = campusRegionMap.get(regionName);
        if (!region) {
          region = { name: regionName, schedule: [] };
          campusRegionMap.set(region.name, region);
          campusRegions.push(region);
        }
        records.forEach(function (record) {
          if (
            !record ||
            typeof record !== "object" ||
            typeof record.date !== "string" ||
            !record.date.trim() ||
            typeof record.university !== "string" ||
            !record.university.trim() ||
            ["place", "time"].some(function (key) {
              return (
                record[key] !== undefined &&
                (typeof record[key] !== "string" || !record[key].trim())
              );
            })
          ) {
            throw new Error(
              regionName +
                " 캠퍼스 일정의 날짜, 학교, 장소 또는 시간 정보가 올바르지 않습니다.",
            );
          }

          var regionDayMap = campusDays.get(region.name);
          if (!regionDayMap) {
            regionDayMap = new Map();
            campusDays.set(region.name, regionDayMap);
          }
          var day = regionDayMap.get(record.date);
          if (!day) {
            day = { date: record.date, events: [] };
            regionDayMap.set(record.date, day);
            region.schedule.push(day);
          }
          var event = { name: record.university };
          if (record.place) event.location = record.place;
          if (record.time) event.time = record.time;
          day.events.push(event);
        });
      });
      campusRegions.forEach(function (region) {
        region.schedule.sort(function (left, right) {
          var leftDate = left.date.match(/^(\d+)월\s*(\d+)일/);
          var rightDate = right.date.match(/^(\d+)월\s*(\d+)일/);
          if (!leftDate || !rightDate) {
            throw new Error("캠퍼스 일정 날짜 형식이 올바르지 않습니다.");
          }
          return (
            Number(leftDate[1]) - Number(rightDate[1]) ||
            Number(leftDate[2]) - Number(rightDate[2])
          );
        });
        if (!region.schedule.length) return;

        var scheduledDays = new Map(
          region.schedule.map(function (day) {
            return [day.date, day];
          }),
        );
        var lastDate =
          region.schedule[region.schedule.length - 1].date.match(
            /^(\d+)월\s*(\d+)일/,
          );
        var firstDate =
          region.schedule[0].date.match(/^(\d+)월\s*(\d+)일/);
        var firstScheduledDate = Date.UTC(
          2026,
          Number(firstDate[1]) - 1,
          Number(firstDate[2]),
        );
        var lastScheduledDate = Date.UTC(
          2026,
          Number(lastDate[1]) - 1,
          Number(lastDate[2]),
        );
        var weekdays = ["일", "월", "화", "수", "목", "금", "토"];
        var calendarDays = [];
        var firstWeekday = new Date(firstScheduledDate).getUTCDay();
        var weekStart =
          firstScheduledDate -
          ((firstWeekday + 6) % 7) * 24 * 60 * 60 * 1000;
        var lastWeekday = new Date(lastScheduledDate).getUTCDay();
        var lastWeekStart =
          lastScheduledDate -
          ((lastWeekday + 6) % 7) * 24 * 60 * 60 * 1000;

        for (
          var weekTimestamp = weekStart;
          weekTimestamp <= lastWeekStart;
          weekTimestamp += 7 * 24 * 60 * 60 * 1000
        ) {
          var weekDays = [];
          var weekHasEvents = false;
          for (var dayIndex = 0; dayIndex < 5; dayIndex += 1) {
            var dayTimestamp =
              weekTimestamp + dayIndex * 24 * 60 * 60 * 1000;
            var calendarDate = new Date(dayTimestamp);
            var month = calendarDate.getUTCMonth() + 1;
            var dateNumber = calendarDate.getUTCDate();
            var dateLabel =
              month +
              "월 " +
              dateNumber +
              "일 (" +
              weekdays[calendarDate.getUTCDay()] +
              ")";
            var scheduledDay = scheduledDays.get(dateLabel);
            var isOutsideScheduleRange =
              dayTimestamp < firstScheduledDate ||
              dayTimestamp > lastScheduledDate;
            var weekDay = isOutsideScheduleRange
              ? { date: "", events: [] }
              : scheduledDay || { date: dateLabel, events: [] };
            weekDays.push(weekDay);
            if (scheduledDay && scheduledDay.events.length) {
              weekHasEvents = true;
            }
          }
          if (weekHasEvents) {
            calendarDays.push.apply(calendarDays, weekDays);
          }
        }
        region.schedule = calendarDays;
      });

      var fragment = document.createDocumentFragment();
      campusRegions.forEach(function (region, index) {
        var button = document.createElement("button");
        button.className = "exposition__region";
        button.type = "button";
        button.textContent = region.name;
        button.setAttribute("aria-pressed", String(index === 0));
        button.addEventListener("click", function () {
          selectRegion(region, button);
        });
        fragment.appendChild(button);
      });
      regionsContainer.appendChild(fragment);
      selectRegion(campusRegions[0], regionsContainer.firstElementChild);
    })
    .catch(showError);
})();

/* ================ 회사 복지 목록 (data/benefits.json) ================ */
/* 회사 복지: benefits.json 데이터를 카테고리별 카드로 렌더링 */
(function () {
  var welfareScroll = document.querySelector(".welfare__scroll");
  var categoriesContainer = document.getElementById("welfare-categories");
  var errorMessage = document.getElementById("welfare-error");
  if (!welfareScroll || !categoriesContainer || !errorMessage) {
    throw new Error("복지 목록을 표시할 영역을 찾을 수 없습니다.");
  }

  function requireText(value, fieldName) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(
        "복지 데이터의 " + fieldName + " 값이 올바르지 않습니다.",
      );
    }
  }

  fetch("./data/benefits.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          "복지 데이터 요청에 실패했습니다: " + response.status,
        );
      }
      return response.json();
    })
    .then(function (categories) {
      if (!Array.isArray(categories)) {
        throw new Error("복지 데이터는 카테고리 배열이어야 합니다.");
      }

      var fragment = document.createDocumentFragment();
      categories.forEach(function (category, categoryIndex) {
        if (!category || typeof category !== "object") {
          throw new Error(
            "복지 카테고리 데이터 형식이 올바르지 않습니다.",
          );
        }
        requireText(category.category, "category");
        requireText(
          category.category_description,
          "category_description",
        );
        if (!Array.isArray(category.items)) {
          throw new Error(
            "복지 카테고리의 items 값은 배열이어야 합니다.",
          );
        }

        var section = document.createElement("section");
        var headingId = "welfare-category-title-" + categoryIndex;
        section.className = "welfare__category";
        section.setAttribute("aria-labelledby", headingId);

        var header = document.createElement("header");
        header.className = "welfare__lead";

        var heading = document.createElement("h3");
        heading.className = "welfare__lead-title";
        heading.id = headingId;
        heading.textContent = category.category;
        header.appendChild(heading);

        var description = document.createElement("p");
        description.className = "welfare__lead-desc";
        description.textContent = category.category_description;
        header.appendChild(description);
        section.appendChild(header);

        var list = document.createElement("ul");
        list.className = "welfare__list";
        category.items.forEach(function (item) {
          if (!item || typeof item !== "object") {
            throw new Error("복지 항목 데이터 형식이 올바르지 않습니다.");
          }
          requireText(item.title, "items.title");
          requireText(item.description, "items.description");

          var listItem = document.createElement("li");
          listItem.className = "welfare__item";

          var card = document.createElement("article");
          card.className = "welfare__card";

          var copy = document.createElement("div");
          copy.className = "welfare__copy";

          var title = document.createElement("h4");
          title.className = "welfare__card-title";
          title.textContent = item.title;
          copy.appendChild(title);

          var detail = document.createElement("p");
          detail.className = "welfare__card-desc";
          detail.textContent = item.description;
          copy.appendChild(detail);
          card.appendChild(copy);

          if (item.icon !== undefined) {
            requireText(item.icon, "items.icon");
            requireText(item.icon_alt, "items.icon_alt");
            var icon = document.createElement("img");
            icon.className = "welfare__icon";
            icon.src = item.icon;
            icon.alt = item.icon_alt;
            card.appendChild(icon);
          }

          listItem.appendChild(card);
          list.appendChild(listItem);
        });
        section.appendChild(list);
        fragment.appendChild(section);
      });

      categoriesContainer.appendChild(fragment);
      welfareScroll.setAttribute("aria-busy", "false");
    })
    .catch(function (error) {
      welfareScroll.setAttribute("aria-busy", "false");
      errorMessage.hidden = false;
      errorMessage.textContent =
        "복지 데이터를 불러오지 못했습니다. 웹 서버로 페이지를 열고 data/benefits.json 파일을 확인해 주세요.";
      console.error("복지 데이터 로딩에 실패했습니다.", error);
    });
})();

/* ================ 메인 비주얼 데스크톱 비율 축소 ================ */
/* 1440px 이하 데스크톱에서 메인 비주얼 내부 레이아웃을 비율대로 축소 */
(function () {
  var root = document.documentElement;
  var mv = document.getElementById("main_visual");

  function updateVisualScale() {
    var width = window.innerWidth;
    if (width > 1024 && width < 1440) {
      root.style.setProperty("--mv-scale", String(width / 1440));
      if (mv) mv.style.height = (900 * width) / 1440 + "px";
    } else {
      root.style.removeProperty("--mv-scale");
      if (mv) mv.style.removeProperty("height");
    }
  }

  updateVisualScale();
  window.addEventListener("resize", updateVisualScale);
})();

/* ================ 모바일 햄버거 메뉴 ================ */
/* 모바일 햄버거 메뉴 */
(function () {
  var toggle = document.querySelector(".gnb__toggle");
  var menu = document.getElementById("gnb");
  var close = menu && menu.querySelector(".gnb__close");
  var header = document.querySelector(".header");
  if (!header) {
    throw new Error("고정 헤더를 찾을 수 없습니다.");
  }

  if (!toggle || !menu || !close) return;

  var root = document.documentElement;
  var mq = window.matchMedia("(max-width: 390px)");

  function setOpen(open, restoreFocus) {
    menu.classList.toggle("is-open", open);
    root.classList.toggle("menu-open", open); // 배경 스크롤 잠금/해제
    header.classList.toggle("is-menu-open", open);
    if (open) {
      header.classList.remove("is-hidden");
    }
    toggle.setAttribute("aria-expanded", String(open));
    if (open) close.focus();
    else if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    setOpen(true);
  });
  close.addEventListener("click", function () {
    setOpen(false, true);
  });

  // 메뉴 링크 클릭 시 닫기
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // ESC 로 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open"))
      setOpen(false, true);
  });

  // 모바일 구간을 벗어나면 상태 초기화(스크롤 잠금 잔존 방지)
  function onChange(e) {
    if (!e.matches) setOpen(false);
  }
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();

/* ================ 연혁 섹션 펼치기/접기 ================ */
// 히스토리 섹션: 펼치기/접기 (초기 상태 = 전체 높이의 2/3만 노출 + 하단 페이드아웃)
(function () {
  var COLLAPSE_RATIO = 0.8 / 3; // 접힘 시 노출 비율 (필요 시 여기만 조정)
  var section = document.getElementById("history");
  if (!section) return;
  var body = document.getElementById("history-body");
  var flow = section.querySelector(".history-flow");
  var btn = section.querySelector(".history-toggle");
  var label = btn.querySelector(".history-toggle-label");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var collapsed = false;

  function fullHeight() {
    // 절대배치 데코가 scrollHeight 를 부풀리지 않도록 흐름 콘텐츠 높이를 기준으로 계산
    return flow.offsetHeight;
  }
  function collapsedHeight() {
    return Math.round(fullHeight() * COLLAPSE_RATIO);
  }
  function render() {
    section.classList.toggle("is-collapsed", collapsed);
    section.classList.toggle("is-expanded", !collapsed);
    btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    label.textContent = collapsed ? "펼치기" : "접기";
  }
  function collapse() {
    collapsed = true;
    // max-height:none → px 로 고정해야 transition 이 동작
    body.style.maxHeight = fullHeight() + "px";
    void body.offsetHeight; // reflow
    body.style.maxHeight = collapsedHeight() + "px";
    render();
    // 접힐 때 시선이 엉뚱한 곳에 머물지 않도록 섹션 상단으로 이동
    if (section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start",
      });
    }
  }
  function expand() {
    collapsed = false;
    body.style.maxHeight = fullHeight() + "px";
    render();
    function done(e) {
      if (e && e.propertyName !== "max-height") return;
      body.removeEventListener("transitionend", done);
      if (!collapsed) body.style.maxHeight = "none"; // 이후 리사이즈 시 자연 높이 유지
    }
    if (reduce.matches) done();
    else body.addEventListener("transitionend", done);
  }

  btn.addEventListener("click", function () {
    if (collapsed) expand();
    else collapse();
  });

  // 초기 상태: 접힘 (JS 미동작 시에는 전체 펼침 상태로 폴백)
  body.style.transition = "none";
  collapsed = true;
  body.style.maxHeight = collapsedHeight() + "px";
  render();
  void body.offsetHeight;
  body.style.transition = "";

  // 폰트/이미지 로딩·리사이즈로 높이가 바뀌면 접힘 높이 재계산
  function refit() {
    if (collapsed) {
      body.style.transition = "none";
      body.style.maxHeight = collapsedHeight() + "px";
      void body.offsetHeight;
      body.style.transition = "";
    }
  }
  if (window.ResizeObserver) new ResizeObserver(refit).observe(flow);
  else window.addEventListener("resize", refit);
})();

/* ================ 직무 분야 탭, 상세 아코디언 및 직무 모달 (#task-data, #popup-data 사용) ================ */
/* 직무 분야 탭, 상세 아코디언 및 직무 모달 */
(function () {
  var taskDataElement = document.getElementById("task-data");
  var popupDataElement = document.getElementById("popup-data");
  var panelsContainer = document.querySelector(".tasks__panels");
  if (!taskDataElement || !popupDataElement || !panelsContainer) {
    throw new Error(
      "직무 데이터, 팝업 데이터 또는 직무 패널을 찾을 수 없습니다.",
    );
  }

  var taskData = JSON.parse(taskDataElement.textContent);
  var popupData = JSON.parse(popupDataElement.textContent);
  var popupDataByTitle = Object.create(null);
  popupData.forEach(function (item) {
    if (
      !item.id ||
      !item.title ||
      !item.department ||
      !item.location ||
      !item.category ||
      !item.image ||
      !Array.isArray(item.job_description) ||
      !Array.isArray(item.qualifications) ||
      !Array.isArray(item.preferred)
    ) {
      throw new Error(
        "직무 팝업 데이터 항목의 필수 값이 올바르지 않습니다: " +
          (item.id || item.title || "제목 없음"),
      );
    }
    if (popupDataByTitle[item.title]) {
      throw new Error("중복된 직무 팝업 데이터입니다: " + item.title);
    }
    popupDataByTitle[item.title] = item;
  });

  var availableTabs = document.querySelectorAll("[data-task-tab]");
  panelsContainer.replaceChildren();

  var taskTitles = Object.create(null);
  taskData.forEach(function (category, categoryIndex) {
    var categoryId = category.category;
    var tab = document.querySelector(
      '[data-task-tab="' + categoryId + '"]',
    );
    if (!tab || !Array.isArray(category.details)) {
      throw new Error(
        "직무 데이터 항목을 화면에 연결할 수 없습니다: " + categoryId,
      );
    }

    tab.textContent = tab.textContent.trim();
    tab.setAttribute("aria-selected", String(categoryIndex === 0));
    tab.setAttribute("aria-controls", "tasks-panel-" + categoryId);

    var panel = document.createElement("div");
    panel.className = "tasks__panel";
    panel.id = "tasks-panel-" + categoryId;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.dataset.taskPanel = categoryId;
    panel.hidden = categoryIndex !== 0;

    category.details.forEach(function (detail) {
      if (
        !detail.location ||
        !Array.isArray(detail.fields) ||
        String(detail.count) !== String(detail.fields.length)
      ) {
        throw new Error(
          "직무 데이터의 근무지, 인원 또는 모집 분야가 올바르지 않습니다: " +
            categoryId,
        );
      }

      var group = document.createElement("details");
      group.className = "tasks__group";

      var summary = document.createElement("summary");
      summary.className = "tasks__group-title";
      var groupName = document.createElement("span");
      groupName.textContent = detail.location;
      var count = document.createElement("span");
      count.className = "tasks__count";
      count.textContent = String(detail.count);
      summary.append(groupName, count);
      group.appendChild(summary);

      var cards = document.createElement("div");
      cards.className = "tasks__cards";
      detail.fields.forEach(function (role) {
        if (!popupDataByTitle[role]) {
          throw new Error("직무 팝업 데이터를 찾을 수 없습니다: " + role);
        }
        taskTitles[role] = true;
        var card = document.createElement("button");
        card.className = "tasks__card";
        card.type = "button";
        card.dataset.taskRole = role;
        card.dataset.taskCategory = tab.textContent;
        card.dataset.taskLocation = detail.location;

        var label = document.createElement("span");
        label.textContent = role;
        var arrow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        arrow.setAttribute("viewBox", "0 0 24 24");
        arrow.setAttribute("fill", "none");
        arrow.setAttribute("aria-hidden", "true");
        var path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute("d", "M5 12h14M13 6l6 6-6 6");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        arrow.appendChild(path);
        card.append(label, arrow);
        cards.appendChild(card);
      });

      group.appendChild(cards);
      panel.appendChild(group);
    });

    panelsContainer.appendChild(panel);
  });

  popupData.forEach(function (item) {
    if (!taskTitles[item.title]) {
      throw new Error(
        "직무 카드 데이터를 찾을 수 없습니다: " + item.title,
      );
    }
  });

  if (taskData.length !== availableTabs.length) {
    throw new Error("직무 데이터와 메뉴 개수가 일치하지 않습니다.");
  }

  var tabs = Array.prototype.slice.call(
    document.querySelectorAll("[data-task-tab]"),
  );
  var panels = Array.prototype.slice.call(
    document.querySelectorAll("[data-task-panel]"),
  );
  var modal = document.getElementById("tasks-modal");
  var dialog = modal && modal.querySelector(".tasks-modal__dialog");
  var closeButton = modal && modal.querySelector(".tasks-modal__close");
  if (!tabs.length || !panels.length || !modal || !dialog || !closeButton)
    return;

  var accordionStates = new WeakMap();
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  function animateGroup(group, open) {
    var content = group.querySelector(".tasks__accordion-content");
    var state = accordionStates.get(group);
    if (!content) return;
    if (!state) {
      state = { targetOpen: null, timer: null, onTransitionEnd: null };
      accordionStates.set(group, state);
    }

    if (state.timer) window.clearTimeout(state.timer);
    if (state.onTransitionEnd) {
      content.removeEventListener("transitionend", state.onTransitionEnd);
    }

    var currentHeight = content.getBoundingClientRect().height;
    state.targetOpen = open;
    if (open) group.open = true;

    function finish() {
      if (state.onTransitionEnd) {
        content.removeEventListener(
          "transitionend",
          state.onTransitionEnd,
        );
      }
      if (state.timer) window.clearTimeout(state.timer);
      state.onTransitionEnd = null;
      state.timer = null;
      group.open = open;
      content.style.height = open ? "auto" : "0px";
      state.targetOpen = null;
    }

    if (reduceMotion.matches) {
      finish();
      return;
    }

    content.style.transition = "none";
    content.style.height = currentHeight + "px";
    void content.offsetHeight;
    content.style.transition = "";

    state.onTransitionEnd = function (event) {
      if (event.target === content && event.propertyName === "height")
        finish();
    };
    content.addEventListener("transitionend", state.onTransitionEnd);

    window.requestAnimationFrame(function () {
      content.style.height = open ? content.scrollHeight + "px" : "0px";
    });
    state.timer = window.setTimeout(finish, 450);
  }

  document.querySelectorAll(".tasks__group").forEach(function (group) {
    var cards = group.querySelector(".tasks__cards");
    if (cards) {
      var content = document.createElement("div");
      content.className = "tasks__accordion-content";
      group.insertBefore(content, cards);
      content.appendChild(cards);
    }

    group
      .querySelector("summary")
      .addEventListener("click", function (event) {
        event.preventDefault();
        var state = accordionStates.get(group);
        var open =
          state && state.targetOpen !== null
            ? !state.targetOpen
            : !group.open;

        if (open) {
          document
            .querySelectorAll(".tasks__group[open]")
            .forEach(function (other) {
              if (other !== group) animateGroup(other, false);
            });
        }
        animateGroup(group, open);
      });

    group
      .querySelector("summary")
      .addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          group.querySelector("summary").click();
        }
      });
  });

  var title = document.getElementById("tasks-modal-title");
  var category = document.getElementById("tasks-modal-category");
  var location = document.getElementById("tasks-modal-location");
  var employment = document.getElementById("tasks-modal-employment");
  var description = document.getElementById("tasks-modal-description");
  var qualifications = document.getElementById(
    "tasks-modal-qualifications",
  );
  var preferredSection = document.getElementById(
    "tasks-modal-preferred-section",
  );
  var preferred = document.getElementById("tasks-modal-preferred");
  var visual = modal.querySelector(".tasks-modal__visual");
  var modalBody = document.getElementById("tasks-modal-body");
  var previousFocus = null;
  var currentImagePath = null;
  var imageLoaders = Object.create(null);

  function setList(list, values) {
    list.replaceChildren();
    values.forEach(function (value) {
      var item = document.createElement("li");
      item.textContent = value;
      list.appendChild(item);
    });
  }

  function openModal(card) {
    var data = popupDataByTitle[card.dataset.taskRole];
    if (!data) {
      throw new Error(
        "직무 팝업 데이터를 찾을 수 없습니다: " + card.dataset.taskRole,
      );
    }

    previousFocus = card;
    title.textContent = data.title;
    category.textContent = data.department;
    location.textContent = data.location;
    employment.textContent = data.category;
    setList(description, data.job_description);
    setList(qualifications, data.qualifications);
    setList(preferred, data.preferred);
    preferredSection.hidden = data.preferred.length === 0;
    modalBody.scrollTop = 0;
    currentImagePath = data.image;
    visual.style.backgroundImage = 'url("./images/tasks_rnd_bg.jpg")';
    if (!imageLoaders[data.image]) {
      var image = new Image();
      imageLoaders[data.image] = image;
      image.onload = function () {
        if (currentImagePath === data.image) {
          visual.style.backgroundImage =
            "url(" + JSON.stringify(image.src) + ")";
        }
      };
      image.onerror = function () {
        console.warn(
          "직무 팝업 이미지를 불러오지 못했습니다. 기본 이미지를 표시합니다: " +
            data.image,
        );
      };
      image.src = data.image;
    } else if (
      imageLoaders[data.image].complete &&
      imageLoaders[data.image].naturalWidth
    ) {
      visual.style.backgroundImage =
        "url(" + JSON.stringify(imageLoaders[data.image].src) + ")";
    }
    modal.hidden = false;
    document.documentElement.classList.add("menu-open");
    closeButton.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove("menu-open");
    if (previousFocus) previousFocus.focus();
  }

  tabs.forEach(function (tab, index) {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    tab.addEventListener("click", function () {
      var selected = tab.dataset.taskTab;
      tabs.forEach(function (item) {
        var active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.taskPanel !== selected;
      });
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;
      if (event.key === "ArrowRight")
        nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      else return;
      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  document.querySelectorAll(".tasks__card").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card);
    });
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
    if (event.key === "Tab" && !modal.hidden) {
      var focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();

/* ================ 스크롤 방향에 따라 헤더 표시/숨김 ================ */
(function () {
  var header = document.querySelector(".header");
  var menu = document.getElementById("gnb");
  if (!header) {
    throw new Error("고정 헤더를 찾을 수 없습니다.");
  }

  var previousScrollY = Math.max(0, window.scrollY);
  var accumulatedScrollDelta = 0;
  var scrollDirection = 0;
  var scrollThreshold = 6;

  function updateHeaderVisibility() {
    var currentScrollY = Math.max(0, window.scrollY);
    var scrollDelta = currentScrollY - previousScrollY;
    var nextDirection = Math.sign(scrollDelta);
    var menuOpen = menu && menu.classList.contains("is-open");

    if (currentScrollY === 0) {
      accumulatedScrollDelta = 0;
      scrollDirection = 0;
      header.classList.remove("is-hidden", "is-visible");
    } else if (menuOpen) {
      accumulatedScrollDelta = 0;
      scrollDirection = 0;
      header.classList.remove("is-hidden");
      header.classList.add("is-menu-open");
    } else if (nextDirection !== 0) {
      if (nextDirection !== scrollDirection) {
        accumulatedScrollDelta = 0;
        scrollDirection = nextDirection;
      }
      accumulatedScrollDelta += scrollDelta;

      if (accumulatedScrollDelta > scrollThreshold) {
        header.classList.add("is-hidden");
        header.classList.remove("is-visible", "is-menu-open");
        accumulatedScrollDelta = 0;
      } else if (accumulatedScrollDelta < -scrollThreshold) {
        header.classList.remove("is-hidden", "is-menu-open");
        header.classList.add("is-visible");
        accumulatedScrollDelta = 0;
      }
    }

    previousScrollY = currentScrollY;
  }

  window.addEventListener("scroll", updateHeaderVisibility, {
    passive: true,
  });
  updateHeaderVisibility();
})();

/* ================ 스크롤 리빌 효과 ================ */
(function () {
  var revealTargets = [
    "#mirae .mirae__title",
    "#history .history-head",
    "#history .history-block",
    "#jobs .jobs__header",
    "#jobs .jobs__item",
    "#jobs .jobs__more",
    "#news .news__header",
    "#news .news__item",
    "#welfare .welfare__header",
    "#welfare .welfare__item",
    "#tasks .tasks__intro",
    "#tasks .tasks__tab",
    "#tasks .tasks__card",
    "#requirement .requirement__title",
    "#requirement .requirement__tabs",
    "#requirement .requirement__candidate",
    "#requirement .requirement__bullets li",
    "#requirement .requirement__notice",
    "#requirement .requirement__process-group",
    "#exposition .exposition__intro",
    "#exposition .exposition__tab",
    "#exposition .exposition__region",
    "#exposition .exposition__day",
  ];
  var delayByParent = new Map();
  var targetSelector = revealTargets.join(", ");
  var observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              entry.target.classList.toggle(
                "is-revealed",
                entry.isIntersecting,
              );
            });
          },
          {
            root: null,
            rootMargin: "-20% 0px -20% 0px",
            threshold: 0,
          },
        )
      : null;

  function prepareTargets(newTargets) {
    newTargets = newTargets.filter(function (target) {
      return !target.classList.contains("scroll-reveal");
    });
    if (!newTargets.length) return;

    newTargets.forEach(function (target) {
      var parent = target.parentElement;
      var delay = delayByParent.get(parent) || 0;
      target.style.setProperty("--reveal-delay", delay + "ms");
      delayByParent.set(parent, Math.min(delay + 70, 350));
      target.classList.add("scroll-reveal");
    });

    if (observer) {
      document.documentElement.offsetHeight;
      newTargets.forEach(function (target) {
        target.classList.add("is-ready");
        observer.observe(target);
      });
    } else {
      newTargets.forEach(function (target) {
        target.classList.add("is-revealed", "is-ready");
      });
    }
  }

  prepareTargets(
    Array.prototype.slice.call(document.querySelectorAll(targetSelector)),
  );

  var exposition = document.querySelector("#exposition");
  if (observer && exposition) {
    var targetChanges = new MutationObserver(function (mutations) {
      var addedTargets = [];
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(
          mutation.removedNodes,
          function (node) {
            if (node.nodeType !== 1) return;
            var removedTargets = [];
            if (node.matches(".scroll-reveal")) {
              removedTargets.push(node);
            }
            removedTargets = removedTargets.concat(
              Array.prototype.slice.call(
                node.querySelectorAll(".scroll-reveal"),
              ),
            );
            removedTargets.forEach(function (target) {
              if (!target.isConnected) observer.unobserve(target);
            });
          },
        );
        Array.prototype.forEach.call(
          mutation.addedNodes,
          function (node) {
            if (node.nodeType !== 1) return;
            if (node.matches(targetSelector)) addedTargets.push(node);
            addedTargets = addedTargets.concat(
              Array.prototype.slice.call(
                node.querySelectorAll(targetSelector),
              ),
            );
          },
        );
      });
      prepareTargets(addedTargets);
    });
    targetChanges.observe(exposition, {
      childList: true,
      subtree: true,
    });
  }
})();

/* ================ 부드러운 스크롤 (휠 보정) 및 토글 체크박스 ================ */
(function () {
  var toggle = document.getElementById("scroll-smoothing-toggle");
  var root = document.documentElement;
  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  if (!toggle) return;

  var duration = 360;
  var frameRequest = 0;
  var startY = window.scrollY;
  var targetY = startY;
  var startTime = 0;

  function stopAnimation() {
    if (frameRequest) window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    startY = window.scrollY;
    targetY = startY;
  }

  function updateMode() {
    if (reducedMotion.matches) toggle.checked = true;
    root.style.scrollBehavior = toggle.checked ? "auto" : "smooth";
    if (toggle.checked) stopAnimation();
  }

  function hasScrollableAncestor(target, deltaY) {
    var element =
      target instanceof Element ? target : target && target.parentElement;
    while (element && element !== document.body && element !== root) {
      var style = window.getComputedStyle(element);
      var canScroll = /(auto|scroll|overlay)/.test(style.overflowY);
      if (canScroll && element.scrollHeight > element.clientHeight + 1) {
        if (
          (deltaY > 0 &&
            element.scrollTop + element.clientHeight <
              element.scrollHeight - 1) ||
          (deltaY < 0 && element.scrollTop > 0)
        ) {
          return true;
        }
      }
      element = element.parentElement;
    }
    return false;
  }

  function animateScroll(timestamp) {
    if (toggle.checked || reducedMotion.matches) {
      stopAnimation();
      return;
    }

    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var nextY = startY + (targetY - startY) * eased;
    window.scrollTo({ top: nextY, behavior: "instant" });

    if (progress < 1) {
      frameRequest = window.requestAnimationFrame(animateScroll);
    } else if (Math.abs(targetY - window.scrollY) > 1) {
      startY = window.scrollY;
      startTime = timestamp;
      frameRequest = window.requestAnimationFrame(animateScroll);
    } else {
      frameRequest = 0;
      startY = window.scrollY;
      targetY = startY;
    }
  }

  function onWheel(event) {
    if (
      toggle.checked ||
      reducedMotion.matches ||
      root.classList.contains("menu-open") ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    var deltaY = event.deltaY;
    if (event.deltaMode === 1) deltaY *= 16;
    else if (event.deltaMode === 2) deltaY *= window.innerHeight;
    if (
      !deltaY ||
      Math.abs(event.deltaX) > Math.abs(deltaY) ||
      hasScrollableAncestor(event.target, deltaY)
    ) {
      return;
    }

    var maxY = Math.max(0, root.scrollHeight - window.innerHeight);
    var baseY = frameRequest ? targetY : window.scrollY;
    var nextTargetY = Math.max(0, Math.min(maxY, baseY + deltaY));
    if (nextTargetY === baseY) return;

    event.preventDefault();
    targetY = nextTargetY;
    if (!frameRequest) {
      startY = window.scrollY;
      startTime = performance.now();
      frameRequest = window.requestAnimationFrame(animateScroll);
    }
  }

  toggle.checked = reducedMotion.matches;
  updateMode();
  toggle.addEventListener("change", updateMode);
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", function (event) {
      if (event.matches) toggle.checked = true;
      updateMode();
    });
  } else if (reducedMotion.addListener) {
    reducedMotion.addListener(function (event) {
      if (event.matches) toggle.checked = true;
      updateMode();
    });
  }
  window.addEventListener("wheel", onWheel, { passive: false });
})();
