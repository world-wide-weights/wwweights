import { TextInput } from "../TextInput/TextInput";

/** 
 * Search, can only be used with Formik
 */
export const Search: React.FC = () => <TextInput name="query" icon="search" iconOnClick={() => ""} iconButtonIsSubmit />