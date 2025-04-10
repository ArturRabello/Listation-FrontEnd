
/* =================================  função geradora de id  ================================ */
/* funcao que cria um id unico */
const idGenerator = () =>  {
  return crypto.randomUUID();
}

/* =================================  contador de objetos ================================ */
let countCardMenu = 0;
let countModal = 0;
let countModalCard = 0;


/* =================================  Adicionar card ao menu lateral   ================================ */

/* função responsavel por criar, adicionar e configurar os cardsMenu */
const addCardMenu = async()  => {
  const buttonAdd = document.querySelector(".add-card");
  const ul = document.querySelector(".menu-card-list");
  const newScrean = formCreateSideCardMenu();

  getAllSideCardsMenus();

  //botão para adicionar card ao menu lateral 
  buttonAdd.addEventListener("click", () => {
    //verifica se a quantidade de cards é menor que 5,
    //se sim um novo card é criado e adicionado
    if(countCardMenu < 5){
      countCardMenu++;
      ul.appendChild(newScrean);
      formSubmit(newScrean ,15 ,19 , createCard, ul, setupSideMenuCardController, postSideCardsMenu);
    }else{
      
      //se a quantidade de cards é maior que 5, exibe um formulario de alerta
      const alert = formAlertMaxCardNumbers(countCardMenu);
      const btnExit = alert.querySelector(".form-btn");

      preventDefault(alert);
      ul.appendChild(alert);

      //ao clicar no botão de sair do formulario, ele é removido
      btnExit.addEventListener("click", () => {
        alert.remove();
      });

    }
  });
}

/* função que constroi a estrutura html do card */
const createCard = (id, name, description) => {
  const li = document.createElement("li");
  li.classList.add("menu-card");
  li.setAttribute("cards-data-id", id);

  li.innerHTML = `
    <div class="menu-text-card">
        <h3>${name}</h3>
        <p>${description}</p>
    </div>
    <button class="btn-delete-card-menu">Delete</button>`;

  //ao clicar no card e não no botão de delete, os modais são exibidas 
  li.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      clearModals();
      getAllModals(id);
      showModal(id);
    }
  });

  return li;
}

/* função que configura o controle do card */
const setupSideMenuCardController = (cardElement, id) => {
  const btn_delete = cardElement.querySelector(".btn-delete-card-menu");

  //Botão de delete, o card e suas tabelas são removidas 
  btn_delete.addEventListener("click", () => {
    deleteSideMenuCard(id);
    cardElement.remove();
    removeModals(cardElement);
    countCardMenu--;
  });

  buttonAddTable(cardElement);
}

/* deleta todos os modais */
const clearModals = () => {
  const modalSection= document.querySelectorAll(".table-section");

  modalSection.forEach((modal) => {
    modal.innerHTML = "";
  });
}

/* função que controla a exibição dos modais */
const showModal = (id) => {
  addIdCardInBtnAddModal(id);
  addShowTablesForId(id);
}

/* função que anexa o id do card presente no sideMenu ao botão addTable */
const addIdCardInBtnAddModal = (id) => {
  const btnAddTable = document.querySelector(".btn-add-table");
  btnAddTable.setAttribute("cards-btn-data-id", id);
}

/* função que exibe as tabelas na tela de acordo com o id do card */
const addShowTablesForId = (id) => {
  const tables = document.querySelectorAll("[data-tables-for]");

  tables.forEach((table) => {
    // se o id do card for igual ao id da tabela, ela é exibida
    if (table.getAttribute("data-tables-for") == id) {
      table.style.display = "grid";
    }
  });
}

/* funcao que remove os modals associdas a um determinado card do menu */
const removeModals = (cardElement) =>  {
  const tables = document.querySelectorAll("[data-tables-for]");
  const cardId = cardElement.getAttribute("cards-data-id");

  tables.forEach((tables) => {
    //se o id do card for igual ao id da tabela, ela é removida
    if (tables.getAttribute("data-tables-for") == cardId) {
      tables.remove();
    }
  });
}

/* funcao que adiciona as tabelas associdas ao card presente no sideMenu */
const  buttonAddTable = (cardElement) =>{
  const btnAddTable = document.querySelector(".btn-add-table");
  const cardId = cardElement.getAttribute("cards-data-id");
  const modalSection = document.querySelector(`.table-section`);

  //botão que adiciona as tabelas
  btnAddTable.addEventListener("click", () => {
    //verifica se o id do cardMenu for igual ao id do botão addTable
    const btnId = btnAddTable.getAttribute("cards-btn-data-id");
    if (btnId == cardId) {
      //verifica se a quantidade de modals é menor que 15, se sim um novo modal é criado e adicionado
      if(countModal < 15){
        countModal++;
        addModal(cardId);
      }else{
        //se a quantidade de modals é maior que 15, exibe um formulario de alerta
        const alert = formAlertMaxModals(countModal);
        const btnExit = alert.querySelector(".form-btn");

        preventDefault(alert);
        modalSection.appendChild(alert);

        btnExit.addEventListener("click", () => {
          alert.remove();
        });
      }
    }
  });
}

/* =================================  Adicionar Modal    ================================ */

/* função responsavel por criar, adicionar e configurar os modais */
const addModal = (sideMenuCard_Id) => {
  const newScrean = formCreateModal();

  const modalSection = document.querySelector(`.table-section`);
  
  modalSection.appendChild(newScrean);
  formSubmit(newScrean , 25, 27 ,createModal, modalSection, setupModalController, postModal, sideMenuCard_Id);
}

/* função que configura os botões do modal */
const setupModalController = (modalElement, id) => {
  btnExitModal(modalElement, id);
  buttonAddCardModal(modalElement);
}

/* função que cria o modal */
const createModal = (modal_Id, name, description, card_Id) => {
  const div = document.createElement("div");
  div.classList.add("table");
  div.setAttribute("data-tables-for", card_Id);
  div.setAttribute("data-table-id", modal_Id);

  div.innerHTML = `<div class="btn-exit">
          <button class="btn-exit-table">
            <img src="./img/exit.png" alt="exit" class="icon-exit" />
          </button>
        </div>
        <div class="title-table">
          <h3>${name}</h3>
          <p>${description}</p>
        </div>
        <ul class="table-card-list" id="${modal_Id}">
  
        </ul>
        <div class="btn-add-card-container">
          <button class="btn-add-card" btn-add-data-id="${modal_Id}">Add</button>
        </div> `;

  return div;
}

/* função que remove o modal */
const btnExitModal = (div, id) => {
  const btnExitModal = div.querySelector(".btn-exit-table");
  btnExitModal.addEventListener("click", () => {
    deleteModal(id);
    div.remove();
    countModal--;
  });
}

/* função que adiciona os ModalCards aos modais */
const buttonAddCardModal = (modalSection) => {
  const btnAddCard = modalSection.querySelector(".btn-add-card");
  const ul = modalSection.querySelector(".table-card-list");
  const table_Id = modalSection.getAttribute("data-table-id");
  
  btnAddCard.addEventListener("click", () => {
    //verifica se a quantidade de modals é menor que 5, se sim um novo modal é criado e adicionado
    if(countModalCard < 5){
        addModalCard(ul, table_Id);
        countModalCard++;
      }else{
        //se a quantidade de modals é maior que 5, exibe um formulario de alerta
        const alert = formAlertMaxModalCard(countModalCard);
        const btnExit = alert.querySelector(".form-btn");
        preventDefault(alert);
        modalSection.appendChild(alert);

        btnExit.addEventListener("click", () => {
          alert.remove();
        });
      }
  });
}

/* =================================  Adicionar ModalCard    ================================ */

/* função responsavel por criar, adicionar e configurar modalCards */
const addModalCard = (ul, table_Id) => {
  const newScrean = formCreateModalCard ();

  ul.appendChild(newScrean);

  formSubmit(newScrean, 24, 30000, createModalCard, ul, setupModalCardController, postModalCard, table_Id);
}

/* função que cria o modalCard */
const createModalCard = (modalCard_Id, name, description, table_Id) => {
  const li = document.createElement("li");
  li.classList.add("card-table");
  li.setAttribute("data-card-tb-for", table_Id);
  li.setAttribute("data-card-tb-id", modalCard_Id);

  li.innerHTML = `
            <div class="text-card-table">
              <h3 id="name">${name}</h3>
              <p id="description">
                ${description}
              </p>
            </div>
            <div class="btn-card-tb">
              <button class="btn-card" id="btn-card-delete">
                <img
                  src="./img/btn-delete.png"
                  alt="delete"
                  class="icon-card"
                />
              </button>
              <button class="btn-card" id="btn-card-edit">
                <img src="./img/pencil.png" alt="pencil" class="icon-card" />
              </button>
              <button class="btn-card"  id="btn-card-view">
                <img
                  src="./img/clipboard.png"
                  alt="clipboard"
                  class="icon-card"
                />
              </button>
            </div>`;


  return li;
}

/* função que configura os botões do modalCard */
const setupModalCardController = (modalCardElement, id) => {
  const btnDeleteCardTb = modalCardElement.querySelector("#btn-card-delete");
  const btnPencil = modalCardElement.querySelector("#btn-card-edit");
  const btnScreeView = modalCardElement.querySelector("#btn-card-view");

  //botão que deleta o modalCard
  btnDeleteCardTb.addEventListener("click", () => {
    deleteModalCard(id);
    modalCardElement.remove();
    countModalCard--;
  });

  //botão que edita o modalCard
  btnPencil.addEventListener("click", () => {
    formEdit(id ,26, 30000)
  });

  //botão que exibe um formulario de visualização do modalCard
  btnScreeView.addEventListener("click", async () => {
    const section = document.querySelector(".table-section");
  
    //pega os dados do modalCard presentes no bando de dados 
    const dateModalCard = await getModalCard(id);

    //cria um formulario de visualização do modalCard
    const form = formScreenViewModalCard(dateModalCard.name, dateModalCard.description);

   section.appendChild(form);

   preventDefault(form)

   const btnExit = form.querySelector(".form-btn");

    //btn que fecha o formulario de visualização
    btnExit.addEventListener("click", () =>{
    form.remove();
   })

  });
}

/* função responsavel por editar o modalCard */
const formEdit = (id, length_name, length_description) => { 
  const section = document.querySelector(".table-section");
  const form = formScreenEditModalCard();
  section.appendChild(form);

  preventDefault(form)

  const btnFormSubmit= form.querySelector(".form-btn");
  let inputName = form.querySelector(".form-input-edit");
  let inputDescription = form.querySelector(".form-textarea-content");

  btnFormSubmit.addEventListener("click", (e) => {
    //verifica se o formulario foi preenchido
    if(length_name == null || length_description == null){
      form.remove()
    }else{
      if(maxLength(length_name, length_description)){
        putModalCard(id, inputName.value, inputDescription.value);
        document.querySelector(".card-table").querySelector("#name").innerHTML = inputName.value;
        document.querySelector(".card-table").querySelector("#description").innerHTML = inputDescription.value;
        form.remove()
      }
    }
  })
}


/* ========================  Formularios para criar editar e exibir os dados dos objetos ================================== */

/* formulario utilizado para criar o CardMenu */
const formCreateSideCardMenu = () => {
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<section class="form-section">
      <form class="form-object-add">
        <h1 class="form-title">Create Card</h1>
        <div class="form-input-container-add">
          <input class="form-input" type="text" id="input-name" placeholder="Title:" />
          <p class="form-alert" id='alert-name'></p>
          <input class="form-input" type="text" id="input-description" placeholder="Description:" />
          <p class="form-alert" id='alert-description'></p>
        </div>
        <button class="form-btn">Create</button>
      </form>
    </section>`;

  return section; 
}

/* formulario utilizado para criar o modal */
const formCreateModal = () => {
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<form class="form-object-add">
        <h1 class="form-title">Create Table</h1>
        <div class="form-input-container-add">
          <input class="form-input" type="text" id="input-name" placeholder="Title:" />
          <p class="form-alert" id='alert-name'></p>
          <input class="form-input" type="text" id="input-description" placeholder="Description:" />
          <p class="form-alert" id='alert-description'></p>
        </div>
        <button class="form-btn">Edit</button>
      </form>`;

  return section;
}

/* formulario utilizado para criar o modalCard */
const formCreateModalCard = () =>{
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<form class="form-object">
        <h1 class="form-title">Create Card</h1>
        <input class="form-input-edit" type="text" id="input-name" placeholder="Title:" />
        <p class="form-alert" id='alert-name'></p>
        <textarea
          class="form-textarea-content"
          type="text"
          placeholder="Description:"
          id="input-description"
        ></textarea>
        <p class="form-alert" id='alert-description'></p>
        <button class="form-btn">Create</button>
      </form>`;

  return section;
}

/* formulario utilziado para editar o modalCard */
const formScreenEditModalCard= () => {
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<form class="form-object">
        <h1 class="form-title">Edit Card</h1>
        <input class="form-input-edit" type="text" id="input-name" placeholder="Title:" />
        <p class="form-alert" id='alert-name'></p>
        <textarea
          class="form-textarea-content"
          type="text"
          placeholder="Description:"
          id="input-description"
        ></textarea>
        <p class="form-alert" id='alert-description'></p>
        <button class="form-btn">Edit</button>
      </form>`;

  return section;
}

/* formulario que exibe o conteudo do modalCard */
function formScreenViewModalCard(name, description)
{
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<form class="form-object">
        <div class="form-conteudos-container">
          <h1 class="">${name}</h1>
        </div>
        <div
          class="form-textarea-content"
          type="text"
          placeholder="Description:"
        >${description}</div>
        <button class="form-btn">Sair</button>
      </form>`;

  return section;
}

/* formulario que alerta o usuario sobre o numero maximo de cardsMenu */
const formAlertMaxCardNumbers = (numObjects) => {
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<section class="form-section">
      <form class="form-object-add">
        <h1 class="form-title">Numero maximo de cards</h1>
        <p class="form-paragraph">O numero maximo de cards é ${numObjects}</p>
        <button class="form-btn">Exit</button>
      </form>
    </section>`
  return section
}
/* formulario que alerta o usuario sobre o numero maximo de modal */
const formAlertMaxModals = (numObjects) => {
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<section class="form-section">
      <form class="form-object-add">
        <h1 class="form-title">Numero maximo de modal</h1>
        <p class="form-paragraph">O numero maximo de modal é ${numObjects}</p>
        <button class="form-btn">Exit</button>
      </form>
    </section>`
  return section
}
 
/* formulario que alerta o usuário sobre o numero maximo de modalCard */
const formAlertMaxModalCard = (numObjects) => {
  const section = document.createElement("section");
  section.classList.add("form-section");
  section.innerHTML = `<section class="form-section">
      <form class="form-object-add">
        <h1 class="form-title">Numero maximo de modalCards</h1>
        <p class="form-paragraph">O numero maximo de modalCard é ${numObjects}</p>
        <button class="form-btn">Exit</button>
      </form>
    </section>`
  return section
}

/* ======================== Função responsavel por configurar os objetos ================================== */

/* função que cria um novo objeto com os dados do formulario */
const formSubmit = (newScreen, length_name, length_description, createObject, ul, controller, post, optionalParams = null) => {
  const btnFormSubmit= document.querySelector(".form-btn");
  preventDefault(newScreen);
  btnFormSubmit.addEventListener("click", () => {
    //verifica se o formulario esta vazio
  if(length_name == null && length_description == null){
      newScreen.remove();
    }else{
      //verifica se o numero de caracteres do nome e descrição estão dentro do limite
    if(maxLength(length_name, length_description)){
      const id = idGenerator();
      handleItemCreation(createObject, ul, controller, id, optionalParams);
      postItem(id, post, optionalParams);
      newScreen.remove();
    }
    }
  });
}

/* cria um novo objeto */
const handleItemCreation = (createObject, ul, controller, id, optionalParams = null) => {
  let inputName = document.getElementById("input-name")
  let inputDescription = document.getElementById("input-description")


 insertToObject(id, inputName.value, inputDescription.value, createObject, ul, controller, optionalParams);
}

/* insere um novo item ao objeto */
const insertToObject = (id, name, description, createObject, ul, controller, optionalParams = null) => {
  let newObject;
  if(optionalParams){
    console.log (name, description)
    newObject = createObject(id, name, description, optionalParams);
  }else{
    newObject = createObject(id, name, description);
  }

  ul.appendChild(newObject);
  controller(newObject, id);
}
  
/* ======================== Previnindo o comportamento padrão do formulário ================================== */

/*cancela o evento de submit do formulario */
const preventDefault = (form) =>{
  const formObject = form.querySelector(".form-object")
    //verifica se o formulario apresentar um elemnto com a classe .form-object 
  if(formObject){
    formObject.addEventListener("submit", function(event){
      event.preventDefault();
    })
  }else{
    form.querySelector(".form-object-add").addEventListener("submit", function(event){
    event.preventDefault();
  })
  }

}
/* ======================== Funções responsáveis por enviar os dados do formulario ================================== */
const postItem = (id, post, optionalParams = null) => {
  let inputName = document.getElementById("input-name").value
  let inputDescription = document.getElementById("input-description").value

  if(optionalParams){
    post(id, inputName, inputDescription, optionalParams);
  }else{ 
    post(id, inputName, inputDescription);
  }
}

/* funcao responsavel por verifica se o numero de caracteres dos campos do formulario estão dentro do limite */
function maxLength( length_name, length_description) {
  const inputName = document.getElementById("input-name");
  const inputDescription = document.getElementById("input-description");
  const alertName = document.getElementById("alert-name");
  const alertDescription = document.getElementById("alert-description");

  if(inputName.value.length > length_name && inputDescription.value.length > length_description){
    inputName.focus();
    alertName.innerHTML = `O limite de caracter é ${length_name}`;
    alertDescription.innerHTML = `O limite de caracter é ${length_description}`;
    return false
  }
  else if(inputName.value.length > length_name) { 
    inputName.focus();
    alertName.innerHTML = `O limite de caracter é ${length_name}`;
    return false
  }else if(inputDescription.value.length > length_description){
    inputDescription.focus();
    alertDescription.innerHTML = `O limite de caracter é ${length_description}`;
    return false
  }else{
    alertName.innerHTML = "";
    alertDescription.innerHTML = "";
    return true
  }
}


/* ================================ funções assincronas ================================== */

/* ============ getAllSideCardsMenu ============ */

const getAllSideCardsMenus = async () => {
  let url = 'http://127.0.0.1:5000/side_menu_cards/getAll';
  const ul = document.querySelector(".menu-card-list");

  try{
    const response = await fetch(url, {
      method: 'get',
    });

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); 
    if (data.SideMenuCard) {
      data.SideMenuCard.forEach(item =>{
        const newCard = createCard(item.id, item.name, item.description)
        ul.appendChild(newCard);
        setupSideMenuCardController(newCard, item.id);
        countCardMenu++;
      });

    } else {
      console.log('Nenhum dado encontrado');;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/* ===== postSideCardsMenu ===== */

const postSideCardsMenu = async (id, name, description) => {
  let url = 'http://127.0.0.1:5000/side_menu_card/create';

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('description', description);
  

  try{
    const response = await fetch(url, {
      method: 'post',
      body: formData
    })

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

     data = await response.json();

  } catch (error) {
    console.error('Error:', error);
  }
}

/* ===== deleteSideMenuCard ===== */

const deleteSideMenuCard = async (SideMenuCard_id) => {
  let url = 'http://127.0.0.1:5000/side_menu_card/delete?id=' + SideMenuCard_id;


  try{
    const response = await fetch(url, {
      method: 'delete'
    })
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

/* ===== PostModal ===== */

const postModal = async(id, name, description, SideMenuCard_id) => {
  let url = 'http://127.0.0.1:5000/modal/create';

  const formData = new FormData();

  formData.append('id', id);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('side_menu_card_id', SideMenuCard_id);

  try{
    const response = await fetch (url, {
      method: 'post',
      body: formData
    })

    if(!response.ok){
      throw new error(`HTTP error! status: ${response.status}`)
    }

  }catch{
    console.error('Error:', error);
  }
}

/* ===== getAllModal ===== */

const getAllModals = async (side_menu_card_id) => {
  let url = 'http://127.0.0.1:5000/modal/getAll?side_menu_card_id=' + side_menu_card_id;
  const section = document.querySelector(".table-section");

  try{
    const responses = await fetch(url, {
      method: 'get'
    })

    const data = await responses.json();
    if(data.Modals){
      data.Modals.forEach(item => {
        const newCard = createModal(item.id, item.name, item.description, item.side_menu_card_id);
        console.log(item);
        section.appendChild(newCard);
        setupModalController(newCard, item.id);
        getAllModalCards(item.id);
        countModal++;
      })
    }
    if(!responses.ok){
      throw new Error(`HTTP error! status: ${responses.status}`)
    }
  }
  catch(error){
    console.error('Error:', error);
  }
}


/* ===== deleteModal ===== */

const deleteModal = async (modal_id) => {
  let url = 'http://127.0.0.1:5000/modal/delete?id=' + modal_id;
  
  try{
    const responses = await fetch(url, {
      method: 'delete'
    })

    if(!responses.ok){
      throw new Error(`HTTP erro ! status: ${response.status}`);
    }

  } catch (error){
    console.error('Error:', error);
  }
}

/* ===== postModalCard ======= */

const postModalCard = async (id, name, description, modalCard_Id) => {
  let url = 'http://127.0.0.1:5000/modal_card/create';

  try{
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('name', name);
    formdata.append('description', description);
    formdata.append('modal_id', modalCard_Id);

    const responses = await fetch(url, {
      method: 'post',
      body: formdata
    })

    if(!responses.ok){
      throw new Error(`HTTP erro ! status: ${responses.status}`);
    }
  }catch{
    console.error('Error:', error);
  }

}

/* ======= getAllModalCard ======= */
const getAllModalCards = async (modal_id,) =>{7
  console.log(modal_id);
  let url = 'http://127.0.0.1:5000/modal_card/getAll?modal_id=' + modal_id;
  const li = document.querySelector(".table-card-list");


  try{
    const responses = await fetch(url, {
      method: 'get'
    })

    const data = await responses.json();
    if(data.modalCards && li.id == modal_id){
      data.modalCards .forEach(item => {
        const newCard = createModalCard(item.id, item.name, item.description, item.modal_id);
        console.log(item);
        li.appendChild(newCard);
        setupModalCardController(newCard, item.id);
        countModalCard++;
      })
    }
  }catch{
    console.error('Error:', error);
  }
}

/*  ===== deleteModalCard ======= */

const deleteModalCard = async (modalCard_id) => {
  let url = 'http://127.0.0.1:5000/modal_card/delete?id=' + modalCard_id;

  try{
    const responses = await fetch(url, {
      method: 'delete'
    })

    if(!responses.ok){
      throw new Error(`HTTP erro ! status: ${response.status}`);
    }
    }catch(error){
      console.error('Error:', error);
    }
  }

  /* ==== EditModalCard ==== */

  const putModalCard = async (modalCard_id, name, description) => {
    let url = 'http://127.0.0.1:5000/modal_card/update?id='

    try{
      const formData = new FormData();
      formData.append('id', modalCard_id);
      formData.append('name', name);
      formData.append('description', description);

      const responses = await fetch(url,{
        method: 'put',
        body: formData
      })


      if(!responses.ok){
        throw new Error(`HTTP erro ! status ${error.status}`)
      }

    }catch{
      console.error('Error:', error)
    }
  }

  /* ==== getModalcard ==== */

  const getModalCard = async (modalCard_id) => {
    let url = 'http://127.0.0.1:5000/modal_card/get?id=' + modalCard_id;
    
    try{
      const responses = await fetch(url, {
        method: 'get',
      })

      if(!responses.ok){
        throw new Error(`HTTP erro ! status ${error.status}`)
      }

      const  data = await responses.json();
      return data;

    }catch{
      console.error('Error:', error)
  }
  }

  addCardMenu();