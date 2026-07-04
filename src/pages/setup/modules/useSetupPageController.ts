import { useCreateCoupleMutation } from "@/pages/setup/modules/useCreateCoupleMutation";
import type { AppUser } from "@/types/user";

type Input = {
  user: AppUser | null;
};

export function useSetupPageController({ user }: Input) {
  return useCreateCoupleMutation({ user });
}
