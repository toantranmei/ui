import type { AppConfig } from "nuxt/schema";
import { kbd } from "../ui-configs";
import type { ExtractDeepKey } from ".";

export type KbdSize =
  | keyof typeof kbd.size
  | ExtractDeepKey<AppConfig, ["ui", "kbd", "size"]>;
