import "material-symbols"
import "../../styles/global.css"
import { Modal } from "./Modal"

describe("Modal", () => {
    const data = {
        modalHeading: "Modal Heading",
        content: "Hello World!",
    }

    describe("Open", () => {
        beforeEach(() => {
            cy.mount(<Modal isOpen={true} modalHeading={data.modalHeading} onDissmis={cy.spy().as("onDissmis")}>
                <p datacy="modal-content-p">{data.content}</p>
            </Modal>)
        })

        it("should be visible when open true", () => {
            cy.dataCy("modal-content").should("be.visible")
        })

        it("should display modal heading", () => {
            cy.get("h2").should("contain", data.modalHeading)
        })

        it("should display content", () => {
            cy.dataCy("modal-content-p").should("be.visible")
            cy.dataCy("modal-content-p").should("contain", data.content)
        })

        it("should call dismiss when click close icon", () => {
            cy.dataCy("modal-close-iconbutton").click()
            cy.get("@onDissmis").should("have.been.called")
        })
    })

    describe("Close", () => {
        it("should not be visible when open false", () => {
            cy.mount(<Modal isOpen={false} modalHeading={data.modalHeading} onDissmis={() => ""}>
            </Modal>)

            cy.dataCy("modal-content").should("not.exist")
        })
    })
})

export { }

