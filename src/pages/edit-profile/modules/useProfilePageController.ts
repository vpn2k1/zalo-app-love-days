import type { QueryClient } from "@tanstack/react-query";
import { useProfileMutations } from "@/hooks/useProfileMutations";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";

type Input = {
  coupleData: CoupleWithMembers | null;
  queryClient: QueryClient;
  user: AppUser | null;
};

export function useProfilePageController(input: Input) {
  return useProfileMutations(input);
}
