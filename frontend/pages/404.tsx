import { BaseError } from "../components/Errors/BaseError";

export default function Custom404() {
    return <BaseError headline="404 - Seite nicht gefunden" description={<>
        <p>Ursachen dafür können sein:</p>
        <ul className="list-disc ml-10">
            <li>Die gewünschte Seite oder Datei ist vorübergehend nicht erreichbar.</li>
            <li>Die gewünschte Seite oder Datei wurde umbenannt oder existiert nicht mehr.</li>
            <li>Sie haben ein veraltetes Lesezeichen aufgerufen.</li>
            <li>Sie haben die URL falsch eingegeben.</li>
        </ul>
    </>} />
}