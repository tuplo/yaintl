import { type PropsWithChildren } from "react";

// import I18n from "@tuplo/yaintl";
import I18n from "../../../src/index";

import I18nContext from "./context";

interface IProps {
	locale: string;
	messages: object;
}

export function I18nProvider(props: PropsWithChildren<IProps>) {
	const { locale, messages, children } = props;
	const engine = new I18n({ locale, messages });

	return <I18nContext.Provider value={engine}>{children}</I18nContext.Provider>;
}
