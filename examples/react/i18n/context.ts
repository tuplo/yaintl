import { createContext } from "react";

// import I18n from "@tuplo/yaintl";
import I18n from "../../../src/index";

const I18nContext = createContext<I18n>({} as I18n);

export default I18nContext;
