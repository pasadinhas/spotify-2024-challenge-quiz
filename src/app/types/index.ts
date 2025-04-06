export type Stats = {
  totalAnswered: number;
  byProperty: { [property: string]: { locked: Boolean; options: number; correct: number } };
  byOption: any;
};

export type Answer = {
  locked: Boolean;
  selected: { [trackId: string]: string };
};

export type Answers = { [property: string]: Answer };
