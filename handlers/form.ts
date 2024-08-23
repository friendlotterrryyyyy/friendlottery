import { Data } from "../types";

export class FormHandler {
  static validateForm(formData: Data) {
    if (!formData.isUserPlaying && formData.totalParticipants === 0) {
      document
        .getElementById("error_players_amount")!
        .setAttribute("style", "display: block");
      return false;
    }

    if (formData.isUserPlaying) {
      if (!formData.choosenNumbers.every((i) => i >= 1 && i <= 28)) {
        console.log(formData.choosenNumbers);
        
        document
          .getElementById("error_ticket_number_required")!
          .setAttribute("style", "display: block");
        return false;
      }

      const hasDuplicatedNumbers =
        new Set(formData.choosenNumbers).size !==
        formData.choosenNumbers.length;
      if (hasDuplicatedNumbers) {
        document
          .getElementById("error_ticket_number_repeated")!
          .setAttribute("style", "display: block");
        return false;
      }
    }

    return true;
  }

  static cleanFormErrors() {
    document
      .querySelectorAll("[id^='error_']")
      .forEach((el) => el.setAttribute("style", "display: none"));
  }

  static cleanChoosenNumbers() {
    const ticketInputs = document.querySelectorAll("[id^='ticket-segment']");

    // @ts-ignore
    for (const ticketInput of ticketInputs) ticketInput.value = "";
  }

  static getChoosenNumbers(): Data["choosenNumbers"] {
    return Array.from(document.querySelectorAll("[id^='ticket-segment-']")).map(
    // @ts-ignore
      (i) => Number(i.value)
    );
  }

  static getIsUserPlaying(): Data["isUserPlaying"] {
    return (document.getElementById("user_playing")! as HTMLInputElement)
      .checked;
  }

  static getTotalParticipants(): Data["totalParticipants"] {
    return Number(
      (document.getElementById("total_participants")! as HTMLInputElement).value
    );
  }

  static getDownloadCSVOption(): Data["downloadCSVOption"] {
    return (document.getElementById("download_csv_option")! as HTMLInputElement)
      .checked;
  }

  static getFormData(): Data {
    const choosenNumbers = FormHandler.getChoosenNumbers();
    const isUserPlaying = FormHandler.getIsUserPlaying();
    const totalParticipants = FormHandler.getTotalParticipants();
    const downloadCSVOption = FormHandler.getDownloadCSVOption();

    return {
      choosenNumbers,
      isUserPlaying,
      totalParticipants,
      downloadCSVOption,
    };
  }
}
