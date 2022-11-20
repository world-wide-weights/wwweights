import { BaseError } from "../components/Errors/BaseError";

export default function Custom500() {
    return <BaseError headline="500 - Fehler auf dem Server" description={<>
        <p>Auf unserer Seite ist ein Fehler passiert. Versuchen Sie es zunächst erneut. Wenn das nicht hilft kontaktieren sie uns hier oder warten sie bis wir den Fehler behoben haben.</p>
    </>} />
}