import { TextInput } from "../TextInput/TextInput";

/** 
 * Search, can only be used with Formik
 */
export const Search: React.FC = () => <TextInput datacy="search" name="query" icon="search" iconOnClick={() => ""} iconButtonIsSubmit /> // TODO (Zoe-Bot): Ref text input so we dont need empty onclick