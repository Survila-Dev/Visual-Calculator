import {} from "cypress"

describe("Testing if Add Nodes selection bar can be opened and closed.", () => {
    it("Visits the page", () => {
        cy.visit("/")
    })
    it("Clicks on add node", () => {
        cy.visit("/")
        cy.contains("Add Nodes").click()
        cy.contains("Variable").should("be.visible")
        cy.contains("Output").should("be.visible")
        cy.contains("Add").should("be.visible")
        cy.contains("Substract").should("be.visible")
        cy.contains("Multiply").should("be.visible")
        cy.contains("Divide").should("be.visible")
        cy.contains("Fork").should("be.visible")
    })
    it("Clicks on add node and clicks on workspace to not display selection bar anymore", () => {
        cy.visit("/")
        cy.contains("Add Nodes").click()
        cy.contains("Variable").should("be.visible")
        cy.contains("Output").should("be.visible")
        cy.contains("Add").should("be.visible")
        cy.contains("Substract").should("be.visible")
        cy.contains("Multiply").should("be.visible")
        cy.contains("Divide").should("be.visible")
        cy.contains("Fork").should("be.visible")

        cy.get("html").click(40,40)
        cy.contains("Variable").should("not.exist")
        cy.contains("Output").should("not.exist")
        cy.contains("Substract").should("not.exist")
        cy.contains("Multiply").should("not.exist")
        cy.contains("Divide").should("not.exist")
        cy.contains("Fork").should("not.exist")


    })
})

describe("Testing if handling of single node works", () => {
    it("Drags variable node to workspace", () => {
        cy.visit("/")
        cy.contains("Add Nodes").click()
        cy.contains("Variable").trigger("mousedown")
        cy.contains("Variable").trigger('mousemove', { clientX: 200, clientY: 300 })
        cy.contains("Variable").trigger("mouseup")
        cy.get("html").click(40,40)

        cy.contains("Variable").should("be.visible")
        

    })
    it("Drags output node to workspace and drags it couple of times", () => {
        cy.visit("/")
        cy.contains("Add Nodes").click()
        cy.contains("Output").trigger("mousedown")
        cy.contains("Output").trigger('mousemove', { clientX: 300, clientY: 300 })
        cy.contains("Output").trigger("mouseup")
        cy.get("html").click(40,40)

        cy.contains("Output").should("be.visible")

        cy.contains("Output").trigger("mousedown")
        cy.contains("Output").trigger('mousemove', { clientX: 320, clientY: 150 })
        cy.contains("Output").trigger("mouseup")
    })
    it("Changes value of variable node", () => {
        cy.visit("/")
        cy.contains("Add Nodes").click()
        cy.contains("Variable").trigger("mousedown")
        cy.contains("Variable").trigger('mousemove', { clientX: 200, clientY: 300 })
        cy.contains("Variable").trigger("mouseup")
        cy.get("html").click(40,40)

        cy.contains("Variable").should("be.visible")
        cy.get("input").should('have.value', '12')

        cy.get('input').type("{backspace}{backspace}20")
        cy.get("input").should('have.value', '20')

    })
})

describe("Draging the whole workfield", () => {
    it("Creates multiple nodes and drags the whole workfield", () => {
        cy.visit("/")
        
        cy.contains("Add Nodes").click()
        cy.contains("Output").trigger("mousedown")
        cy.contains("Output").trigger('mousemove', { clientX: 300, clientY: 300 })
        cy.contains("Output").trigger("mouseup")

        cy.contains("Variable").trigger("mousedown")
        cy.contains("Variable").trigger('mousemove', { clientX: 100, clientY: 400 })
        cy.contains("Variable").trigger("mouseup")
        cy.get("html").click(40,40)

        cy.get("html").trigger("mousedown")
        cy.get("html").trigger('mousemove', { clientX: 150, clientY: 300 })
        cy.get("html").trigger("mouseup")
    })
})