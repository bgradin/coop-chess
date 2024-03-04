import page from "page";
import { BASE_PATH } from "./constants";
import { Routes } from "./routes";

export const url = (path: string) => `${BASE_PATH}${path}`;

export function showGenericError() {
  page.show(Routes.Error);
}
