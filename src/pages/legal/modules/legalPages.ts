import type {
  LegalPageContent,
  LegalPageKind,
} from "../types/LegalPageType";
import { legalDataDeletionPage } from "./legalDataDeletionPage";
import { legalPrivacyPage } from "./legalPrivacyPage";
import { legalTermsPage } from "./legalTermsPage";

export const legalPages: Record<LegalPageKind, LegalPageContent> = {
  "data-deletion": legalDataDeletionPage,
  privacy: legalPrivacyPage,
  terms: legalTermsPage,
};
