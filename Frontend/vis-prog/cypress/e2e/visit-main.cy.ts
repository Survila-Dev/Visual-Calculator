import {} from "cypress";

describe('Testing the rendering of the main page', () => {
  it('The page loads', () => {
    cy.visit("/")
  })
})

// cypress basics:
describe("This is a test 1.", () => {
  it("it works 1", () => {
    // get element which contains text
    cy.contains('Text')
    // get element by jQuery similar query
    cy.get('.main')
    // chaning is also possible: an element within main which contains "Text"
    cy.get('.main').contains('Text')
    // a custom timeout can also be given (default is 4000)
    cy.get('.my-slow-selector', { timeout: 10000 })
    // typing something to an element
    cy.get('textarea.post-body').type('This is an excellent post.')

    // asserting about elements
    cy.get(':checkbox').should('be.disabled')
    cy.get('form').should('have.class', 'form-horizontal')
    cy.get('input').should('not.have.value', 'US')

    // setting alias for elements
    cy.get('.my-selector')
      .as('myElement') // sets the alias
      .click()
    /* many more actions */
    cy.get('@myElement') // re-queries the DOM as before
      .click()

    //! All commands are async that is why they intereact so poorly with sync code
    cy.then(() => {
      // Sync code here should work fine with the rest of async code
    })

    // Such recursive usage of a function is allowed
    const checkAndReload = () => {
      // get the element's text, convert into a number
      cy.get('#result')
        .should('not.be.empty')
        .invoke('text')
        .then(parseInt)
        .then((number) => {
          // if the expected number is found
          // stop adding any more commands
          if (number === 7) {
            cy.log('lucky **7**')
    
            return
          }
    
          // otherwise insert more Cypress commands
          // by calling the function after reload
          cy.wait(500, { log: false })
          cy.reload()
          checkAndReload()
        })
    }
    
    cy.visit('public/index.html')
    checkAndReload()
    })
})