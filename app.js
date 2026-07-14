const modeConfig = {
  daily: {
    zh: "学生日常安排",
    en: "Daily Student Schedule",
    categories: [
      ["activity", "活动 Activity", "#18a058"],
      ["study", "学习 Study", "#246bfe"],
      ["exam", "考试 Exam", "#f05d5e"],
      ["portfolio", "作品集 Portfolio", "#ec4899"],
      ["ielts", "雅思备考 IELTS Prep", "#0f766e"],
      ["meeting", "面谈 Meeting", "#16a3a3"],
    ],
    samples: [
      ["2026-06-03", "完成阅读清单", "Finish reading list", "study"],
      ["2026-06-08", "参加校内活动", "Join school activity", "activity"],
      ["2026-06-14", "整理作品集素材", "Organize portfolio materials", "portfolio"],
      ["2026-06-22", "月度复盘会议", "Monthly review meeting", "meeting"],
    ],
  },
  application: {
    zh: "申请季安排",
    en: "Application Season Plan",
    categories: [
      ["essay", "文书 Essay", "#7c5cff"],
      ["resume", "简历 Resume", "#18a058"],
      ["recommendation", "推荐信 Recommendation", "#f5a524"],
      ["transcript", "成绩单 Transcript", "#246bfe"],
      ["submit", "递交 Submit", "#f05d5e"],
      ["exam", "考试 Exam", "#16a3a3"],
      ["portfolio", "作品集 Portfolio", "#ec4899"],
      ["ielts", "雅思备考 IELTS Prep", "#0f766e"],
    ],
    samples: [
      ["2026-06-04", "完成简历初稿", "Complete resume draft", "resume"],
      ["2026-06-10", "完成主文书初稿", "Complete main essay draft", "essay"],
      ["2026-06-18", "收集成绩单与证明", "Collect transcripts and certificates", "transcript"],
      ["2026-06-26", "检查网申材料", "Review application portal materials", "submit"],
    ],
  },
};

const defaultStudentName = "张子瑶";

const zhangZiyaoApplicationPlan = {
  month: "2026-07",
  students: [{ id: "s1", name: defaultStudentName }],
  activeStudentId: "s1",
  categories: [
    ["essay", "文书 Essay", "#7c5cff"],
    ["resume", "简历 Resume", "#18a058"],
    ["recommendation", "推荐信 Recommendation", "#f5a524"],
    ["transcript", "成绩单 Transcript", "#246bfe"],
    ["submit", "递交 Submit", "#f05d5e"],
    ["exam", "考试 Exam", "#16a3a3"],
    ["application-form", "申请表格 Application Form", "#246bfe"],
    ["portfolio", "作品集 Portfolio", "#ec4899"],
    ["ielts", "雅思备考 IELTS Prep", "#0f766e"],
  ],
  tasks: [
    ["2026-07-10", "2026-08-21", "备考SAT", "", "exam", "#16a3a3", "备考SAT"],
    ["2026-07-15", "2026-07-15", "UCAS表格注册", "", "application-form", "#246bfe", ""],
    ["2026-08-01", "2026-08-02", "Common UC系统开始填写", "", "application-form", "#246bfe", ""],
    ["2026-08-22", "2026-08-22", "SAT", "", "exam", "#16a3a3", ""],
    ["2026-09-15", "2026-09-15", "推荐信", "", "recommendation", "#f5a524", "推荐信完成"],
    ["2026-10-01", "2026-10-01", "UCAS 申请递交", "", "submit", "#f05d5e", ""],
    ["2026-10-03", "2026-10-03", "SAT", "", "exam", "#16a3a3", ""],
    ["2026-10-05", "2026-10-05", "Common文书活动列表定稿", "", "essay", "#7c5cff", ""],
    ["2026-10-15", "2026-10-15", "UCAS截止", "", "submit", "#f05d5e", ""],
    ["2026-11-01", "2026-11-01", "ED1递交", "", "submit", "#f05d5e", ""],
    ["2026-11-15", "2026-11-15", "UC递交", "", "submit", "#f05d5e", ""],
    ["2026-11-30", "2026-11-30", "UC截止", "", "submit", "#f05d5e", ""],
  ],
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const state = {
  mode: "daily",
  activeStudentId: "s1",
  students: [
    { id: "s1", name: defaultStudentName },
  ],
  categories: [],
  tasks: [],
  month: "2026-06",
  dragStart: null,
  dragEnd: null,
  isDragging: false,
  ganttDragStudentId: null,
  autoScrollFrame: null,
  lastPointer: null,
  lastAutoMonthShift: 0,
};

const els = {
  modeScreen: document.querySelector("#modeScreen"),
  planner: document.querySelector("#planner"),
  modeLabel: document.querySelector("#modeLabel"),
  plannerTitle: document.querySelector("#plannerTitle"),
  printMode: document.querySelector("#printMode"),
  ganttTitle: document.querySelector("#ganttTitle"),
  monthTitle: document.querySelector("#monthTitle"),
  monthPicker: document.querySelector("#monthPicker"),
  studentStrip: document.querySelector("#studentStrip"),
  studentSelect: document.querySelector("#studentSelect"),
  categorySelect: document.querySelector("#taskCategory"),
  categoryTable: document.querySelector("#categoryTable"),
  addCategory: document.querySelector("#addCategory"),
  calendarGrid: document.querySelector("#calendarGrid"),
  timeline: document.querySelector("#timeline"),
  ganttBoard: document.querySelector("#ganttBoard"),
  rangeHint: document.querySelector("#rangeHint"),
  legend: document.querySelector("#legend"),
  ganttLegend: document.querySelector("#ganttLegend"),
  form: document.querySelector("#taskForm"),
  taskId: document.querySelector("#taskId"),
  taskDate: document.querySelector("#taskDate"),
  taskEndDate: document.querySelector("#taskEndDate"),
  taskZh: document.querySelector("#taskZh"),
  taskEn: document.querySelector("#taskEn"),
  taskNotes: document.querySelector("#taskNotes"),
  taskColor: document.querySelector("#taskColor"),
  deleteTask: document.querySelector("#deleteTask"),
  saveAsNewTask: document.querySelector("#saveAsNewTask"),
  deleteStudent: document.querySelector("#deleteStudent"),
};

function storageKey() {
  return `student-calendar-${state.mode}`;
}

function loadMode(mode) {
  state.mode = mode;
  const stored = localStorage.getItem(storageKey());
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (stored) {
    const parsed = JSON.parse(stored);
    state.students = parsed.students || state.students;
    state.categories = parsed.categories || defaultCategories(mode);
    state.tasks = parsed.tasks || [];
    state.month = parsed.month || currentMonth;
    state.activeStudentId = parsed.activeStudentId || state.students[0].id;
    normalizeDefaultStudents();
    ensureRequiredCategories(mode);
    applyZhangZiyaoPlanSeedIfNeeded(mode);
    if (!state.students.some((student) => student.id === state.activeStudentId)) {
      state.activeStudentId = state.students[0]?.id || "s1";
    }
  } else {
    loadDefaultModeData(mode, currentMonth);
  }
  els.modeScreen.classList.add("hidden");
  els.planner.classList.remove("hidden");
  render();
}

function loadDefaultModeData(mode, currentMonth) {
  if (mode === "application") {
    applyZhangZiyaoApplicationPlan();
    return;
  }

  state.students = [{ id: "s1", name: defaultStudentName }];
  state.activeStudentId = "s1";
  state.categories = defaultCategories(mode);
  ensureRequiredCategories(mode);
  state.month = currentMonth;
  state.tasks = modeConfig[mode].samples.map((sample) => ({
    id: crypto.randomUUID(),
    studentId: "s1",
    date: sample[0],
    endDate: sample[0],
    zh: sample[1],
    en: sample[2],
    category: sample[3],
    color: getCategoryColor(mode, sample[3]),
    notes: "",
  }));
}

function save() {
  localStorage.setItem(
    storageKey(),
    JSON.stringify({
      students: state.students,
      tasks: state.tasks,
      month: state.month,
      activeStudentId: state.activeStudentId,
      categories: state.categories,
    }),
  );
}

function getCategory(categoryId) {
  return state.categories.find(([id]) => id === categoryId) || state.categories[0] || defaultCategories(state.mode)[0];
}

function getCategoryColor(mode, categoryId) {
  const category = modeConfig[mode].categories.find(([id]) => id === categoryId) || modeConfig[mode].categories[0];
  return category[2];
}

function defaultCategories(mode) {
  return modeConfig[mode].categories.map((category) => [...category]);
}

function applyZhangZiyaoApplicationPlan() {
  state.students = zhangZiyaoApplicationPlan.students.map((student) => ({ ...student }));
  state.activeStudentId = zhangZiyaoApplicationPlan.activeStudentId;
  state.month = zhangZiyaoApplicationPlan.month;
  state.categories = zhangZiyaoApplicationPlan.categories.map((category) => [...category]);
  state.tasks = zhangZiyaoApplicationPlan.tasks.map((task, index) => ({
    id: `zyy-application-${index + 1}`,
    studentId: "s1",
    date: task[0],
    endDate: task[1],
    zh: task[2],
    en: task[3],
    category: task[4],
    color: task[5],
    notes: task[6],
  }));
}

function applyZhangZiyaoPlanSeedIfNeeded(mode) {
  if (mode !== "application") return;
  const hasZhangPlan = state.tasks.some((task) =>
    ["UCAS表格注册", "备考SAT", "ED1递交", "Common UC系统开始填写"].includes(task.zh),
  );
  if (hasZhangPlan) {
    const zhangStudent = state.students.find((student) => student.name === defaultStudentName);
    if (zhangStudent) state.activeStudentId = zhangStudent.id;
    return;
  }

  const looksLikeDemoData = state.tasks.length <= 4 && state.tasks.every((task) => task.date?.startsWith("2026-06"));
  const hasOnlyPlaceholderStudent =
    state.students.length === 1 && ["学生姓名", defaultStudentName].includes(state.students[0].name);
  if (looksLikeDemoData || hasOnlyPlaceholderStudent) {
    applyZhangZiyaoApplicationPlan();
  }
}

function ensureRequiredCategories(mode) {
  const required = modeConfig[mode].categories.filter(([id]) => id === "portfolio" || id === "ielts");
  required.forEach(([id, label, color]) => {
    const existing = state.categories.find((category) => category[0] === id);
    if (!existing) {
      state.categories.push([id, label, color]);
      return;
    }
    if (id === "portfolio" && existing[1] === "作品 Portfolio") {
      existing[1] = label;
      existing[2] = color;
    }
  });
}

function render() {
  const config = modeConfig[state.mode];
  els.modeLabel.textContent = config.en;
  els.plannerTitle.textContent = config.zh;
  els.printMode.textContent = `${config.zh} · ${config.en}`;
  els.ganttTitle.textContent = currentStudentDisplayName();
  els.monthPicker.value = state.month;
  renderStudents();
  renderCategories();
  renderLegend();
  renderCalendar();
  renderTimeline();
  renderGanttTimeline();
  updateDeleteButton();
  updateDeleteStudentButton();
  save();
}

function normalizeDefaultStudents() {
  const hasOnlyDefaultStudents =
    state.students.length === 2 &&
    state.students.some((student) => student.id === "s1" && student.name === "Student A / 学生A") &&
    state.students.some((student) => student.id === "s2" && student.name === "Student B / 学生B");
  if (hasOnlyDefaultStudents) {
    state.students = [{ id: "s1", name: defaultStudentName }];
    state.tasks = state.tasks.map((task) => ({ ...task, studentId: "s1" }));
    state.activeStudentId = "s1";
    return;
  }
  const hasOnlyPlaceholderStudent = state.students.length === 1 && state.students[0].name === "学生姓名";
  if (hasOnlyPlaceholderStudent) {
    state.students[0].name = defaultStudentName;
  }
}

function renderStudents() {
  els.studentStrip.innerHTML = "";
  els.studentSelect.innerHTML = "";
  state.students.forEach((student) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `student-chip ${student.id === state.activeStudentId ? "active" : ""}`;
    chip.textContent = student.name;
    chip.addEventListener("click", () => {
      state.activeStudentId = student.id;
      clearForm();
      render();
    });
    els.studentStrip.append(chip);

    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = student.name;
    els.studentSelect.append(option);
  });
  els.studentSelect.value = state.activeStudentId;
}

function renderCategories() {
  const currentValue = els.categorySelect.value;
  els.categorySelect.innerHTML = "";
  state.categories.forEach(([id, label]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = label;
    els.categorySelect.append(option);
  });
  if (state.categories.some(([id]) => id === currentValue)) {
    els.categorySelect.value = currentValue;
  }
  renderCategoryTable();
}

function renderLegend() {
  [els.legend, els.ganttLegend].forEach((legend) => {
    if (legend) legend.innerHTML = "";
  });
  state.categories.forEach(([, label, color]) => {
    [els.legend, els.ganttLegend].forEach((legend) => {
      if (!legend) return;
      const item = document.createElement("span");
      item.innerHTML = `<i style="background:${color}"></i>${label}`;
      legend.append(item);
    });
  });
}

function renderCategoryTable() {
  els.categoryTable.innerHTML = "";
  state.categories.forEach(([id, label, color], index) => {
    const row = document.createElement("div");
    row.className = "category-row";
    row.innerHTML = `
      <input class="category-name-input" value="${escapeAttribute(label)}" aria-label="类别名称" />
      <input class="category-color-input" type="color" value="${color}" aria-label="类别颜色" />
      <button type="button" class="category-delete" ${state.categories.length <= 1 ? "disabled" : ""}>删除</button>
    `;
    row.querySelector(".category-name-input").addEventListener("change", (event) => {
      state.categories[index][1] = event.target.value.trim() || label;
      render();
    });
    row.querySelector(".category-color-input").addEventListener("change", (event) => {
      state.categories[index][2] = event.target.value;
      if (els.categorySelect.value === id) els.taskColor.value = event.target.value;
      render();
    });
    row.querySelector(".category-delete").addEventListener("click", () => deleteCategory(id));
    els.categoryTable.append(row);
  });
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function deleteCategory(categoryId) {
  if (state.categories.length <= 1) return;
  const fallback = state.categories.find(([id]) => id !== categoryId);
  state.categories = state.categories.filter(([id]) => id !== categoryId);
  state.tasks = state.tasks.map((task) =>
    task.category === categoryId ? { ...task, category: fallback[0], color: task.color || fallback[2] } : task,
  );
  if (els.categorySelect.value === categoryId) {
    els.categorySelect.value = fallback[0];
    els.taskColor.value = fallback[2];
  }
  render();
}

function renderCalendar() {
  els.calendarGrid.innerHTML = "";
  els.calendarGrid.className = "calendar-grid year-calendar";
  const [year, month] = state.month.split("-").map(Number);
  const rangeStart = new Date(year, month - 1, 1);
  const rangeEnd = new Date(year, month + 10, 1);
  const title = `${formatMonthLabel(rangeStart)} - ${formatMonthLabel(rangeEnd)} · One Year Calendar`;
  els.monthTitle.textContent = title;

  for (let offset = 0; offset < 12; offset += 1) {
    const monthDate = new Date(year, month - 1 + offset, 1);
    els.calendarGrid.append(monthCalendar(monthDate));
  }
}

function monthCalendar(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const today = new Date().toISOString().slice(0, 10);

  const wrapper = document.createElement("section");
  wrapper.className = "month-calendar";

  const heading = document.createElement("header");
  heading.className = "month-calendar-heading";
  heading.innerHTML = `<strong>${year}年${month + 1}月</strong><span>${monthNames[month]} ${year}</span>`;
  wrapper.append(heading);

  const weekdays = document.createElement("div");
  weekdays.className = "mini-weekday-row";
  weekdays.innerHTML = `
    <span>Sun 日</span><span>Mon 一</span><span>Tue 二</span><span>Wed 三</span>
    <span>Thu 四</span><span>Fri 五</span><span>Sat 六</span>
  `;
  wrapper.append(weekdays);

  const grid = document.createElement("div");
  grid.className = "month-day-grid";

  for (let index = 0; index < 42; index += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const dateKey = toDateKey(day);
    const isCurrentMonth = day.getMonth() === month;
    const cell = document.createElement("div");
    cell.className = `day-cell ${!isCurrentMonth ? "outside" : ""} ${dateKey === today ? "today" : ""}`;
    if (isCurrentMonth) {
      cell.dataset.date = dateKey;
      cell.addEventListener("pointerdown", (event) => beginDateSelection(event, dateKey));
      cell.addEventListener("pointerenter", () => extendDateSelection(dateKey));
      cell.addEventListener("pointerup", () => finishDateSelection(dateKey));
    }

    const number = document.createElement("div");
    number.className = "day-number";
    number.innerHTML = `<span>${day.getDate()}</span>`;
    cell.append(number);
    grid.append(cell);
  }

  renderMonthTaskBars(grid, start, year, month);
  wrapper.append(grid);
  return wrapper;
}

function renderMonthTaskBars(grid, gridStart, year, month) {
  const monthStart = toDateKey(new Date(year, month, 1));
  const monthEnd = toDateKey(new Date(year, month + 1, 0));
  const monthTasks = state.tasks
    .filter((task) => task.studentId === state.activeStudentId && taskTouchesRange(task, monthStart, monthEnd))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.endDate || a.date).localeCompare(b.endDate || b.date));
  const laneUsage = new Map();
  let maxLane = 0;

  monthTasks.forEach((task) => {
    const taskStart = task.date < monthStart ? monthStart : task.date;
    const taskEnd = (task.endDate || task.date) > monthEnd ? monthEnd : task.endDate || task.date;
    let cursor = new Date(`${taskStart}T00:00:00`);
    const final = new Date(`${taskEnd}T00:00:00`);
    let segmentIndex = 0;

    while (cursor <= final) {
      const cursorKey = toDateKey(cursor);
      const dayOffset = daysBetween(toDateKey(gridStart), cursorKey);
      const row = Math.floor(dayOffset / 7);
      const col = cursor.getDay();
      const weekEnd = addDays(gridStart, row * 7 + 6);
      const segmentEnd = weekEnd < final ? weekEnd : final;
      const span = daysBetween(cursorKey, toDateKey(segmentEnd)) + 1;
      const lane = nextCalendarLane(laneUsage, row, col, col + span - 1);
      maxLane = Math.max(maxLane, lane);
      const [, categoryLabel, categoryColor] = getCategory(task.category);
      const color = task.color || categoryColor;
      const bar = document.createElement("button");
      bar.type = "button";
      bar.className = `calendar-range-bar ${segmentIndex === 0 ? "has-label" : "continuation"}`;
      bar.style.setProperty("--task-color", color);
      bar.style.setProperty("--row", row);
      bar.style.setProperty("--col", col);
      bar.style.setProperty("--span", span);
      bar.style.setProperty("--lane", lane);
      bar.title = `${task.zh}\n${formatRange(task)}\n${task.en || categoryLabel}`;
      bar.innerHTML = segmentIndex === 0 ? `<span>${task.zh}</span><small>${task.en || categoryLabel}</small>` : "";
      bar.addEventListener("pointerdown", (event) => event.stopPropagation());
      bar.addEventListener("click", (event) => {
        event.stopPropagation();
        editTask(task.id);
      });
      grid.append(bar);
      cursor = addDays(segmentEnd, 1);
      segmentIndex += 1;
    }
  });
  grid.style.setProperty("--calendar-cell-min", `${92 + maxLane * 26}px`);
}

function nextCalendarLane(laneUsage, row, startCol, endCol) {
  for (let lane = 0; lane < 18; lane += 1) {
    const key = `${row}-${lane}`;
    const ranges = laneUsage.get(key) || [];
    const hasOverlap = ranges.some(([start, end]) => startCol <= end && endCol >= start);
    if (!hasOverlap) {
      ranges.push([startCol, endCol]);
      laneUsage.set(key, ranges);
      return lane;
    }
  }
  return 17;
}

function taskButton(task) {
  const [, categoryLabel, categoryColor] = getCategory(task.category);
  const color = task.color || categoryColor;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "task-pill";
  button.style.setProperty("--task-color", color);
  button.title = `${task.zh}\n${task.en || ""}`;
  button.innerHTML = `<strong>${task.zh}</strong><small>${task.en || categoryLabel}</small>`;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    editTask(task.id);
  });
  return button;
}

function renderTimeline() {
  const items = state.tasks
    .filter((task) => task.studentId === state.activeStudentId && taskTouchesMonth(task, state.month))
    .sort((a, b) => a.date.localeCompare(b.date));
  els.timeline.innerHTML = "";

  if (!items.length) {
    els.timeline.innerHTML = `<div class="empty-state">这个学生本月还没有事项。双击日历某一天，或用左侧表单添加安排。</div>`;
    return;
  }

  items.forEach((task) => {
    const [, categoryLabel, categoryColor] = getCategory(task.category);
    const color = task.color || categoryColor;
    const item = document.createElement("article");
    item.className = "timeline-item";
    item.style.setProperty("--task-color", color);
    item.innerHTML = `
      <time>${formatRange(task)} · ${categoryLabel}</time>
      <strong>${task.zh}</strong>
      <p>${task.en || ""}</p>
      ${task.notes ? `<p>${task.notes}</p>` : ""}
    `;
    item.addEventListener("click", () => editTask(task.id));
    els.timeline.append(item);
  });
}

function renderGanttTimeline() {
  const [year, month] = state.month.split("-").map(Number);
  const visibleStudents = state.students.filter((student) => student.id === state.activeStudentId);
  const activeTasks = state.tasks
    .filter((task) => task.studentId === state.activeStudentId)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.endDate || a.date).localeCompare(b.endDate || b.date));
  const range = activeTasks.length
    ? effectiveTaskRange(activeTasks)
    : {
        start: toDateKey(new Date(year, month - 1, 1)),
        end: toDateKey(new Date(year, month, 0)),
      };
  const rangeStartDate = new Date(`${range.start}T00:00:00`);
  const rangeEndDate = new Date(`${range.end}T00:00:00`);
  const rangeStart = toDateKey(rangeStartDate);
  const rangeEnd = toDateKey(rangeEndDate);
  const daysInRange = daysBetween(rangeStart, rangeEnd) + 1;
  const config = modeConfig[state.mode];
  const rangeLabel = state.mode === "application" ? "有效申请任务" : "有效日常安排";
  els.rangeHint.textContent = `${rangeLabel} · ${formatMonthLabel(rangeStartDate)} - ${formatMonthLabel(rangeEndDate)}`;
  els.ganttBoard.innerHTML = "";

  const header = document.createElement("div");
  header.className = "gantt-date-header";
  header.innerHTML = `
    <div class="gantt-left-title">
      <strong>${currentStudentDisplayName()}</strong>
      <span>${config.en} · ${rangeLabel} · ${formatMonthLabel(rangeStartDate)} - ${formatMonthLabel(rangeEndDate)}</span>
    </div>
    <div class="gantt-scale" style="grid-template-columns: repeat(${daysInRange}, var(--day-width));">
      ${renderGanttScale(rangeStartDate, daysInRange)}
    </div>
  `;
  els.ganttBoard.append(header);

  visibleStudents.forEach((student) => {
    const tasks = activeTasks.filter((task) => taskTouchesRange(task, rangeStart, rangeEnd));

    if (!tasks.length) {
      const row = document.createElement("div");
      row.className = "gantt-task-row empty-row";
      row.innerHTML = `
        <div class="gantt-task-label">
          <strong>${student.name}</strong>
          <span>No events saved</span>
        </div>
        <div class="gantt-chart" data-student-id="${student.id}" style="--days:${daysInRange}">
          ${renderGanttDayLines(rangeStartDate, daysInRange)}
        </div>
      `;
      bindGanttBrush(row.querySelector(".gantt-chart"));
      els.ganttBoard.append(row);
      return;
    }

    tasks.forEach((task, index) => {
      const row = document.createElement("div");
      row.className = `gantt-task-row ${index === 0 ? "student-start" : ""}`;
      const [, categoryLabel, categoryColor] = getCategory(task.category);
      row.innerHTML = `
        <div class="gantt-task-label">
          ${index === 0 ? `<strong>${student.name}</strong>` : "<strong></strong>"}
          <span class="task-name">${task.zh}</span>
          <small>${task.en || categoryLabel}</small>
          <em>${formatRange(task)} · ${categoryLabel}</em>
        </div>
        <div class="gantt-chart" data-student-id="${student.id}" style="--days:${daysInRange}">
          ${renderGanttDayLines(rangeStartDate, daysInRange)}
        </div>
      `;
      row.querySelector(".gantt-task-label").addEventListener("dblclick", () => editTask(task.id));

      const taskStart = task.date < rangeStart ? rangeStart : task.date;
      const taskEnd = (task.endDate || task.date) > rangeEnd ? rangeEnd : task.endDate || task.date;
      const startOffset = daysBetween(rangeStart, taskStart);
      const duration = daysBetween(taskStart, taskEnd) + 1;
      const left = (startOffset / daysInRange) * 100;
      const width = (duration / daysInRange) * 100;
      const color = task.color || categoryColor;
      const bar = document.createElement("button");
      bar.type = "button";
      bar.className = "gantt-event";
      bar.style.setProperty("--event-color", color);
      bar.style.left = `${left}%`;
      bar.style.width = `max(${width}%, 18px)`;
      bar.title = `${task.zh}\n${formatRange(task)}\n${categoryLabel}`;
      bar.setAttribute("aria-label", `${task.zh} ${formatRange(task)}`);
      bar.addEventListener("dblclick", () => editTask(task.id));
      const chart = row.querySelector(".gantt-chart");
      chart.append(bar);
      bindGanttBrush(chart);
      els.ganttBoard.append(row);
    });
  });
}

function effectiveTaskRange(tasks) {
  const start = tasks.reduce((min, task) => (task.date < min ? task.date : min), tasks[0].date);
  const end = tasks.reduce((max, task) => {
    const taskEnd = task.endDate || task.date;
    return taskEnd > max ? taskEnd : max;
  }, tasks[0].endDate || tasks[0].date);
  return { start, end };
}

function renderGanttScaleLegacy(startDate, totalDays) {
  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(startDate, index);
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? " weekend" : "";
    const monthStart = date.getDate() === 1 ? " month-start" : "";
    const monthLabel = date.getDate() === 1 ? `<em><span>${date.getFullYear()}</span><strong>${date.getMonth() + 1}月</strong></em>` : "";
    return `<span class="${weekend}${monthStart}">${monthLabel}</span>`;
  }).join("");
}

function renderGanttScale(startDate, totalDays) {
  const endDate = addDays(startDate, totalDays - 1);
  const startMonthKey = `${startDate.getFullYear()}-${startDate.getMonth()}`;
  const endMonthKey = `${endDate.getFullYear()}-${endDate.getMonth()}`;

  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(startDate, index);
    const isStartEdge = index === 0;
    const isEndEdge = index === totalDays - 1 && endMonthKey !== startMonthKey;
    const showMonthLabel = isStartEdge || isEndEdge || date.getDate() === 1;
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? " weekend" : "";
    const monthStart = date.getDate() === 1 ? " month-start" : "";
    const edgeClass = isStartEdge ? " edge-start" : isEndEdge ? " edge-end" : "";
    const monthLabel = showMonthLabel
      ? `<em><span>${date.getFullYear()}</span><strong>${date.getMonth() + 1}月</strong></em>`
      : "";
    return `<span class="${weekend}${monthStart}${edgeClass}">${monthLabel}</span>`;
  }).join("");
}

function renderGanttDayLines(startDate, totalDays) {
  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(startDate, index);
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? " weekend" : "";
    const monthStart = date.getDate() === 1 ? " month-start" : "";
    return `<i class="gantt-day-line${weekend}${monthStart}" data-date="${toDateKey(date)}"></i>`;
  }).join("");
}

function bindGanttBrush(chart) {
  chart.addEventListener("pointerdown", (event) => beginGanttSelection(event, chart));
}

function beginGanttSelection(event, chart) {
  if (event.button !== 0 || event.target.closest(".gantt-event")) return;
  const dateKey = dateFromGanttPointer(chart, event.clientX);
  if (!dateKey) return;
  state.isDragging = true;
  state.dragStart = dateKey;
  state.dragEnd = dateKey;
  state.ganttDragStudentId = chart.dataset.studentId;
  state.lastPointer = { x: event.clientX, y: event.clientY };
  chart.setPointerCapture?.(event.pointerId);
  document.addEventListener("pointermove", trackGanttSelection);
  document.addEventListener("pointerup", finishGanttSelection, { once: true });
  startAutoScroll();
  highlightDateSelection();
  event.preventDefault();
}

function trackGanttSelection(event) {
  if (!state.isDragging || !state.ganttDragStudentId) return;
  state.lastPointer = { x: event.clientX, y: event.clientY };
  const chart = document.elementFromPoint(event.clientX, event.clientY)?.closest(".gantt-chart");
  const activeChart =
    chart && chart.dataset.studentId === state.ganttDragStudentId
      ? chart
      : document.querySelector(`.gantt-chart[data-student-id="${state.ganttDragStudentId}"]`);
  const dateKey = activeChart ? dateFromGanttPointer(activeChart, event.clientX) : null;
  if (dateKey) {
    state.dragEnd = dateKey;
    highlightDateSelection();
  }
}

function finishGanttSelection() {
  if (!state.isDragging || !state.ganttDragStudentId) return;
  const start = state.dragStart;
  const end = state.dragEnd;
  const studentId = state.ganttDragStudentId;
  state.isDragging = false;
  state.dragStart = null;
  state.dragEnd = null;
  state.ganttDragStudentId = null;
  state.lastPointer = null;
  document.removeEventListener("pointermove", trackGanttSelection);
  stopAutoScroll();
  highlightDateSelection();
  state.activeStudentId = studentId;
  startNewTask(start, end);
  els.studentSelect.value = studentId;
}

function dateFromGanttPointer(chart, clientX) {
  const lines = chart.querySelectorAll(".gantt-day-line");
  if (!lines.length) return null;
  const rect = chart.getBoundingClientRect();
  const boardScroll = els.ganttBoard.scrollLeft;
  const dayWidth = chart.scrollWidth / lines.length;
  const rawX = clientX - rect.left + boardScroll;
  const index = Math.max(0, Math.min(lines.length - 1, Math.floor(rawX / dayWidth)));
  return lines[index]?.dataset.date || null;
}

function startAutoScroll() {
  if (state.autoScrollFrame) return;
  const step = () => {
    if (!state.isDragging || !state.lastPointer) {
      state.autoScrollFrame = null;
      return;
    }
    const margin = 170;
    const speed = 24;
    const pointer = state.lastPointer;
    if (pointer.y > window.innerHeight - margin) {
      window.scrollBy(0, speed * 1.4);
      maybeAutoShiftNextMonth(pointer);
    } else if (pointer.y < margin) {
      window.scrollBy(0, -speed * 1.4);
    }
    const board = els.ganttBoard;
    const boardRect = board.getBoundingClientRect();
    if (pointer.x > boardRect.right - margin) {
      board.scrollLeft += speed * 4;
      updateGanttDragEndFromPointer();
    } else if (pointer.x < boardRect.left + margin) {
      board.scrollLeft -= speed * 4;
      updateGanttDragEndFromPointer();
    }
    state.autoScrollFrame = requestAnimationFrame(step);
  };
  state.autoScrollFrame = requestAnimationFrame(step);
}

function updateGanttDragEndFromPointer() {
  if (!state.ganttDragStudentId || !state.lastPointer) return;
  const chart = document.querySelector(`.gantt-chart[data-student-id="${state.ganttDragStudentId}"]`);
  if (!chart) return;
  const dateKey = dateFromGanttPointer(chart, state.lastPointer.x);
  if (!dateKey) return;
  state.dragEnd = dateKey;
  highlightDateSelection();
}

function maybeAutoShiftNextMonth(pointer) {
  const now = Date.now();
  const nearViewportBottom = pointer.y > window.innerHeight - 55;
  const nearPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
  if (!nearViewportBottom || !nearPageBottom || now - state.lastAutoMonthShift < 900) return;
  state.lastAutoMonthShift = now;
  shiftTimelineMonth(1, { keepDraft: true, keepDrag: true });
}

function shiftTimelineMonth(delta, options = {}) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const [year, month] = state.month.split("-").map(Number);
  const next = new Date(year, month - 1 + delta, 1);
  state.month = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
  if (!options.keepDraft) clearForm();
  render();
  if (options.keepScroll) {
    window.scrollTo(scrollX, scrollY);
  }
  setTimeout(() => {
    if (options.scrollToTimeline) {
      document.querySelector(".gantt-section")?.scrollIntoView({ block: "end" });
    } else if (options.keepScroll) {
      window.scrollTo(scrollX, scrollY);
      requestAnimationFrame(() => {
        window.scrollTo(scrollX, scrollY);
        requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
      });
    }
    if (options.keepDrag) highlightDateSelection();
  }, 0);
}

function stopAutoScroll() {
  if (state.autoScrollFrame) {
    cancelAnimationFrame(state.autoScrollFrame);
    state.autoScrollFrame = null;
  }
}

function taskCoversDate(task, dateKey) {
  const start = task.date;
  const end = task.endDate || task.date;
  return dateKey >= start && dateKey <= end;
}

function taskTouchesMonth(task, monthKey) {
  const monthStart = `${monthKey}-01`;
  const [year, month] = monthKey.split("-").map(Number);
  const monthEnd = toDateKey(new Date(year, month, 0));
  const taskStart = task.date;
  const taskEnd = task.endDate || task.date;
  return taskStart <= monthEnd && taskEnd >= monthStart;
}

function taskTouchesRange(task, rangeStart, rangeEnd) {
  const taskStart = task.date;
  const taskEnd = task.endDate || task.date;
  return taskStart <= rangeEnd && taskEnd >= rangeStart;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(startKey, endKey) {
  const start = new Date(`${startKey}T00:00:00`);
  const end = new Date(`${endKey}T00:00:00`);
  return Math.round((end - start) / 86400000);
}

function formatMonthLabel(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatChineseMonthLabel(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return `${date.getMonth() + 1}/${date.getDate()} ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]}`;
}

function formatRange(task) {
  const endDate = task.endDate || task.date;
  if (task.date === endDate) return formatDate(task.date);
  return `${formatDate(task.date)} - ${formatDate(endDate)}`;
}

function startNewTask(startDate, endDate = startDate) {
  setTaskDraftDates(startDate, endDate, { reset: true, focus: true });
}

function setTaskDraftDates(startDate, endDate = startDate, options = {}) {
  const [orderedStart, orderedEnd] = orderDates(startDate, endDate);
  if (options.reset) clearForm();
  els.taskId.value = "";
  els.taskDate.value = orderedStart;
  els.taskEndDate.value = orderedEnd;
  els.studentSelect.value = state.activeStudentId;
  updateDeleteButton();
  if (options.focus) els.taskZh.focus();
}

function orderDates(a, b) {
  return a <= b ? [a, b] : [b, a];
}

function beginDateSelection(event, dateKey) {
  if (event.button !== 0 || event.target.closest(".task-pill")) return;
  state.isDragging = true;
  state.dragStart = dateKey;
  state.dragEnd = dateKey;
  setTaskDraftDates(dateKey, dateKey, { reset: true, focus: false });
  highlightDateSelection();
}

function extendDateSelection(dateKey) {
  if (!state.isDragging) return;
  state.dragEnd = dateKey;
  setTaskDraftDates(state.dragStart, state.dragEnd, { reset: false, focus: false });
  highlightDateSelection();
}

function finishDateSelection(dateKey) {
  if (!state.isDragging) return;
  state.dragEnd = dateKey;
  const start = state.dragStart;
  const end = state.dragEnd;
  state.isDragging = false;
  state.dragStart = null;
  state.dragEnd = null;
  highlightDateSelection();
  setTaskDraftDates(start, end, { reset: false, focus: true });
}

function highlightDateSelection() {
  document.querySelectorAll(".day-cell").forEach((cell) => cell.classList.remove("selected-range"));
  document.querySelectorAll(".gantt-day-line").forEach((line) => line.classList.remove("selected-range"));
  if (!state.dragStart || !state.dragEnd) return;
  const [start, end] = orderDates(state.dragStart, state.dragEnd);
  document.querySelectorAll(".day-cell").forEach((cell) => {
    if (cell.dataset.date >= start && cell.dataset.date <= end) {
      cell.classList.add("selected-range");
    }
  });
  document.querySelectorAll(".gantt-day-line").forEach((line) => {
    if (line.dataset.date >= start && line.dataset.date <= end) {
      line.classList.add("selected-range");
    }
  });
}

function editTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  els.taskId.value = task.id;
  els.studentSelect.value = task.studentId;
  els.taskDate.value = task.date;
  els.taskEndDate.value = task.endDate || task.date;
  els.taskZh.value = task.zh;
  els.taskEn.value = task.en || "";
  els.categorySelect.value = task.category;
  els.taskColor.value = task.color || getCategory(task.category)[2];
  els.taskNotes.value = task.notes || "";
  updateDeleteButton();
}

function clearForm() {
  els.form.reset();
  els.taskId.value = "";
  els.studentSelect.value = state.activeStudentId;
  els.taskDate.value = `${state.month}-01`;
  els.taskEndDate.value = `${state.month}-01`;
  els.categorySelect.value = state.categories[0][0];
  els.taskColor.value = state.categories[0][2];
  updateDeleteButton();
}

function updateDeleteButton() {
  const hasCurrentTask = Boolean(els.taskId.value);
  els.deleteTask.disabled = !hasCurrentTask;
  els.deleteTask.textContent = hasCurrentTask ? "删除当前事项" : "先选择事项再删除";
}

function updateDeleteStudentButton() {
  const activeStudent = state.students.find((student) => student.id === state.activeStudentId);
  els.deleteStudent.disabled = !activeStudent || state.students.length <= 1;
  els.deleteStudent.textContent = activeStudent ? `删除学生：${activeStudent.name}` : "删除学生";
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => loadMode(button.dataset.mode));
});

document.querySelector("#backToModes").addEventListener("click", () => {
  els.planner.classList.add("hidden");
  els.modeScreen.classList.remove("hidden");
});

document.querySelector("#addStudent").addEventListener("click", () => {
  const name = prompt("请输入学生姓名 / Student name");
  if (!name) return;
  const id = crypto.randomUUID();
  state.students.push({ id, name });
  state.activeStudentId = id;
  render();
});

document.querySelector("#printPage").addEventListener("click", () => {
  preparePrintScale();
  document.title = `${currentStudentName()}短期任务时间计划`;
  window.print();
});
document.querySelector("#clearForm").addEventListener("click", clearForm);
document.querySelector("#prevTopMonth").addEventListener("click", () => shiftTimelineMonth(-1, { keepScroll: true }));
document.querySelector("#nextTopMonth").addEventListener("click", () => shiftTimelineMonth(1, { keepScroll: true }));
document.querySelector("#prevMonth").addEventListener("click", () => shiftTimelineMonth(-1, { scrollToTimeline: true }));
document.querySelector("#nextMonth").addEventListener("click", () => shiftTimelineMonth(1, { scrollToTimeline: true }));
document.querySelector("#prevCalendarMonth").addEventListener("click", () => shiftTimelineMonth(-1, { keepScroll: true }));
document.querySelector("#nextCalendarMonth").addEventListener("click", () => shiftTimelineMonth(1, { keepScroll: true }));
document.querySelector("#renameStudent").addEventListener("click", renameActiveStudent);
els.addCategory.addEventListener("click", () => {
  const id = `custom-${Date.now()}`;
  state.categories.push([id, "新类别 New Category", "#246bfe"]);
  render();
  els.categorySelect.value = id;
  els.taskColor.value = "#246bfe";
});
els.deleteStudent.addEventListener("click", () => {
  deleteActiveStudent();
});

els.monthPicker.addEventListener("change", () => {
  state.month = els.monthPicker.value;
  clearForm();
  render();
});

els.studentSelect.addEventListener("change", () => {
  state.activeStudentId = els.studentSelect.value;
  render();
});

els.taskDate.addEventListener("change", () => {
  if (!els.taskEndDate.value || els.taskEndDate.value < els.taskDate.value) {
    els.taskEndDate.value = els.taskDate.value;
  }
});

els.categorySelect.addEventListener("change", () => {
  els.taskColor.value = getCategory(els.categorySelect.value)[2];
});

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveTaskFromForm({ forceNew: false });
});

els.saveAsNewTask.addEventListener("click", () => {
  if (!els.form.reportValidity()) return;
  saveTaskFromForm({ forceNew: true });
});

function saveTaskFromForm({ forceNew = false } = {}) {
  const [startDate, endDate] = orderDates(els.taskDate.value, els.taskEndDate.value);
  const payload = {
    id: forceNew ? crypto.randomUUID() : els.taskId.value || crypto.randomUUID(),
    studentId: els.studentSelect.value,
    date: startDate,
    endDate,
    zh: els.taskZh.value.trim(),
    en: els.taskEn.value.trim(),
    category: els.categorySelect.value,
    color: els.taskColor.value,
    notes: els.taskNotes.value.trim(),
  };
  const existingIndex = state.tasks.findIndex((task) => task.id === payload.id);
  if (existingIndex >= 0) {
    state.tasks[existingIndex] = payload;
  } else {
    state.tasks.push(payload);
  }
  state.activeStudentId = payload.studentId;
  state.month = payload.date.slice(0, 7);
  render();
  editTask(payload.id);
}

els.deleteTask.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const currentTaskId = els.taskId.value;
  if (!currentTaskId) {
    updateDeleteButton();
    return;
  }
  state.tasks = state.tasks.filter((task) => task.id !== currentTaskId);
  clearForm();
  render();
});

function deleteActiveStudent() {
  const activeStudent = state.students.find((student) => student.id === state.activeStudentId);
  if (!activeStudent || state.students.length <= 1) {
    updateDeleteStudentButton();
    return;
  }
  const ok = confirm(`确定删除 ${activeStudent.name} 吗？该学生的所有事项也会一起删除。`);
  if (!ok) return;
  state.students = state.students.filter((student) => student.id !== activeStudent.id);
  state.tasks = state.tasks.filter((task) => task.studentId !== activeStudent.id);
  state.activeStudentId = state.students[0].id;
  clearForm();
  render();
}

function renameActiveStudent() {
  const activeStudent = state.students.find((student) => student.id === state.activeStudentId);
  if (!activeStudent) return;
  const name = prompt("请输入学生姓名 / Student name", activeStudent.name);
  if (!name || !name.trim()) return;
  activeStudent.name = name.trim();
  render();
}

function currentStudentName() {
  const student = state.students.find((item) => item.id === state.activeStudentId);
  return sanitizeFilenamePart(student?.name || "学生");
}

function currentStudentDisplayName() {
  const student = state.students.find((item) => item.id === state.activeStudentId);
  return student?.name || "学生";
}

function preparePrintScale() {
  const rowCount = Math.max(1, document.querySelectorAll(".gantt-task-row").length);
  // 打印时每行约 17mm（四行标签 + 内边距），页首标题区约 34mm；A4 横向可用高度 178mm
  const estimatedHeightMm = 34 + rowCount * 17;
  const scale = Math.max(0.35, Math.min(1, 178 / estimatedHeightMm));
  document.documentElement.style.setProperty("--print-scale", scale.toFixed(3));
}

window.addEventListener("beforeprint", preparePrintScale);
window.addEventListener("afterprint", () => {
  document.title = "Student Planning Calendar | 学生日程规划";
});

function sanitizeFilenamePart(value) {
  return value.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim();
}

loadMode("daily");
els.planner.classList.add("hidden");
els.modeScreen.classList.remove("hidden");

// 支持 #daily / #application（可加 /学生名）直接打开对应模式
const [initialMode, initialStudent] = decodeURIComponent(location.hash.slice(1)).split("/");
if (modeConfig[initialMode]) {
  loadMode(initialMode);
  if (initialStudent) {
    const match = state.students.find((student) => student.name === initialStudent);
    if (match) {
      state.activeStudentId = match.id;
      render();
    }
  }
}
