export type TabKind = "home" | "dev" | "settings";

export type Tab = {
  id: string;
  title: string;
  kind: TabKind;
};
