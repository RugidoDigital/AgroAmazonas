document.addEventListener("DOMContentLoaded", function() {
    loja.eventos.init();
});

var loja = {};

loja.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        carrinhoDeCompras.carregarCarrinho();
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterProdutosCarrinho();
    }
}

loja.metodos = {
    
    voltarParaAnterior: () => {
        if (window.history.length > 1) {
            // Voltar para a página anterior
            window.history.back();
        } else {
            // Caso não haja página anterior, redirecionar para a rota principal ou outra página
            window.location.href = '/';
        }
    },

    atualizarBadge:(value) =>{
        //var badgeSpan = document.getElementById('badgeCart');
        //badgeSpan.textContent = value;
    },

    obterProdutosCarrinho:() => {

        carrinhoDeCompras.carregarCarrinho();
        let itens = carrinhoDeCompras.itens;        
        console.log("Elementos Relacionados ",itens);

        if(itens.length == 0){
            console.log(" Carrinho vazio >>>>>>>");
            loja.metodos.carrinhoVazio();
        }else{
            loja.metodos.carrinhoCheio();
        }

        $("#itensProdutosCarrinho").html('');
        console.log("itens :", carrinhoDeCompras.itens.length);

        for (var i = 0; i < itens.length; i++) {
            let preco = parseFloat(itens[i].preco).toFixed(2).replace('.', ',');
            let quantidade = parseInt(itens[i].quantidade);
            let total = (parseFloat(itens[i].preco) * quantidade).toFixed(2).replace('.', ','); // Valor do produto com base na quantidade
            console.log("Valor Unitário >>>>", total);
            let temp = loja.templates.itemCarrinho
                .replace(/\${img}/g, itens[i].img)
                .replace(/\${name}/g, itens[i].name)
                .replace(/\${id}/g, parseInt(itens[i].id))// Convertendo o ID para número aqui
                .replace(/\${qtd}/g, itens[i].quantidade) 
                .replace(/\${price}/g, preco)// Preço unitário
                .replace(/\${total}/g, total) // Valor total
    
            // Adiciona os itens ao #itensProdutos
            $("#itensProdutosCarrinho").append(temp);
        }

        loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());

    },

    btnSubtract: (id) => {
        let quantityLabel = document.getElementById('quantity-label-' + id);
        let quantidade = parseInt(quantityLabel.textContent);  // Aqui também é importante garantir que a quantidade é um número
    
        if (quantidade > 1) {
            quantidade--;
            quantityLabel.textContent = quantidade;
    
            carrinhoDeCompras.alterarQuantidade(parseInt(id), quantidade);  // Converta o ID em número
            loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());
        }
    },

    btnAdd: (id) => {
        let quantityLabel = document.getElementById('quantity-label-' + id);
        let quantidade = parseInt(quantityLabel.textContent);
    
        quantidade++;
        quantityLabel.textContent = quantidade;
    
        carrinhoDeCompras.alterarQuantidade(parseInt(id), quantidade);  // Converta o ID em número
        loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());
    },
    btnRemove: (id) => {
        carrinhoDeCompras.removerItem(parseInt(id));  // Converta o ID em número
        loja.metodos.atualizarBadge(carrinhoDeCompras.calcularTotalQuantidade());
        loja.metodos.obterProdutosCarrinho();
        loja.metodos.atualizarValorTotal(loja.metodos.obterValorTotal());
    },

    atualizarValorTotal:(value) =>{
        let valorTotal = document.getElementById('total-carrinho');
        if(valorTotal != null){
            valorTotal.textContent = " R$ " + value.replace('.', ',');
        } else {valorTotal.textContent = "0,00" + " R$";}
    },

    obterValorTotal:() =>{
        let valorTotal = carrinhoDeCompras.calcularTotal();
        console.log('valor total', valorTotal);
        return valorTotal;
    },

    carrinhoVazio:() =>{

        $("#btn-finalizar-compra").addClass("disable");
        $("#div-de-alerta").removeClass("disable");
    },

    carrinhoCheio:() =>{

        $("#div-de-alerta").addClass("disable");
        $("#btn-finalizar-compra").removeClass("disable");

    },

}

loja.templates = {

    itemCarrinho:`
   
        <div class="container col mb-4 card custom-card">
            <div class="overflow-auto">
                <div class="blog-card">
                    <!-- Remoção -->
                    <div class="read-more" style="position: absolute; top: 0; right: 0; z-index: 2">
                        <a class="btn btn-outline-danger border-0 mt-auto" onclick="loja.metodos.btnRemove(\${id})"> 
                            <i class="bi bi-trash-fill"></i> 
                        </a>
                    </div>
                    <!-- Imagem do produto -->
                    <div class="meta card-cont-cart">
                        <div class="photo card-img-top" style="background-image: url(\${img}); background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
                    </div>
                    <!-- Detalhes do produto -->
                    <div class="description p-2">
                        <!-- Nome do produto -->
                        <h6>\${name}</h6>
                        <!-- Preço do produto -->
                        <p class="fw-bolder">
                            <h5>
                                <span class="price">
                                    <span class="currency">R$</span>
                                    <span class="value me-3" id="preco"> \${total}</span>
                                </span>
                            </h5>
                        </p>
                        <!-- Controle de quantidade -->
                        <p onclick="loja.metodos.obterProdutosCarrinho()" class="read-more">
                            <button class="btn-cart-control btn-subtract" onclick="loja.metodos.btnSubtract(\${id})">-</button>
                            <span class="quantity-label mx-2" id="quantity-label-\${id}">\${qtd}</span>
                            <button class="btn-cart-control btn-add" onclick="loja.metodos.btnAdd(\${id})">+</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,

}