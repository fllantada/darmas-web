export type TDirectoryTree = {
  country: string;
  selectedPort: string;
  ports: TPortDirectoryItem[];
};
export type TPortDirectoryItem = {
  code: string;
  title: string;
  terminals?: TTerminalDirectoryItem[];
};
export type TBerthDirectoryItem = {
  title: string;
};

export type TTerminalDirectoryItem = {
  code: string;
  title: string;
  berths?: TBerthDirectoryItem[];
};
