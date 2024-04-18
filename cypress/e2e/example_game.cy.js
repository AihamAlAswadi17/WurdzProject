const SERVER_ADDRESS = `http://localhost:3000/`

describe('Play full game', () => {
    it('should wipe the input field after a valid word has been written and the submit button pressed', () => {
      cy.visit(SERVER_ADDRESS);

      // Enter text into the input field
      let inputText = 'black'; // Example text
      cy.get('#guess').type(inputText).should('have.value', inputText);

      // Click the submit button
      cy.get('button').contains('Submit').click();

      // Assert that the input field is empty after submission
      cy.get('#guess').should('have.value', '');

      inputText = 'world'
      cy.get('#guess').type(inputText).should('have.value', inputText);
      cy.get('button').contains('Submit').click();
      cy.get('#guess').should('have.value', '');

      inputText = 'music'
      cy.get('#guess').type(inputText).should('have.value', inputText);
      cy.get('button').contains('Submit').click();
      cy.get('#guess').should('have.value', '');

      inputText = 'books'
      cy.get('#guess').type(inputText).should('have.value', inputText);
      cy.get('button').contains('Submit').click();
      cy.get('#guess').should('have.value', '');

      inputText = 'games'
      cy.get('#guess').type(inputText).should('have.value', inputText);
      cy.get('button').contains('Submit').click();
      cy.get('#guess').should('have.value', '');

      inputText = 'hotel'
      cy.get('#guess').type(inputText).should('have.value', inputText);
      cy.get('button').contains('Submit').click();
      cy.get('#guess').should('have.value', '');

    });
  });
  