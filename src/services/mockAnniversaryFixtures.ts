import type { Anniversary } from "@/types/anniversary";
import type { Couple } from "@/types/couple";
import type { MockState } from "./mockDbState";

const FIXTURE_COUNT = 36;
const FIXTURE_ID_PREFIX = "mock-loadmore-anniversary";
const DAY_MS = 24 * 60 * 60 * 1000;

const TITLES = [
  "Cà phê sáng",
  "Đi dạo cuối tuần",
  "Bữa tối nhỏ",
  "Một tấm ảnh vui",
  "Ngày trời đẹp",
  "Lời nhắn dễ thương",
];

export function ensureMockAnniversaryFixtures(
  state: MockState,
  couple: Couple,
) {
  const existingCount = state.anniversaries.filter((item) => {
    return item.id.startsWith(getFixtureIdPrefix(couple.id));
  }).length;
  if (existingCount >= FIXTURE_COUNT) return false;

  const missingCount = FIXTURE_COUNT - existingCount;
  const fixtures = Array.from({ length: missingCount }, (_, index) => {
    return createFixture(couple, existingCount + index);
  });
  state.anniversaries.push(...fixtures);

  return true;
}

function createFixture(couple: Couple, index: number): Anniversary {
  return {
    id: `${getFixtureIdPrefix(couple.id)}-${index + 1}`,
    couple_id: couple.id,
    title: `${TITLES[index % TITLES.length]} #${index + 1}`,
    date: getFixtureDate(index),
    repeat_type: getRepeatType(index),
    note: "Dữ liệu mock để test refresh và loadmore.",
    image_url: getFixtureImage(index),
    created_by: couple.created_by,
    created_at: couple.created_at,
  };
}

function getFixtureIdPrefix(coupleId: string) {
  return `${FIXTURE_ID_PREFIX}-${coupleId}`;
}

function getFixtureDate(index: number) {
  const date = new Date(Date.now() - (index + 1) * DAY_MS);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getRepeatType(index: number) {
  if (index % 3 === 0) return "yearly";

  return "none";
}

function getFixtureImage(index: number) {
  const hue = (index * 37) % 360;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">`,
    `<rect width="120" height="120" fill="hsl(${hue},75%,88%)"/>`,
    `<circle cx="38" cy="42" r="22" fill="hsl(${hue + 24},80%,72%)"/>`,
    `<circle cx="82" cy="80" r="28" fill="hsl(${hue + 128},55%,76%)"/>`,
    `</svg>`,
  ].join("");

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
