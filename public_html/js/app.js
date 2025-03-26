document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

function limparCacheCompleto() {
    // Limpa localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Força o recarregamento completo
    window.location.reload(true);
}

//Barra fixa e Click-Button float - Buy Itens
const button = document.getElementById("float-button-carrinho");
button.onclick = function() {
    window.location.href = "carrinho.html";
};
window.onscroll = function() {
    var header = document.getElementById("filtro"); // Barra-Fixa da navbar id='fildro'
    var sticky = header.offsetTop; // Barra-Fixa

    var floatButton = document.querySelector('.float-button');
    if (document.documentElement.scrollTop > 225 && window.pageYOffset > sticky) { // Exibe o botão após rolar 200px
        floatButton.style.display = 'block'; // Botao carrinho float (habilitado)
        header.classList.add("sticky"); // Navbar fixa (Ativado)
    } else {
        floatButton.style.display = 'none'; // Botao carrinho float (desabilitado)
        header.classList.remove("sticky"); // Navbar fixa (Desativado)
    }
};

// Função para acionar o botão de pesquisa teclando apenas o 'Enter'
document.getElementById('inputPesquisa').addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita comportamento padrão do Enter, como o envio de um formulário.
        document.getElementById('btnPesquisar').click(); // Simula o clique no botão.
    }
});

const gerarItemHTML = (item) => {
    const preco = item.price.toFixed(2).replace('.', ',');
    return loja.templates.item
        .replace(/\${img}/g, item.img)
        .replace(/\${name}/g, item.name)
        .replace(/\${id}/g, item.id)
        .replace(/\${price-show}/g, preco)
        .replace(/\${marca}/g, item.marca)
        .replace(/\${price}/g, item.price);
};


var lastIndex = 0; // Variável global
var loja = {
    itemExibidosNoMenu: [], // Inicializa como um array vazio
    eventos: {},
    metodos: {}
};

loja.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterItensLojaInicio();
        loja.metodos.obterItensLoja();
        loja.metodos.verMais();
    }
}


loja.metodos = {

    obterItensLojaInicio: async () => {
        
        const urls = [
            "http://127.0.0.1:5500/js/dados.js"
            // https://www.produtoscampos.com.br/js/dados.js
        ];
        let MENU = null;
    
        for (const url of urls) {
            try {
                MENU = await carregarJsonAtualizado(url);
                if (MENU) break; // Sai do loop se a requisição funcionar
            } catch (error) {
                console.warn(`Erro ao carregar JSON de ${url}:`, error);
            }
        }
    
        if (!MENU) {
            console.error('Falha ao carregar o JSON de todas as URLs.');
        } else {
            loja.itemExibidosNoMenu = MENU;
            loja.metodos.obterItensLoja();
        }
    },

    feedBackBuscaFalha:() =>{
        // Limpa o conteúdo antes de adicionar os itens
        $("#itensProdutos").html('');
        $("#itensProdutos").append(loja.templates.feedbackBusca);

        $("#btnVerMais").addClass('collapse');
        //$("#btnVerMais").classList.remove('show')
    },


    obterItensLoja:(busca=false) =>{
        // Limpa o conteúdo antes de adicionar os itens, se for uma busca
        if (busca) {// Remove os itens exibidos anteriormente
            $("#itensProdutos").html('');
        }
        const tamanhoDaListagem = loja.itemExibidosNoMenu.length;
        console.log("Tamanho da listagem", tamanhoDaListagem);

        let lastIndex = $("#itensProdutos").children().length || 0;

        for (let i = lastIndex; i < tamanhoDaListagem && i < lastIndex + 25; i++) {
            const item = loja.itemExibidosNoMenu[i];
            const temp = gerarItemHTML(item); // Função auxiliar para gerar o HTML do item
            $("#itensProdutos").append(temp);
        }
        lastIndex = $("#itensProdutos").children().length;
        console.log("Momento de atribuição", lastIndex);
        
        if (lastIndex >= tamanhoDaListagem) {
            // console.log("Ocultou o botão ver mais ->");
            // console.log("Ocultou o botão ver mais -> Ultimo indice ", lastIndex);
            // console.log("Ocultou o botão ver mais -> Tamanho da listagem", tamanhoDaListagem);
            $("#btnVerMais").addClass('collapse');
        }else{
            let btnVerMais = document.getElementById("btnVerMais");
            btnVerMais.classList.remove("collapse");
            // $("#btnVerMais").remove('collapse');
        }

    },
    
    verMais: () => {

       loja.metodos.obterItensLoja();

    },

    obterItensPorTag: ( value ) => {
        var categorias = []
        switch (value) {
            case 1:
                categorias = ['CAES', 'GATOS', 'PEIXES'];
              break;

            case 2:
                categorias =['CAES'];
              break;

            case 3:
                categorias = ['GATOS'];
            break;

            case 4:
                categorias = ['ROEDORES'];
            break;

            case 5:
                categorias = ['PEIXES'];
            break;

            default:
        }

        dadosFiltrados = MENU.filter(item => categorias.includes(item.categoria));

        console.log("tags chegando ", categorias);

        console.log("resultado ", dadosFiltrados);
        
        //if (!Array.isArray(categorias)) {
        //    categorias = [categorias];
        //}

        if(dadosFiltrados.length == 0){
            loja.metodos.feedBackBuscaFalha();
        }else{
            loja.itemExibidosNoMenu = dadosFiltrados;
            loja.metodos.obterItensLoja(true);
        }

    },

    obterItensPorPesquisa: ( ) => {

        var pesquisa = $("#inputPesquisa").val();
        console.log("Teste da pesquisa ", pesquisa);

        resultados = buscarComTratamento(pesquisa);

        console.log("resultado da pesquisa", resultados);

        if(resultados != [] && resultados != false){
            
            loja.itemExibidosNoMenu = resultados;

            console.log("resultado da pesquisa", loja.itemExibidosNoMenu);
            
            loja.metodos.obterItensLoja(true);
            
        }else{
            loja.metodos.feedBackBuscaFalha();
        }
        
    },

    verPaginaDoItem: (value) =>{
        console.log(value);
        sessionStorage.setItem('item_data', value);
    },

    atualizarBadge:(value) =>{
        var badgeSpan = document.getElementById('badgeCart');
        badgeSpan.textContent = value;
    },

    btnSubtract:() =>{
        
    }

}

// Função de busca com tratamento na string de busca
function buscarComTratamento(termo) {
    // Verificar se o termo de busca é uma string não vazia e válida
    if (typeof termo !== 'string' || termo.trim() === '') {
      console.log("Termo de busca inválido ou vazio.");
      return []; // Retorna uma lista vazia se o termo de busca for inválido ou vazio
    }
  
    // Normalizar e converter para minúsculas o termo de busca
    termo = termo.normalize("NFD").toLowerCase();
  
    // Se o termo de busca for válido, proceder com a busca
    return MENU.filter(item => {
      // Verificar se o termo está contido em qualquer uma das propriedades do objeto
      for (let propriedade in item) {
        if (Object.prototype.hasOwnProperty.call(item, propriedade)) {
          // Verificar se o valor da propriedade é uma string antes de chamar toLowerCase()
          if (typeof item[propriedade] === 'string') {
            // Normalizar e converter para minúsculas a string da propriedade
            let propriedadeNormalizada = item[propriedade].normalize("NFD").toLowerCase();
            // Verificar se o termo está contido na string da propriedade normalizada
            if (propriedadeNormalizada.includes(termo)) {
              return true; // Se o termo for encontrado em qualquer propriedade, retornar true
            }
          }
        }
      }
      return false; // Se o termo não for encontrado em nenhuma propriedade, retornar false
    });
}

// fetch('https://www.produtoscampos.com.br/js/dados.js?cachebuster=' + new Date().getTime(), { mode: 'no-cors' })
//     .then(response => {
//         console.log('Requisição realizada com sucesso:', response);
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     });


async function carregarJsonAtualizado(url) {
    const urlComCacheBuster = `${url}?cachebuster=${new Date().getTime()}`;

    try {
        const response = await fetch(urlComCacheBuster);

        if (response.ok) {
            // Obtém o texto do arquivo .js
            const scriptText = await response.text();

            // Avalia o texto como código JavaScript para acessar o `MENU`
            eval(scriptText); // Certifique-se de que o arquivo é confiável

            // Retorna a variável MENU
            return MENU;
        } else {
            console.error(`Erro ao carregar o JSON: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error(`Erro na requisição: ${error.message}`);
        return null;
    }
}

function closeOtherSubMenus(currentSubMenu) {
    categoryItems.forEach(function(categoryItem) {
      const subCategoryList = categoryItem.querySelector('.sub-category-list');
      if (subCategoryList !== currentSubMenu && subCategoryList.classList.contains('show')) {
        subCategoryList.classList.remove('show');
      }
    });
 }


loja.templates = {
    
        item: `
        <div class="col-12 mb-5">
                        <div class="card h-100">
                            <!-- Product image-->

                            <div class="card-cont">
                            <img class="card-img-top" src="\${img}" alt="..." />
                            </div>

                            <!-- Product details-->
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <!-- Product name-->
                                    <h5 class="fw-bolder">\${name}</h5>
                                    <!-- Product price-->
 
                                    <span class="price">
                                        <span class="currency">R$</span>
                                        <span class="value">\${price-show}</span>
                                    </span>
                                   
                                </div>
                            </div>
                            <!-- Product actions-->
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center">
                                <a class="custom-button mt-auto" href="item.html"onclick="loja.metodos.verPaginaDoItem(['\${img}','\${name}','\${id}','\${price}','\${marca}'])"
                                >Comprar</a></div>
                            </div>
                        </div>
        </div>
    `,

    feedbackBusca:`
    <div class="feedback-busca-no-items">
        <p>Nenhum item encontrado na busca.</p>
        <div style="display: flex; justify-content: center; align-items: center">
                <button class="btn btn-outline-dark mt-auto " type="submit" onclick="loja.metodos.obterItensLojaInicio()">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Voltar a ver todas as categorias 
                </button>
        </div>
    </div>
    `

}

function showDropdown() {
    $("#dropdown-menu").addClass('show');
    //dropdownMenu.addClass("show");
}



document.addEventListener("DOMContentLoaded", function() {
    // Botão que controla o dropdown
    var dropdownButton = document.getElementById("ver_mais_link");
    // Dropdown menu
    var dropdownMenu = document.getElementById("dropdown-menu");
    // Função para exibir o dropdown
    var checkboxStates = {}; // Objeto para armazenar os estados dos checkboxes

    // Função para salvar o estado dos checkboxes
    function saveCheckboxStates() {
        categoryItems.forEach(function(item) {
            var subCategoryList = item.querySelector(".sub-category-list");
            var category = item.querySelector(".category").textContent;
            checkboxStates[category] = {}; // Criando um objeto para armazenar o estado dos checkboxes da categoria

            var checkboxes = subCategoryList.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(function(checkbox, index) {
                checkboxStates[category][index] = checkbox.checked; // Salvando o estado do checkbox
            });
        });
    }

    // Função para restaurar o estado dos checkboxes
    function restoreCheckboxStates() {
        categoryItems.forEach(function(item) {
            var subCategoryList = item.querySelector(".sub-category-list");
            var category = item.querySelector(".category").textContent;

            if (checkboxStates[category]) { // Verifica se há um estado salvo para a categoria
                var checkboxes = subCategoryList.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(function(checkbox, index) {
                    if (checkboxStates[category][index] !== undefined) { // Verifica se o estado foi salvo para o checkbox
                        checkbox.checked = checkboxStates[category][index]; // Restaura o estado do checkbox
                    }
                });
            }
        });
    }


    function showDropdown() {
        dropdownMenu.classList.add("show");
        //resetDropdown();
    }

    // Função para ocultar o dropdown
    function hideDropdown() {
        dropdownMenu.classList.remove("show");
        resetDropdown();
    }

    dropdownButton.addEventListener("click", function(event) {
        event.stopPropagation(); 
        dropdownMenu.classList.contains("show") ? hideDropdown() : showDropdown();
        if (!dropdownMenu.classList.contains("show")) { // Salvando o estado dos checkboxes ao fechar o dropdown
            saveCheckboxStates();
        } else { // Restaurando o estado dos checkboxes ao abrir o dropdown
            restoreCheckboxStates();
        }
    });

    // Evento de clique fora do dropdown para fechá-lo
    document.addEventListener("click", function(event) {
        if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
            hideDropdown();
        }
    });



    // Evento de clique nas categorias para exibir/ocultar as subcategorias
    var categoryItems = document.querySelectorAll(".category-item");

    // Fechamento das categorias abertas para restalrar 
    

    categoryItems.forEach(function(item) {
        var category = item.querySelector(".category");
        var subCategoryList = item.querySelector(".sub-category-list");
        var verTodos = item.querySelector(".ver-todos"); // Selecionando o elemento "Ver Todos"

        categoryItems.forEach(function(otherItem) {
            if (otherItem !== item) {
                otherItem.querySelector(".sub-category-list").classList.add("collapsed");
            }
        });

        category.addEventListener("click", function() {
            // Fecha todas as outras subcategorias
            categoryItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.querySelector(".sub-category-list").classList.add("collapsed");
                }
            });
            // Exibe ou oculta a subcategoria clicada
            subCategoryList.classList.toggle("collapsed");
        });

        if (verTodos) {
            var checkboxes = subCategoryList.querySelectorAll("input[type='checkbox']");
            var allChecked = false; // Variável para rastrear se todos os itens estão selecionados
        
            verTodos.addEventListener("click", function() {
                // Verifica se todos os checkboxes estão marcados
                allChecked = Array.from(checkboxes).every(function(checkbox) {
                    return checkbox.checked;
                });
        
                // Se todos estiverem marcados, desmarca todos; caso contrário, seleciona todos
                checkboxes.forEach(function(checkbox) {
                    checkbox.checked = !allChecked;
                });
            });
        }
    });

    function resetDropdown() {
        // Fecha todas as categorias
        categoryItems.forEach(function(item) {
            var subCategoryList = item.querySelector(".sub-category-list");
            subCategoryList.classList.add("collapsed");
        });
    }
});


// Função para transformar as subcategorias selecionadas
function transformarSelecao(dadosSelecionados) {
    // Expressão regular para remover acentos
    const removerAcentos = function(s) {
        return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Transforma os dados em maiúsculas e remove os acentos
    return dadosSelecionados.map(function(dado) {
        return removerAcentos(dado.toUpperCase());
    });
}

function removerAcentos(texto) {
    const mapaAcentosHex = {
      a: /[\xE0-\xE6]/g,
      e: /[\xE8-\xEB]/g,
      i: /[\xEC-\xEF]/g,
      o: /[\xF2-\xF6]/g,
      u: /[\xF9-\xFC]/g,
      c: /\xE7/g,
      n: /\xF1/g
    };
  
    for (let letra in mapaAcentosHex) {
      const expressaoRegular = mapaAcentosHex[letra];
      texto = texto.replace(expressaoRegular, letra);
    }
  
    return texto.toUpperCase();
  }


// Função para construir o objeto com as categorias e suas subcategorias
function getCategoriasSelecionadas() {
    var categoriasSelecionadas = {}; // Objeto para armazenar as categorias e suas subcategorias

    // Obtém todas as categorias selecionadas
    var categoryItems = document.querySelectorAll(".category-item input[type='checkbox']:checked");

    // Percorre as categorias selecionadas
    categoryItems.forEach(function(checkbox) {
        var category = checkbox.closest('.category-item').querySelector('.category').textContent.trim().toUpperCase(); // Obtém o texto da categoria em maiúsculas
        var subcategories = Array.from(checkbox.closest('.category-item').querySelectorAll("input[type='checkbox']:checked")).map(function(subCheckbox) {
            return subCheckbox.parentNode.textContent.trim();
        });

        categoriasSelecionadas[removerAcentos(category)] = transformarSelecao(subcategories); // Adiciona a categoria e suas subcategorias ao objeto
    });

    // Retorna o objeto com as categorias e suas subcategorias
    return categoriasSelecionadas;
}

// Evento de clique no botão "Buscar"
document.querySelector(".dropdown-btn").addEventListener("click", function() {
    var dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.classList.remove("show");

    var categoriasSelecionadas = getCategoriasSelecionadas(); // Obtém as categorias e suas subcategorias selecionadas

    console.log("Categorias selecionadas:", categoriasSelecionadas);

    var itensFiltrados = filtrarBaseDeDados(categoriasSelecionadas); // Filtra a base de dados com base nas subcategorias selecionadas
    
    
    if(itensFiltrados.length == 0){
        loja.metodos.feedBackBuscaFalha();
    }else{
        console.log("itens filtrados", itensFiltrados);
        loja.itemExibidosNoMenu = itensFiltrados;
        console.log("itens filtrados para exibir no menu", loja.itemExibidosNoMenu);
        loja.metodos.obterItensLoja(true);
    }
});

// Função para filtrar a base de dados com base nas categorias e subcategorias selecionadas
function filtrarBaseDeDados(categoriasSelecionadas) {
    var filteredData = [];

    MENU.forEach(function(item) {
        // Verifica se a categoria do item está presente nos itens selecionados
        var categoria = removerAcentos(item.categoria);
        if (categoriasSelecionadas[categoria]) {
            // Verifica se alguma das subcategorias do item está presente nas subcategorias selecionadas da categoria
            var subcategorias = categoriasSelecionadas[categoria];
            var subcategoriasItem = removerAcentos(item.sub_categoria);
            if (subcategorias.includes(subcategoriasItem)) {
                filteredData.push(item); // Adiciona o item filtrado ao array
            }
        }
    });

    // Retorna os itens filtrados
    return filteredData;
}