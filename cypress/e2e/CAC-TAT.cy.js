/// <reference types="Cypress" />

describe('Central de atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  }) 

  it('Verifica o título da aplicação ', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Janaina')
    cy.get('#lastName').type('Feitosa')
    cy.get('#email').type('teste@teste.com')
    cy.get('#open-text-area').type('Criando primeiro teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible', 'Mensagem enviada com sucesso.')
    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  it('Passando texto longo no campo de texto e alterando a propriedade de delay', () => {
    const texto = Cypress._.repeat('Estou digitando um texto longo ', 10)
    cy.get('#open-text-area').type(texto, {delay: 0})
  })

  it('Exibe mensagem de erro ao submeter um email com formatação inválida', () => {
    cy.clock()
    cy.get('#firstName').type('Teste')
    cy.get('#lastName').type('Teste')
    cy.get('#email').type('testeteste.com')
    cy.get('#open-text-area').type('Criando primeiro teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it ('Verificar campo de telefone com valores não numéricos', () => {
    cy.get('#phone')
      .type('abcdfghij')
      .should('have.value', '')
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Teste')
    cy.get('#lastName').type('Teste')
    cy.get('#email').type('teste@teste.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Criando primeiro teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('Preenche e limpa os campos de nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Teste').should('have.value', 'Teste').clear().should('have.value', '')
    cy.get('#lastName').type('Teste').should('have.value', 'Teste').clear().should('have.value', '')
    cy.get('#email').type('teste@teste.com')
      .should('have.value', 'teste@teste.com')
      .clear().should('have.value', '')
    cy.get('#phone').type('88988888888')
      .should('have.value', '88988888888')
      .clear().should('have.value', '')
  })

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible', 'Valide os campos obrigatórios!')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('Envia o formulário com sucesso usando um comando customizado', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible', 'Mensagem enviada com sucesso.')
    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  it('Seleciona um produto (Youtube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('Seleciona um produto (Mentoria) por seu valor', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('Seleciona um produto (Blog) por seu indice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('Marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check()
      .should('have.value', 'feedback')
  })

  it('Marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"][value="ajuda"]').check().should('be.checked')
    cy.get('input[type="radio"][value="elogio"]').check().should('be.checked')
    cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
  })

  it('Marca cada tipo de atendimento com funções each e wrap', () => {
    cy.get('input[type="radio"]').should('have.length', 3)
      .each(function($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('Marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('#check input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last().uncheck()
      .should('not.be.checked')
  })

  it('Seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('Seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture("example.json").as('sampleFile')
    cy.get('input[type="file"]#file-upload')
      .selectFile('@sampleFile')
      .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')
  })

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Testing').should('be.visible')
  })

  it('Exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('Preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  })

  it('Faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function(response) {
        const {status, statusText, body} = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })

  it.only('Encontrando o gato escondido', () => {
    cy.get('span[id="cat"]')
      .invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Eu 💚 gatos!')
  })

})