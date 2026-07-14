export type LegalPageKind = "terms" | "privacy" | "data-deletion" | "donate";

export type LegalBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "steps";
      items: string[];
    }
  | {
      type: "notice";
      text: string;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

export type LegalSection = {
  blocks: LegalBlock[];
  title: string;
};

export type LegalPageContent = {
  kind: LegalPageKind;
  title: string;
  subtitle: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};
