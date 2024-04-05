import type { AppConfig } from "nuxt/schema";
import { toggle } from "../ui-configs";
import type { ExtractDeepKey } from ".";
import colors from "#mei-ui-colors";

export type ToggleSize =
  | keyof typeof toggle.size
  | ExtractDeepKey<AppConfig, ["ui", "toggle", "size"]>;
export type ToggleColor = (typeof colors)[number];
