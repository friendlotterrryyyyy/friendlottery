import { LotteryResults } from "../types";
import { CsvHandler } from "./csv";
import { FormHandler } from "./form";
import { LotteryHandler } from "./lottery";

export class PageHandler {
  static cleanPage() {
    FormHandler.cleanChoosenNumbers();
    FormHandler.cleanFormErrors();
    PageHandler.showForm();
  }

  static syncUserInputDisplayWithOptionStatus() {
    const user_playing_element = document.getElementById(
      "user_playing"
    )! as HTMLInputElement;

    if (user_playing_element.checked) {
      document
        .getElementById("ticket_input")!
        .setAttribute("style", "display: block");
    }

    user_playing_element.addEventListener("change", (e: Event) => {
      const displayValue = (e.target as HTMLInputElement).checked
        ? "block"
        : "none";

      document
        .getElementById("ticket_input")!
        .setAttribute("style", "display: " + displayValue);
    });
  }

  static addFormSubmitEventListener() {
    document.getElementById("lottery")!.addEventListener("submit", (e) => {
      e.preventDefault();

      FormHandler.cleanFormErrors();

      const formData = FormHandler.getFormData();

      const isValid = FormHandler.validateForm(formData);

      if (!isValid) return;

      const lotteryResults = LotteryHandler.getLotteryResults(
        formData
      ) as LotteryResults;

      PageHandler.displayResults(lotteryResults);

      if (formData.downloadCSVOption) CsvHandler.generateCsv(lotteryResults.rewards!);

      FormHandler.cleanFormErrors();

      FormHandler.cleanChoosenNumbers();

      PageHandler.showResults();
    });
  }

  static displayResults(lotteryResults: LotteryResults) {
    const blueWinningNumbers = lotteryResults
      .blueWinningNumbers!.map((i) => i.num)
      .join(" ");

    const yellowWinningNumbers = lotteryResults
      .yellowWinningNumbers!.map((i) => i.num)
      .join(" ");

    document.getElementById("results-blueWinningNumbers")!.innerText =
      blueWinningNumbers;
    document.getElementById("results-yellowWinningNumbers")!.innerText =
      yellowWinningNumbers;
    document.getElementById("results-totalCombinationsLength")!.innerText =
      lotteryResults.totalCombinationsLength.toString();
    document.getElementById("results-totalGrossIncome")!.innerText =
      lotteryResults.totalGrossIncome.toString() + "€";
    document.getElementById("results-totalFriendPayments")!.innerText =
      lotteryResults.totalFriendPayments!.toString() + "€";
    document.getElementById("results-totalFriendEarnings")!.innerText =
      lotteryResults.totalFriendEarnings!.toString() + "€";
  }

  static addPlayAgainButtonEventListener() {
    document.getElementById("play-again-btn")!.addEventListener("click", () => {
      PageHandler.showForm();
    });
  }

  static showForm() {
    document.getElementById("lottery")!.setAttribute("style", "display: block");
    document.getElementById("results")!.setAttribute("style", "display: none");
  }

  static showResults() {
    document.getElementById("results")!.setAttribute("style", "display: block");
    document.getElementById("lottery")!.setAttribute("style", "display: none");
  }
}
