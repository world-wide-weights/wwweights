import "material-symbols";
import "../../styles/global.css";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  describe("Button with onClick", () => {
    beforeEach(() => {
      cy.mount(<IconButton icon="menu" onClick={() => ""} />);
    });
    it("should display component", () => {
      cy.get("button");
    });
    it("should display icon", () => {
      cy.get("button i").should("be.visible");
    });

    describe("Button should have hover effect", () => {
      beforeEach(() => {
        cy.mount(<IconButton icon="menu" onClick={() => ""} />);
        cy.get("button").trigger('mouseover')
      });
      it("should have hover", () => {
        cy.get('button').should('have.class', 'cursor-pointer hover:bg-gray-200 focus:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center')
      })
    });

    describe("Button should be disabled", () => {
      beforeEach(() => {
        cy.mount(<IconButton icon="menu" disabled onClick={() => ""} />);
      });
      it("should be disabled", () => {
        cy.get('button').should('have.class', 'cursor-default')
        cy.get("button").should("be.disabled")
      })
      it("icon should have opacity", () => {
        cy.get('button i').should('have.class', 'text-opacity-50')
      })
    });

    describe("Button should be active", () => {
      beforeEach(() => {
        cy.mount(<IconButton icon="menu" active onClick={() => ""} />);
      });
      it("should be active", () => {
        cy.get('button').should('have.class', 'cursor-default')
      })
    });
  });

  describe("Button as link", () => {
    beforeEach(() => {
      cy.mount(<IconButton icon="menu" to="/weights" />);
    });
    it("should display component", () => {
      cy.get("a").should("be.visible");
    });
    it("should display icon", () => {
      cy.get("a i").should("be.visible");
    });

    describe("Link should have hover effect", () => {
      beforeEach(() => {
        cy.mount(<IconButton icon="menu" to="/weights" />);
        cy.get("a").trigger('mouseover')
      });
      it("should have hover", () => {
        cy.get('a').should('have.class', 'cursor-pointer hover:bg-gray-200 focus:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center')
      })
    });

    describe("Link should be disabled", () => {
      beforeEach(() => {
        cy.mount(<IconButton icon="menu" disabled to="/weights" />);
      });
      it("should be disabled", () => {
        cy.get('a').should('have.class', 'cursor-default')
      })
      it("icon should have opacity", () => {
        cy.get('a i').should('have.class', 'text-opacity-50')
      })
    });

    describe("Link should be active", () => {
      beforeEach(() => {
        cy.mount(<IconButton icon="menu" active to="/weights" />);
      });
      it("should be active", () => {
        cy.get('a').should('have.class', 'cursor-default')
      })
    });
  });

});

export {};
