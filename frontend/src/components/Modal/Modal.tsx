import { IconButton } from "../Button/IconButton"
import { Headline } from "../Headline/Headline"

type ModalProps = {
    /** Is in the header of the modal, the title. */
    modalHeading: string
    /** Close/Open State of Modal. */
    open: boolean
    /** Setter for State of Modal. */
    onDissmis: (value: any) => void
    /** Content of the Modal. */
    children: React.ReactNode
    /** For Testing. */
    dataCy?: string
}

/**
 * Modal, lays over other content.
 */
export const Modal: React.FC<ModalProps> = ({ modalHeading, open, onDissmis, children, dataCy }) => {
    return <>
        {open && <div datacy={dataCy} className="fixed z-10 inset-0" role="dialog" aria-label="Modal" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">

                {/* Background overlay */}
                <div className="fixed inset-0 bg-blue-900 bg-opacity-50 transition-opacity" aria-hidden="true" onClick={onDissmis} datacy="modal-dismiss-background" />

                {/* Modal Content*/}
                <div datacy="modal-content" className="inline-block bg-white rounded-xl overflow-hidden text-left shadow-xl transform transition-all w-full sm:max-w-md px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Headline level={2} hasMargin={false}>{modalHeading}</Headline>
                        <IconButton datacy="modal-close-iconbutton" onClick={onDissmis} icon="close"></IconButton>
                    </div>
                    {children}
                </div>
                {/* Modal Content End */}
            </div>
        </div>}
    </>
}