import { TextInput } from "../TextInput/TextInput";

type SearchProps = {
    to: string
}

/** 
 * Search, can only be used with Formik
 */
export const Search: React.FC<SearchProps> = ({ to }) => <TextInput name="search" icon="search" iconLink={to} />