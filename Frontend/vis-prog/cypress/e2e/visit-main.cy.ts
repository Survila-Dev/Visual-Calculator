import {} from "cypress";

describe('Testing the rendering of the main page', () => {
  it('The page loads', () => {
    cy.visit("/")
  })
})