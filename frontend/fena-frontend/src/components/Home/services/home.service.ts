import { httpService } from "../../../services/https.service";

export const handleSendBulkEmail = async (emails: number) => {
  try {
    const response: any = await httpService.post("sender/send_emails", {
      emails: emails,
      Headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      console.error("Error sending email request:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error sending email request:", error);
    return false;
  }
};
