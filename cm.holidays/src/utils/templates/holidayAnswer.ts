import { MODEL_HTML_TEMPLATE } from "./base";
import { EmployeeDTO, HolidayRequestDTO, HolidayStatusDTO } from "../../entities/types";
import { EMAIL_CONFIG } from "../types";

export const EMAIL_HOLIDAY_HTML_TEMPLATE = (
  holiday: HolidayRequestDTO,
  user: EmployeeDTO
): EMAIL_CONFIG => {
  let text = "<ul style='padding: 5px 0;text-align: left;text-transform: capitalize;font-family: Arial,sans-serif;font-size: 13px;'>";
  text += `<li><label style="padding: 3px 4px">Starting Date : </label> <span style="font-weight: bolder; color: cadetblue">${holiday.startingDate}</span></li>`;
  text += `<li><label style="padding: 3px 4px">Ending Date : </label> <span style="font-weight: bolder; color: cadetblue">${holiday.endingDate}</span></li>`;
  text += `<li><label style="padding: 3px 4px">Returning Date : </label> <span style="font-weight: bolder; color: cadetblue">${holiday.returningDate}</span></li>`;
  if (holiday.status === HolidayStatusDTO.APPROVED)
    text += `<li><label style="padding: 3px 4px">Status : </label> <span style="font-weight: bolder; color: green;">${holiday.status} ✅</span></li>`;
  else
    text += `<li><label style="padding: 3px 4px">Status : </label> <span style="font-weight: bolder; color: red;">${holiday.status} ❌</span></li>`;
  text += "</ul>";
  return {
    subject: "Answer to your holiday request",
    to: user.email as string,
    html: MODEL_HTML_TEMPLATE(
      {
        title: "LAO SARL (Answer gave)",
        text,
        explanation: "Answer to your holiday request"
      }
    )
  };
};