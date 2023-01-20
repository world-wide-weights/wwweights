import { BaseError } from "../components/Errors/BaseError"

/**
 * Custom 404 Page, occures when we enter a bad link.
 */
export default function Custom404() {
    return <BaseError headline="404 - Page not found">
        <p>Reasons can be:</p>
        <ul className="list-disc ml-10">
            <li>The requested page or file is temporarily unavailable.</li>
            <li>The requested page or file has been renamed or no longer exists.</li>
            <li>You have accessed an outdated bookmark.</li>
            <li>You entered the URL incorrectly.</li>
        </ul>
    </BaseError>
}