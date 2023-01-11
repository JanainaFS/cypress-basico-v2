Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Teste')
    cy.get('#lastName').type('Comando')
    cy.get('#email').type('teste@comando.com')
    cy.get('#open-text-area').type('Criando primeiro com comandos')
    cy.get('button[type=submit]').click()
    cy.get('.success').should('be.visible', 'Mensagem enviada com sucesso.')
})