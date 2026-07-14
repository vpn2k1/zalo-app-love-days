import { mockDb } from "@/services/mockDb";
import { deleteMockAnniversary } from "@/services/mockAnniversaryDelete";
import { isMockMode, supabase } from "@/services/supabaseClient";
import { mediaService } from "@/services/mediaService";
import { waitForMockNetworkDelay } from "@/services/mockNetworkDelay";
import type { Anniversary, AnniversaryDraft, AnniversaryPage, AnniversaryUpdateInput } from "@/types/anniversary";

type AnniversaryListInput = { limit?: number; page?: number };

const ALL_ANNIVERSARIES_PAGE_LIMIT = 100;

export const anniversaryService = {
  async list(coupleId: string): Promise<Anniversary[]> {
    const anniversaries: Anniversary[] = [];
    let page = 1;

    while (true) {
      const result = await anniversaryService.listPage(coupleId, {
        limit: ALL_ANNIVERSARIES_PAGE_LIMIT,
        page,
      });
      anniversaries.push(...result.items);
      if (!result.hasMore) return anniversaries;
      page += 1;
    }
  },

  async listByDate(coupleId: string, date: string): Promise<Anniversary[]> {
    if (isMockMode || !supabase) {
      await waitForMockNetworkDelay();
      return mockDb
        .getAnniversaries(coupleId)
        .filter((item) => isAnniversaryOnDate(item, date))
        .sort(compareAnniversaryDateDesc);
    }

    const { data, error } = await supabase.rpc("list_anniversaries_by_date", { p_couple_id: coupleId, p_date: date });

    if (error) throw error;
    return data ?? [];
  },

  async listPage(coupleId: string, input: AnniversaryListInput = {}): Promise<AnniversaryPage> {
    const page = normalizePositiveNumber(input.page, 1);
    const limit = normalizePositiveNumber(input.limit, 20);

    if (isMockMode || !supabase) {
      await waitForMockNetworkDelay();
      return getMockAnniversaryPage(coupleId, page, limit);
    }

    const from = (page - 1) * limit;
    const to = from + limit;
    const { data, error } = await supabase
      .from("anniversaries")
      .select("*")
      .eq("couple_id", coupleId)
      .order("date", { ascending: false })
      .range(from, to);

    if (error) throw error;
    const items = data ?? [];
    return {
      hasMore: items.length > limit,
      items: items.slice(0, limit),
      limit,
      page,
    };
  },

  async create(coupleId: string, userId: string, draft: AnniversaryDraft): Promise<Anniversary> {
    if (isMockMode || !supabase) {
      return mockDb.addAnniversary(coupleId, userId, draft);
    }

    const imageUrl = await mediaService.uploadImagePath({
      coupleId,
      fileName: `anniversary-${Date.now()}-${draft.title}`,
      path: draft.image_url,
      scope: "anniversaries",
    });
    const { data, error } = await supabase
      .from("anniversaries")
      .insert({
        couple_id: coupleId,
        title: draft.title,
        date: draft.date,
        repeat_type: draft.repeat_type,
        note: draft.note,
        image_url: imageUrl,
        created_by: userId,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async update(coupleId: string, anniversaryId: string, input: AnniversaryUpdateInput): Promise<Anniversary> {
    if (isMockMode || !supabase) {
      return mockDb.updateAnniversary(anniversaryId, input);
    }

    const imageUrl = await mediaService.uploadImagePath({
      coupleId,
      fileName: `anniversary-${anniversaryId}`,
      path: input.image_url,
      scope: "anniversaries",
    });
    const { data, error } = await supabase
      .from("anniversaries")
      .update({
        date: input.date,
        image_url: imageUrl,
        note: input.note,
        repeat_type: input.repeat_type,
        title: input.title,
      })
      .eq("id", anniversaryId)
      .eq("couple_id", coupleId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async remove(coupleId: string, anniversaryId: string, userId: string): Promise<void> {
    if (isMockMode || !supabase) {
      deleteMockAnniversary(coupleId, anniversaryId, userId);
      return;
    }

    const { data, error } = await supabase
      .from("anniversaries")
      .delete()
      .eq("couple_id", coupleId)
      .eq("id", anniversaryId)
      .eq("created_by", userId)
      .select("id");

    if (error) throw error;
    if (data.length > 0) return;

    throw new Error("Chỉ người tạo kỷ niệm mới có thể xoá.");
  },

  async getOne({ coupleId, id }: { id: string; coupleId: string }): Promise<Anniversary> {
    if (isMockMode || !supabase) {
      const anniversary = mockDb
        .getAnniversaries(coupleId)
        .find((item) => item.id === id);
      if (!anniversary) throw new Error("Không tìm thấy kỷ niệm.");

      return anniversary;
    }

    const { data, error } = await supabase
      .from("anniversaries")
      .select("*")
      .eq("couple_id", coupleId)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};

function getMockAnniversaryPage(coupleId: string, page: number, limit: number): AnniversaryPage {
  const from = (page - 1) * limit;
  const items = mockDb
    .getAnniversaries(coupleId)
    .sort(compareAnniversaryDateDesc)
    .slice(from, from + limit + 1);

  return { hasMore: items.length > limit, items: items.slice(0, limit), limit, page };
}

function normalizePositiveNumber(value: number | undefined, fallback: number) {
  if (!value) return fallback;
  if (!Number.isFinite(value)) return fallback;
  if (value < 1) return fallback;
  return Math.floor(value);
}

function compareAnniversaryDateDesc(left: Anniversary, right: Anniversary) { return getDateTime(right.date) - getDateTime(left.date); }

function isAnniversaryOnDate(anniversary: Anniversary, date: string) {
  if (anniversary.date === date) return true;
  if (anniversary.repeat_type !== "yearly") return false;
  return getMonthDay(anniversary.date) === getMonthDay(date);
}

function getMonthDay(value: string) { return value.slice(5); }

function getDateTime(value: string) { const time = new Date(value).getTime(); if (Number.isNaN(time)) return 0; return time; }
