import 'material-symbols';
import '../../styles/global.css';
import { Button } from './Button';

describe('Button', () => {
  describe('Primary Button', () => {
    it('should display primary button', () => {
      cy.mount(<Button kind="primary" onClick={() => ""}>Test</Button>)
      cy.get('button').should('have.class', 'bg-blue-500')
    })

    describe('Icon', () => {
      it('should display icon', () => {
        cy.mount(<Button kind="primary" icon="face" onClick={() => ""}>Test</Button>)
        cy.get('button i').should('be.visible')
      })
    })

    describe('Loading', () => {
      beforeEach(() => {
        cy.mount(<Button kind="primary" loading icon="face" onClick={() => ""}>Test</Button>)
      })

      it('should disable button when loading', () => {
        cy.get('button').should('have.class', 'text-opacity-75')
        cy.get('button').should('have.class', 'opacity-80')
        cy.get('button').should('have.attr', 'disabled')
      })

      it('should show loading icon when loading', () => {
        cy.get('button i').should('contain', 'sync')
      })
    })

    describe('Disabled', () => {
      beforeEach(() => {
        cy.mount(<Button kind="primary" disabled icon="face" onClick={() => ""}>Test</Button>)
      })

      it('should have disabled attribute', () => {
        cy.get('button').should('have.attr', 'disabled')
      })

      it('should have disabled classes', () => {
        cy.get('button').should('have.class', 'text-opacity-75')
        cy.get('button').should('have.class', 'opacity-80')
      })
    })
  })

  describe('Primary Link', () => {
    it('should display primary link', () => {
      cy.mount(<Button kind="primary" to="/">Test</Button>)
      cy.get('a').should('have.class', 'bg-blue-500')
    })

    it('should display primary button', () => {
      cy.mount(<Button kind="primary" to="/">Test</Button>)
      cy.get('a').should('have.class', 'bg-blue-500')
    })

    describe('Icon', () => {
      it('should display icon', () => {
        cy.mount(<Button kind="primary" icon="face" to="/">Test</Button>)
        cy.get('a i').should('be.visible')
      })
    })

    describe('Loading', () => {
      beforeEach(() => {
        cy.mount(<Button kind="primary" to="/" loading icon="face">Test</Button>)
      })

      it('should disable link when loading', () => {
        cy.get('a').should('have.class', 'text-opacity-75')
        cy.get('a').should('have.class', 'opacity-80')
        cy.get('a').invoke('attr', 'href').should('eq', '')
      })

      it('should show loading icon when loading', () => {
        cy.get('a i').should('contain', 'sync')
      })
    })

    describe('Disabled', () => {
      beforeEach(() => {
        cy.mount(<Button kind="primary" to="/" disabled icon="face">Test</Button>)
      })

      it('should have empty href', () => {
        cy.get('a').invoke('attr', 'href').should('eq', '')
      })

      it('should have disabled classes', () => {
        cy.get('a').should('have.class', 'text-opacity-75')
        cy.get('a').should('have.class', 'opacity-80')
      })
    })
  })

  describe('Secondary button', () => {
    it('should display secondary button', () => {
      cy.mount(<Button kind="secondary" onClick={() => ""}>Test</Button>)
      cy.get('button').should('have.class', 'border-blue-500')
      cy.get('button').should('have.class', 'text-blue-500')
    })

    describe('Icon', () => {
      it('should display icon', () => {
        cy.mount(<Button kind="secondary" icon="face" onClick={() => ""}>Test</Button>)
        cy.get('button i').should('be.visible')
      })
    })

    describe('Loading', () => {
      beforeEach(() => {
        cy.mount(<Button kind="secondary" loading icon="face" onClick={() => ""}>Test</Button>)
      })

      it('should disable button when loading', () => {
        cy.get('button').should('have.class', 'text-opacity-75')
        cy.get('button').should('have.class', 'opacity-80')
        cy.get('button').should('have.attr', 'disabled')
      })

      it('should show loading icon when loading', () => {
        cy.get('button i').should('contain', 'sync')
      })
    })

    describe('Disabled', () => {
      beforeEach(() => {
        cy.mount(<Button kind="secondary" disabled icon="face" onClick={() => ""}>Test</Button>)
      })

      it('should have disabled attribute', () => {
        cy.get('button').should('have.attr', 'disabled')
      })

      it('should have disabled classes', () => {
        cy.get('button').should('have.class', 'text-opacity-75')
        cy.get('button').should('have.class', 'opacity-80')
      })
    })
  })

  describe('Secondary link', () => {
    it('should display secondary link', () => {
      cy.mount(<Button kind="secondary" to="/">Test</Button>)
      cy.get('a').should('have.class', 'border-blue-500')
      cy.get('a').should('have.class', 'text-blue-500')
    })

    describe('Icon', () => {
      it('should display icon', () => {
        cy.mount(<Button kind="secondary" icon="face" to="/">Test</Button>)
        cy.get('a i').should('be.visible')
      })
    })

    describe('Loading', () => {
      beforeEach(() => {
        cy.mount(<Button kind="secondary" to="/" loading icon="face">Test</Button>)
      })

      it('should disable link when loading', () => {
        cy.get('a').should('have.class', 'text-opacity-75')
        cy.get('a').should('have.class', 'opacity-80')
        cy.get('a').invoke('attr', 'href').should('eq', '')
      })

      it('should show loading icon when loading', () => {
        cy.get('a i').should('contain', 'sync')
      })
    })

    describe('Disabled', () => {
      beforeEach(() => {
        cy.mount(<Button kind="secondary" to="/" disabled icon="face">Test</Button>)
      })

      it('should have empty href', () => {
        cy.get('a').invoke('attr', 'href').should('eq', '')
      })

      it('should have disabled classes', () => {
        cy.get('a').should('have.class', 'text-opacity-75')
        cy.get('a').should('have.class', 'opacity-80')
      })
    })
  })

  describe('Tertiary button', () => {
    it('should display tertiary button', () => {
      cy.mount(<Button kind="tertiary" onClick={() => ""}>Test</Button>)
      cy.get('button').should('have.class', 'text-grey-600')
    })

    describe('Icon', () => {
      it('should display icon', () => {
        cy.mount(<Button kind="tertiary" icon="face" onClick={() => ""}>Test</Button>)
        cy.get('button i').should('be.visible')
      })
    })

    describe('Loading', () => {
      beforeEach(() => {
        cy.mount(<Button kind="tertiary" loading icon="face" onClick={() => ""}>Test</Button>)
      })

      it('should disable button when loading', () => {
        cy.get('button').should('have.class', 'text-opacity-75')
        cy.get('button').should('have.class', 'opacity-80')
        cy.get('button').should('have.attr', 'disabled')
      })

      it('should show loading icon when loading', () => {
        cy.get('button i').should('contain', 'sync')
      })
    })

    describe('Disabled', () => {
      beforeEach(() => {
        cy.mount(<Button kind="tertiary" disabled icon="face" onClick={() => ""}>Test</Button>)
      })

      it('should have disabled attribute', () => {
        cy.get('button').should('have.attr', 'disabled')
      })

      it('should have disabled classes', () => {
        cy.get('button').should('have.class', 'text-opacity-75')
        cy.get('button').should('have.class', 'opacity-80')
      })
    })
  })

  describe('Tertiary link', () => {
    it('should display tertiary link', () => {
      cy.mount(<Button kind="tertiary" to="/">Test</Button>)
      cy.get('a').should('have.class', 'text-grey-600')
    })

    describe('Icon', () => {
      it('should display icon', () => {
        cy.mount(<Button kind="tertiary" icon="face" to="/">Test</Button>)
        cy.get('a i').should('be.visible')
      })
    })

    describe('Loading', () => {
      beforeEach(() => {
        cy.mount(<Button kind="tertiary" to="/" loading icon="face">Test</Button>)
      })

      it('should disable link when loading', () => {
        cy.get('a').should('have.class', 'text-opacity-75')
        cy.get('a').should('have.class', 'opacity-80')
        cy.get('a').invoke('attr', 'href').should('eq', '')
      })

      it('should show loading icon when loading', () => {
        cy.get('a i').should('contain', 'sync')
      })
    })

    describe('Disabled', () => {
      beforeEach(() => {
        cy.mount(<Button kind="tertiary" to="/" disabled icon="face">Test</Button>)
      })

      it('should have empty href', () => {
        cy.get('a').invoke('attr', 'href').should('eq', '')
      })

      it('should have disabled classes', () => {
        cy.get('a').should('have.class', 'text-opacity-75')
        cy.get('a').should('have.class', 'opacity-80')
      })
    })
  })
})

export { };

