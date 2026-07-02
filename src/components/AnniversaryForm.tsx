import { useState } from "react";
import { Box, Button, Input, Text } from "zmp-ui";
import type { AnniversaryDraft, RepeatType } from "@/types/anniversary";
import { todayDateString } from "@/utils/date";

type Props = {
  onAdd: (draft: AnniversaryDraft) => void;
};

export function AnniversaryForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayDateString());
  const [repeatType, setRepeatType] = useState<RepeatType>("yearly");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!title.trim() || !date) return;
    onAdd({
      title: title.trim(),
      date,
      repeat_type: repeatType,
      note: note.trim(),
    });
    setTitle("");
    setNote("");
  };

  return (
    <Box className="anniversary-form">
      <Text className="form-label">Ngày kỷ niệm</Text>
      <Input
        label="Tên kỷ niệm"
        value={title}
        placeholder="Ví dụ: Lần đầu gặp nhau"
        onChange={(event) => setTitle(event.target.value)}
      />
      <label className="native-field">
        <span>Ngày</span>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      </label>
      <label className="native-field">
        <span>Lặp lại</span>
        <select
          value={repeatType}
          onChange={(event) => setRepeatType(event.target.value as RepeatType)}
        >
          <option value="yearly">Hàng năm</option>
          <option value="none">Không lặp</option>
        </select>
      </label>
      <Input.TextArea
        label="Ghi chú"
        value={note}
        placeholder="Một lời nhắn nhỏ..."
        onChange={(event) => setNote(event.target.value)}
      />
      <Button fullWidth variant="secondary" onClick={submit}>
        Thêm ngày kỷ niệm
      </Button>
    </Box>
  );
}
