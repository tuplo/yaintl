import { useContext } from "react";

import I18nContext from "./context";

export function useI18n(prefix?: string) {
	return useContext(I18nContext).build(prefix);
}
