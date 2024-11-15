export type TRANSACTION = {
  id: string;
  sheetId: string;
  account: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  time: string;
};

export type SHEET = {
  id: string;
  name: string;
};
