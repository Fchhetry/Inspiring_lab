export interface CardType {
  id: string;
  content: string;
}

export interface ListType {
  id: string;
  title: string;
  cardIds: string[];
}

export interface DataType {
  lists: Record<string, ListType>;
  cards: Record<string, CardType>;
  listOrder: string[];
}
