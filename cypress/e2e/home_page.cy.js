const SERVER_ADDRESS = `http://localhost:3000/`

describe("Go to home page", () => {
    it("the h1 contains the correct text", () => {
      cy.visit(SERVER_ADDRESS)
      cy.get("h1").contains("Wurdz")
    })
  })