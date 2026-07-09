import { AppSheetRef } from "@/components/zaui";
import { createRef, useEffect, useState } from "react";

type SheetState = {
  status: boolean;
  onSelect?: string;
  onClose?: () => void;
};

const defaultState: SheetState = { status: false };
const listeners = new Set<(state: SheetState) => void>();

function emit(state: SheetState) {
  listeners.forEach((listener) => listener(state));
}

function showSheet(state: SheetState) {
  emit(state);
}

function hideSheet() {
  emit(defaultState);
}

function useSheetState() {
  const [state, setState] = useState<SheetState>(defaultState);

  useEffect(() => {
    listeners.add(setState);

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}

const refCalendar = createRef<AppSheetRef>();

const onOpenSheet = () => {
  refCalendar.current?.open();
};

const onCloseSheet = () => {
  refCalendar.current?.close();
};

export { refCalendar, onOpenSheet, onCloseSheet };
