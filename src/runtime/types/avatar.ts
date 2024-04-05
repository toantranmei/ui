import type { AppConfig } from "nuxt/schema";
import { avatar } from "../ui-configs";
import type { ExtractDeepKey } from ".";
import colors from "#mei-ui-colors";

export type AvatarSize =
  | keyof typeof avatar.size
  | ExtractDeepKey<AppConfig, ["ui", "avatar", "size"]>;
export type AvatarChipColor = "gray" | (typeof colors)[number];
export type AvatarChipPosition = keyof typeof avatar.chip.position;

export interface Avatar {
  src?: string | boolean;
  alt?: string;
  text?: string;
  size?: AvatarSize;
  chipColor?: AvatarChipColor;
  chipPosition?: AvatarChipPosition;
}
