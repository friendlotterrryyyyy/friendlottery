export type Data = {
  choosenNumbers: number[];
  totalParticipants: number;
  downloadCSVOption: boolean;
  isUserPlaying: boolean;
};

export type PlayedNumber = {
  combination: string;
  price: string;
};

export type Ticket = Array<number[]>;

export type WinningNumber = { num: number; color: string };

export type LotteryResults = {
  totalCombinationsLength: number,
  totalGrossIncome: number,
  blueWinningNumbers?: WinningNumber[],
  yellowWinningNumbers?: WinningNumber[],
  totalFriendPayments?: number,
  totalFriendEarnings?: number,
  rewards?: PlayedNumber[],
};
