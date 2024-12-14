// Seleciona os elementos do formulário
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

//seleciona os elementos da lista
const expenseList = document.querySelector('ul')
const expensesQuantity = document.querySelector('aside header p span')
const expensesTotal = document.querySelector('aside header h2')

//captura o evento de input para formatar o valor
amount.oninput = () => {
  //obtem o valor atual do input e remove os caracteres nao numericos
  let value = amount.value.replace(/\D/g, '')

  //transformar o valor em centavos
  value = Number(value)/100

  //atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
  //formata o valor padrao brl que é brasileiro
  value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  return value
}

//captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  //previne o comportamento padrao de recarregar a pagina
  event.preventDefault()

  //cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  }

  //chama a função que irá add o item na lista
  expenseAdd(newExpense)
}

//cria o elemento para adicionar na lista
function expenseAdd(newExpense) {
  try{
    //criar um elemento de li para adicionar o item na lista
    const expenseItem = document.createElement('li')
    expenseItem.classList.add('expense')

    //cria o icone da categoria
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute('alt', newExpense.category_name)

    //criar a info da despesa
    const expenseInfo = document.createElement('div')
    expenseInfo.classList.add('expense-info')

    //cria o nome da despesa
    const expenseName = document.createElement('strong')
    expenseName.textContent = newExpense.expense

    //cria a categoria da despesa
    const expenseCategory = document.createElement('span')
    expenseCategory.textContent = newExpense.category_name

    //insere os nomes na div info
    expenseInfo.append(expenseName, expenseCategory)

    //cria o valor da despesa
    const expenseAmount = document.createElement('span')
    expenseAmount.classList.add('expense-amount')

    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`
  
    //cria o icone de remover
    const removeIcon = document.createElement('img')
    removeIcon.classList.add('remove-icon')
    removeIcon.setAttribute('src', 'img/remove.svg')
    removeIcon.setAttribute('alt', 'remover')

    //adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //adiciona o item na lista
    expenseList.append(expenseItem)

    //limpa o form para add um novo item
    formClear()
    
    //atualiza os totais
    updateTotals()


  } catch (err) {
    alert('Não foi possivel atualizar a lista de despesas.')
    console.log(err)
  }
}

//atualiza os totais
function updateTotals(){
  try{
    //recupera todos os itens da lista
    const items = expenseList.children

    //atualiza a quantidade de items da lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`

    //variavel para incrementar o total
    let total = 0

    //percorre cada item da lista
    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector('.expense-amount')

      //remove caracteres nao numericos pelo regex e substitui a , por .
      let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',','.')

      //converte o valor para float
      value = parseFloat(value)

      //verifica se é valido
      if(isNaN(value)){
        return alert('Não foi possivel calcular o total. O valor não parece ser um número.')
      }

      //incrementar o valor total
      total += Number(value)
    }

    //cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement('small')
    symbolBRL.textContent = 'R$'

    //formata o valor e remove o r$ que será exibido pela small com um estilo que vem do css
    total = formatCurrencyBRL(total).toUpperCase().replace('R$','')

    //limpa o conteudo do elemento
    expensesTotal.innerHTML = ''

    //adiciona o simbolo e o total ao elemento
    expensesTotal.append(symbolBRL, total)
  }catch(err){
    console.log(err)
    alert('Não foi possivel atualizar os totais.')
  }
}

//evento que captura clique nos itens da lista.
expenseList.addEventListener('click', function(event) {
  //verifica se o elemento clicado é o icone de remover
  if(event.target.classList.contains('remove-icon')){
    //obtem a li pai do elemento clicado
    const item = event.target.closest('.expense')

    //remove o item da lista
    item.remove()
  }

  //atualiza os totais
  updateTotals()
})

function formClear(){
  //limpa os inputs
  expense.value = ''
  category.value = ''
  amount.value = ''

  //coloca o foco no input
  expense.focus()
}