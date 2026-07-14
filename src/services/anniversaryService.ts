import { mockDb } from "@/services/mockDb";
import { deleteMockAnniversary } from "@/services/mockAnniversaryDelete";
import {
  getDraftImageUrls,
  uploadAnniversaryImages,
} from "@/services/anniversaryImageService";
import {
  compareAnniversaryDateDesc,
  getMockAnniversaryPage,
  isAnniversaryOnDate,
  normalizePositiveNumber,
} from "@/services/anniversaryListHelpers";
import { isMockMode, supabase } from "@/services/supabaseClient";
import { mediaService } from "@/services/mediaService";
import { waitForMockNetworkDelay } from "@/services/mockNetworkDelay";
import type { Anniversary, AnniversaryDraft, AnniversaryPage, AnniversaryUpdateInput } from "@/types/anniversary";
import { createUuid } from "@/utils/uuid";

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

    const anniversaryId = createUuid();
    const imageUrls = await uploadAnniversaryImages({
      anniversaryId,
      coupleId,
      imageUrls: getDraftImageUrls(draft),
      title: draft.title,
    });
    const { data, error } = await supabase
      .from("anniversaries")
      .insert({
        id: anniversaryId,
        couple_id: coupleId,
        title: draft.title,
        date: draft.date,
        repeat_type: draft.repeat_type,
        note: draft.note,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
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

    const imageUrls = await uploadAnniversaryImages({
      anniversaryId,
      coupleId,
      imageUrls: getDraftImageUrls(input),
      title: input.title,
    });
    const { data, error } = await supabase
      .from("anniversaries")
      .update({
        date: input.date,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
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
    if (data.length > 0) {
      await mediaService.removeAnniversaryMedia(coupleId, anniversaryId);
      return;
    }

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
