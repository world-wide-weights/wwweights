import { TextInput } from "../Form/TextInput/TextInput"

/** 
 * Search, can only be used with Formik
 */
export const Search: React.FC = () => <TextInput placeholder="How much weighs?" datacy="search" name="query" icon="search" iconOnClick={() => ""} iconButtonIsSubmit /> // TODO (Zoe-Bot): Ref text input so we dont need empty onclick