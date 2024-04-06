import { divider } from "#mei-ui/ui-configs";

export type DividerSize =
  | keyof typeof divider.border.size.horizontal
  | keyof typeof divider.border.size.vertical;
