document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

var loja = {};

var MEU_ENDERECO = null;

var CELULAR_EMPRESA = '5592991144098' 

// Adição de (xx) e - automático
const tel = document.getElementById('txtTelefone') // Seletor do campo de telefone
tel.addEventListener('keypress', (e) => mascaraTelefone(e.target.value)) // Dispara quando digitado no campo
tel.addEventListener('change', (e) => mascaraTelefone(e.target.value)) // Dispara quando autocompletado o campo
const mascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/^(\d{2})(\d{0})/g, "($1) $2")
    valor = valor.replace(/(\d{5})(\d{0})/, "$1-$2")
    tel.value = valor // Insere o(s) valor(es) no campo
}

loja.eventos = {

    init: () => {
        
       
    }
}

loja.metodos = {

    obterProdutosCarrinho:() =>{

        carrinhoDeCompras.carregarCarrinho();

        console.log("total preçoooo :", carrinhoDeCompras.calcularTotal());

        let itens = [];
        itens = carrinhoDeCompras.itens;
        //limpa o conteudo
        $("#itensProdutosCarrinho").html('');
        console.log("itens :", carrinhoDeCompras.itens.length);

        for (var i = 0; i < itens.length; i++) {
            let preco = parseFloat(itens[i].preco).toFixed(2).replace('.', ',');
            let quantidade = parseInt(itens[i].quantidade);
            let total = (parseFloat(itens[i].preco) * quantidade).toFixed(2).replace('.', ','); // Valor do produto com base na quantidade
            let temp = loja.templates.itemResumo
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${qtd}/g, itens[i].quantidade)
                .replace(/\${price}/g, preco)// Preço unitário
                .replace(/\${total}/g, total) // Valor total
            // Adiciona os itens ao #itensProdutos
            $("#itensProdutosCarrinho").append(temp);
        }
        
        let totallabel = document.getElementById('total_compra');
        totallabel.textContent = totallabel.textContent + carrinhoDeCompras.calcularTotal().replace('.', ',');
        
    },

    resumoPedido: () => {
        let endereco = $("#txtEndereco").val().trim();
        let nome = $("#txtNome").val().trim();
        let numeroTelefone = $("#txtTelefone").val().trim();
        let empresa = $("#txtEmpresa").val().trim();

        //let cep = $("#txtCEP").val().trim();
        //let numero = $("#txtNumero").val().trim();
        // let bairro = $("#txtBairro").val().trim();
        // let cidade = $("#txtCidade").val().trim();
        // let uf = $("#ddlUf").val().trim();
        //let complemento = $("#txtComplemento").val().trim();
        


        if (nome.length <= 3) {
            loja.metodos.mensagem('Informe o seu Nome completo, por favor.');
            $("#txtNome").focus();
            return;
        }

        if (numeroTelefone.length <= 14) {
            loja.metodos.mensagem('Informe o Telefone de Contato completo seguindo o parametro (DD)12345-6789, por favor.');
            $("#txtTelefone").focus();
            return;
        }

        if (empresa.length <= 3) {
            loja.metodos.mensagem('Informe o Nome da Empresa, por favor.');
            $("#txtEmpresa").focus();
            return;
        }
        
        if (endereco.length <= 3) {
            loja.metodos.mensagem('Informe o Endereço completo, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        // if (cep.length <= 0) {
        //     loja.metodos.mensagem('Informe o CEP, por favor.');
        //     //showToast();
        //     $("#txtCEP").focus();
        //     return;
        // }

        

        // if (bairro.length <= 0) {
        //     loja.metodos.mensagem('Informe o Bairro, por favor.');
        //     $("#txtBairro").focus();
        //     return;
        // }

        // if (cidade.length <= 0) {
        //     loja.metodos.mensagem('Informe a Cidade, por favor.');
        //     $("#txtCidade").focus();
        //     return;
        // }

        // if (uf == "-1") {
        //     loja.metodos.mensagem('Informe a UF, por favor.');
        //     $("#ddlUf").focus();
        //     return;
        // }

        // if (numero.length <= 0) {
        //     loja.metodos.mensagem('Informe o Número, por favor.');
        //     $("#txtNumero").focus();
        //     return;
        // }

        

        MEU_ENDERECO = {
            nome: nome,
            empresa: empresa,
            numeroTelefone: numeroTelefone,
            endereco: endereco,
        }

        loja.metodos.carregarResumo();

    },
    
    carregarResumo: () => {
       
        $("#Etapa2").removeClass('disable')
        $("#Etapa1").addClass('disable')

        loja.metodos.obterProdutosCarrinho();

        loja.metodos.finalizarPedido();

    },

    etapa1: () => {
        $("#Etapa2").addClass('disable')
        $("#Etapa1").removeClass('disable')
    },

    voltar: () =>{
        window.history.back();
    },

    finalizarPedido: () => {
        
        if (carrinhoDeCompras.itens.length > 0 && MEU_ENDERECO != null) {

            var texto = 'Olá! Vim pelo catálogo e gostaria de fazer meu pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}`;
            texto += `\nCliente: ${MEU_ENDERECO.nome}`;
            texto += `\nEmpresa: ${MEU_ENDERECO.empresa}`;

            console.log("Texto da mensagem:", texto);

            //texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(carrinhoDeCompras.itens, (i, e) => {

                console.log("Está rodando");
                let preco = (parseFloat(e.preco) * parseInt(e.quantidade)).toFixed(2).replace('.', ',');
                //itens += `*${e.quantidade}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;
                itens += `*${e.quantidade}x* ${e.name} - *R$ ${preco}* \n`;


                // último item
                if ((i + 1) == carrinhoDeCompras.itens.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converte a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                    console.log("final >>>>>>>", URL);

                }

            })

        }

    },

    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}


var showingToast = false; // Variável para verificar se o toast está sendo exibido

function showToast() {
    if (!showingToast) {
        let toast = `<div id="toast" class="toast hide">Mensagem de Alerta</div>`
        $("#container-mensagens").append(toast);
        $("toast").remove("hide");
        $("toast").add("show");

        showingToast = true;

       

        setTimeout(function(){
            $("toast").remove("show");
            $("toast").add("hide");

            showingToast = false;
        }, 3000); // Tempo em milissegundos (3 segundos)
    }
}

// Função para salvar as informações do cliente no localStorage
function salvarInformacoesCliente() {
    const cliente = {
        nome: document.getElementById('txtNome').value,
        endereco: document.getElementById('txtEmpresa').value,
        telefone: document.getElementById('txtTelefone').value,
        empresa: document.getElementById('txtEndereco').value
    };

    // Salva os dados do cliente no localStorage
    localStorage.setItem('cliente', JSON.stringify(cliente));
    alert("Informações salvas com sucesso!");
}

// Função para preencher automaticamente o formulário com os dados do cliente
function preencherFormulario() {
    const clienteInfo = localStorage.getItem('cliente');

    if (clienteInfo) {
        const cliente = JSON.parse(clienteInfo);

        // Preencher os campos do formulário com os dados salvos
        document.getElementById('txtNome').value = cliente.nome || '';
        document.getElementById('txtEmpresa').value = cliente.endereco || '';
        document.getElementById('txtTelefone').value = cliente.telefone || '';
        document.getElementById('txtEndereco').value = cliente.empresa || '';

        alert(`Bem-vindo de volta, ${cliente.nome}! Seus dados foram preenchidos.`);
    } else {
        alert("Nenhum dado de cliente foi encontrado.");
    }
}

loja.templates = {

    itemResumo:`
    <div class="container">
        <div class="card mb-3">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="\${img}" class="card-img" alt="Imagem do produto">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">\${name}</h5>
                        <p class="card-text">
                            <label>Preço: <span class="item-price">
                            
                                <span class="ms-2 price">
                                    <span class="currency">R$</span>
                                    <span class="value"> \${price}</span>
                                </span> 
                            
                            </label> 
                        </p>

                        <p class="card-text">
                            <label>Quantidade: </label> 
                            <span class="ms-2 value"> \${qtd}</span>
                        </p>

                        <p class="card-text">
                            <label>Sub total: </label> 
                            <span class="ms-2 price">
                            <span class="currency">R$</span>
                            <span class="value"> \${total}</span>
                            </span>
                        </p>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

}
