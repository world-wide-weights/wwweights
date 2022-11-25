import { BaseError } from "../components/Errors/BaseError";

/**
 * Custom 500 Page, comes when some error occures on server side.
 */
export default function Custom500() {
    return <BaseError headline="500 - Error on Server Side" description={<>
        <p>An error has occurred on our side. First try again. If that doesn&apos;t help, contact us here or wait until we fix the problem.</p>
    </>} />
}