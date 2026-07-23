import type {
  LegalPageContent,
  LegalPageKind,
} from "../types/LegalPageType";
import { legalDataDeletionPage } from "./legalDataDeletionPage";
import { legalPrivacyPage } from "./legalPrivacyPage";
import { legalTermsPage } from "./legalTermsPage";

type LegalDocumentPageKind = Exclude<LegalPageKind, "donate">;

export const legalPages: Record<LegalDocumentPageKind, LegalPageContent> = {
  "data-deletion": legalDataDeletionPage,
  privacy: legalPrivacyPage,
  terms: legalTermsPage,
};
