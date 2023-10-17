import { useState, type ChangeEvent } from "react";
import { createRoot } from "react-dom/client";

import { Greeting } from "./greeting";
import messages from "./i18n/locales";
import { I18nProvider } from "./i18n/provider";

export function App() {
	const [locale, setLocale] = useState("en-GB");

	const onChangeLocale = (event: ChangeEvent<HTMLSelectElement>) => {
		setLocale(event.currentTarget.value);
	};

	return (
		<I18nProvider locale={locale} messages={messages[locale]}>
			<select onChange={onChangeLocale}>
				<option value="en-GB">English (UK)</option>
				<option value="en-US">English (US)</option>
				<option value="fr-FR">French</option>
			</select>
			<Greeting name="Oliver" />
		</I18nProvider>
	);
}

const domNode = document.getElementById("root");
const root = createRoot(domNode as HTMLElement);
root.render(<App />);
