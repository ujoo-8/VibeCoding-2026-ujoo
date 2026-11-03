export function buildCampusRegions(data, campusScheduleData) {
  const campusRegions = data.regions.map((region) => ({
    name: region.name,
    schedule: [],
  }));
  const campusRegionMap = new Map();
  campusRegions.forEach((region) => campusRegionMap.set(region.name, region));
  const campusDays = new Map();

  Object.keys(campusScheduleData).forEach((regionName) => {
    const records = campusScheduleData[regionName];
    if (!Array.isArray(records)) {
      throw new Error(`${regionName} 캠퍼스 일정은 배열이어야 합니다.`);
    }
    let region = campusRegionMap.get(regionName);
    if (!region) {
      region = { name: regionName, schedule: [] };
      campusRegionMap.set(region.name, region);
      campusRegions.push(region);
    }
    records.forEach((record) => {
      let regionDayMap = campusDays.get(region.name);
      if (!regionDayMap) {
        regionDayMap = new Map();
        campusDays.set(region.name, regionDayMap);
      }
      let day = regionDayMap.get(record.date);
      if (!day) {
        day = { date: record.date, events: [] };
        regionDayMap.set(record.date, day);
        region.schedule.push(day);
      }
      const event = { name: record.university };
      if (record.place) event.location = record.place;
      if (record.time) event.time = record.time;
      day.events.push(event);
    });
  });

  campusRegions.forEach((region) => {
    region.schedule.sort((left, right) => {
      const leftDate = left.date.match(/^(\d+)월\s*(\d+)일/);
      const rightDate = right.date.match(/^(\d+)월\s*(\d+)일/);
      if (!leftDate || !rightDate) {
        throw new Error("캠퍼스 일정 날짜 형식이 올바르지 않습니다.");
      }
      return Number(leftDate[1]) - Number(rightDate[1]) || Number(leftDate[2]) - Number(rightDate[2]);
    });
    if (!region.schedule.length) return;

    const scheduledDays = new Map(region.schedule.map((day) => [day.date, day]));
    const lastDate = region.schedule[region.schedule.length - 1].date.match(/^(\d+)월\s*(\d+)일/);
    const firstDate = region.schedule[0].date.match(/^(\d+)월\s*(\d+)일/);
    const firstScheduledDate = Date.UTC(2026, Number(firstDate[1]) - 1, Number(firstDate[2]));
    const lastScheduledDate = Date.UTC(2026, Number(lastDate[1]) - 1, Number(lastDate[2]));
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const calendarDays = [];
    const firstWeekday = new Date(firstScheduledDate).getUTCDay();
    const weekStart = firstScheduledDate - ((firstWeekday + 6) % 7) * 24 * 60 * 60 * 1000;
    const lastWeekday = new Date(lastScheduledDate).getUTCDay();
    const lastWeekStart = lastScheduledDate - ((lastWeekday + 6) % 7) * 24 * 60 * 60 * 1000;

    for (
      let weekTimestamp = weekStart;
      weekTimestamp <= lastWeekStart;
      weekTimestamp += 7 * 24 * 60 * 60 * 1000
    ) {
      const weekDays = [];
      let weekHasEvents = false;
      for (let dayIndex = 0; dayIndex < 5; dayIndex += 1) {
        const dayTimestamp = weekTimestamp + dayIndex * 24 * 60 * 60 * 1000;
        const calendarDate = new Date(dayTimestamp);
        const month = calendarDate.getUTCMonth() + 1;
        const dateNumber = calendarDate.getUTCDate();
        const dateLabel = `${month}월 ${dateNumber}일 (${weekdays[calendarDate.getUTCDay()]})`;
        const scheduledDay = scheduledDays.get(dateLabel);
        const isOutsideScheduleRange =
          dayTimestamp < firstScheduledDate || dayTimestamp > lastScheduledDate;
        const weekDay = isOutsideScheduleRange
          ? { date: "", events: [] }
          : scheduledDay || { date: dateLabel, events: [] };
        weekDays.push(weekDay);
        if (scheduledDay && scheduledDay.events.length) weekHasEvents = true;
      }
      if (weekHasEvents) calendarDays.push(...weekDays);
    }
    region.schedule = calendarDays;
  });

  return campusRegions;
}
