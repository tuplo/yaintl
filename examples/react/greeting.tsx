import { useI18n } from "./i18n/use-i18n";

interface IProps {
	name: string;
}

export function Greeting(props: IProps) {
	const { name } = props;
	const t = useI18n();

	return <h1>{t("greeting", { name })}</h1>;
}
