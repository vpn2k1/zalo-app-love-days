export function requiredRule(required?: boolean | string) {
  if (!required) return undefined;

  if (typeof required === "string") return required;
  return "Vui lòng nhập thông tin này.";
}
