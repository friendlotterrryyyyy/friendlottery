import {
  Data,
  LotteryResults,
  PlayedNumber,
  Ticket,
  WinningNumber,
} from "../types";

export class LotteryHandler {
  static getUniqueRandomNumberInRange(
    min: number,
    max: number,
    avoid: number[] = []
  ): number {
    const candidate = Math.floor(Math.random() * (max + 1 - min) + min);
    if (avoid.includes(candidate)) {
      return LotteryHandler.getUniqueRandomNumberInRange(min, max, avoid);
    }
    return candidate;
  }

  static generateFlash() {
    const numbers: number[] = [];
    for (let i = 0; i < 7; i++) {
      numbers.push(LotteryHandler.getUniqueRandomNumberInRange(1, 28, numbers));
    }
    return numbers;
  }

  static generateFlashTickets(totalNumbers: number) {
    return Array.from({ length: totalNumbers }, () =>
      LotteryHandler.generateFlash()
    );
  }

  static findRewardInTable(totalBlue: number, totalYellow: number) {
    const rewardTable = [
      // total bonus n7
      { blue: 7, yellow: 0, price: 25000 },
      { blue: 6, yellow: 1, price: 600 },
      { blue: 5, yellow: 2, price: 140 },
      { blue: 4, yellow: 3, price: 105 },
      { blue: 3, yellow: 4, price: 100 },
      { blue: 2, yellow: 5, price: 100 },

      // total bonus n6
      { blue: 6, yellow: 0, price: 500 },
      { blue: 5, yellow: 1, price: 55 },
      { blue: 4, yellow: 2, price: 20 },
      { blue: 3, yellow: 3, price: 15 },
      { blue: 2, yellow: 4, price: 15 },
      { blue: 1, yellow: 5, price: 15 },

      // total bonus n5
      { blue: 5, yellow: 0, price: 40 },
      { blue: 4, yellow: 1, price: 8 },
      { blue: 3, yellow: 2, price: 3 },
      { blue: 2, yellow: 3, price: 3 },
      { blue: 1, yellow: 4, price: 3 },
      { blue: 0, yellow: 5, price: 3 },

      // total bonus n4
      { blue: 4, yellow: 0, price: 5 },
      { blue: 3, yellow: 1, price: 2 },
      { blue: 2, yellow: 2, price: 2 },
      { blue: 1, yellow: 3, price: 2 },
      { blue: 0, yellow: 4, price: 2 },
    ];
    return rewardTable.find(
      (reward) => reward.blue === totalBlue && reward.yellow === totalYellow
    );
  }

  static getWinningNumbers(tickets: Ticket): WinningNumber[] {
    const individualScore: Array<{ num: number; score: number }> = [];

    for (let i = 0; i <= 28; i++) {
      individualScore.push({ num: i, score: 0 });
    }

    for (const combination of tickets) {
      for (const number of combination) {
        const index = individualScore.findIndex((v) => v.num === number);
        individualScore[index].score = individualScore[index].score + 1;
      }
    }

    individualScore.shift();

    individualScore.sort((a, b) => a.score - b.score);

    const winningNumbers = individualScore.slice(0, 12).map((v, i) => {
      return { num: v.num, color: i <= 6 ? "blue" : "yellow" };
    });

    return winningNumbers;
  }

  static getRewards(
    tickets: Ticket,
    winningNumbers: WinningNumber[]
  ): PlayedNumber[] {
    const rewards: PlayedNumber[] = [];
    for (const combination of tickets) {
      let totalBlue = 0;
      let totalYellow = 0;

      for (const winningNumber of winningNumbers) {
        for (const number of combination) {
          if (number === winningNumber.num) {
            if (winningNumber.color === "blue") {
              totalBlue++;
            } else {
              totalYellow++;
            }
          }
        }
      }
      const reward = LotteryHandler.findRewardInTable(totalBlue, totalYellow);

      rewards.push({
        combination: combination.join(" "),
        price: reward ? `${reward.price}` : "",
      });
    }
    return rewards;
  }

  static getLotteryResults(formData: Data) {
    const results: Partial<LotteryResults> = {
      totalCombinationsLength: formData.totalParticipants,
      totalGrossIncome: formData.totalParticipants * 2,
    };

    const tickets = LotteryHandler.generateFlashTickets(
      formData.totalParticipants
    );

    if (formData.isUserPlaying) {
      results.totalCombinationsLength!++;
      results.totalGrossIncome! += 2;

      tickets.push(formData.choosenNumbers);
    }

    const winningNumbers = LotteryHandler.getWinningNumbers(tickets);

    const filterBlue = (i: WinningNumber) => i.color === "blue";
    const filterYellow = (i: WinningNumber) => i.color === "yellow";

    results.blueWinningNumbers = winningNumbers.filter(filterBlue);
    results.yellowWinningNumbers = winningNumbers.filter(filterYellow);

    results.rewards = LotteryHandler.getRewards(tickets, winningNumbers);

    results.totalFriendPayments = results.rewards.reduce(
      (p: any, a: any) => p + +a.price,
      0
    );

    results.totalFriendEarnings =
      results.totalGrossIncome! - results.totalFriendPayments!;

      
    return results;
  }
}
