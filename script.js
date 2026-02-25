/* =========================================
   SISTEMA DE CARRINHO - BITRESELL STORE
   ========================================= */

let carrinho = [];
let total = 0;

/**
 * Adiciona um produto ao carrinho e atualiza o contador visual
 */
function adicionarAoCarrinho(nomeProduto, preco) {
    // Adiciona o objeto do produto ao array
    carrinho.push({ nome: nomeProduto, preco: preco });
    
    // Soma o valor ao total
    total += preco;
    
    // Atualiza o contador vermelho no botão flutuante
    const contador = document.getElementById('contador-carrinho');
    contador.innerText = carrinho.length;
    
    // Pequeno feedback visual para o usuário
    console.log(`${nomeProduto} adicionado! Total: R$ ${total.toFixed(2)}`);
}

/**
 * Abre o modal e preenche a lista de itens selecionados
 */
function abrirCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const valorTotalElemento = document.getElementById('valor-total');
    
    // Limpa a lista antes de reconstruir
    lista.innerHTML = ''; 
    
    if (carrinho.length === 0) {
        lista.innerHTML = '<li style="text-align:center; border:none;">Seu carrinho está vazio.</li>';
    } else {
        // Cria cada linha do produto na lista
        carrinho.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.nome}</span>
                <span style="color: #00ff88;">R$ ${item.preco.toFixed(2)}</span>
            `;
            lista.appendChild(li);
        });
    }
    
    // Atualiza o valor total no modal
    valorTotalElemento.innerText = `R$ ${total.toFixed(2)}`;
    
    // Mostra o modal (remove a classe que o esconde)
    document.getElementById('modal-carrinho').classList.remove('escondido');
}

/**
 * Esconde o modal do carrinho
 */
function fecharCarrinho() {
    document.getElementById('modal-carrinho').classList.add('escondido');
}

/**
 * Coleta os dados e envia para o Webhook do Discord
 */
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio! Adicione algum produto antes de finalizar.");
        return;
    }

    // --- CONFIGURAÇÃO DO WEBHOOK ---
    // AVISO: Substitua o link abaixo pela URL do seu Webhook do Discord
    const webhookUrl = 'COLE_AQUI_A_URL_DO_SEU_WEBHOOK';
    
    // O link oficial do seu Discord já está configurado aqui!
    const linkDiscord = 'https://discord.gg/CWkc98fyG';

    // Formata a lista de produtos para ficar bonita no Discord
    let listaParaDiscord = carrinho.map(item => `🔹 **${item.nome}** - R$ ${item.preco.toFixed(2)}`).join('\n');

    // Monta o objeto da mensagem (JSON)
    const payload = {
        username: "BitResell Bot",
        avatar_url: "https://placehold.co/100x100/8a2be2/ffffff?text=B",
        embeds: [{
            title: "🛒 Novo Pedido Realizado!",
            color: 9055202, // Cor Roxa em Decimal
            description: "Um cliente montou um carrinho no site e está pronto para pagar.",
            fields: [
                { name: "Itens do Pedido", value: listaParaDiscord },
                { name: "Total a Pagar", value: `**R$ ${total.toFixed(2)}**`, inline: true },
                { name: "Método", value: "PIX", inline: true }
            ],
            footer: { text: "BitResell Store - Sistema de Vendas" },
            timestamp: new Date()
        }]
    };

    // Envia os dados para o Discord via POST
    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert('Pedido enviado para o nosso servidor! Você será redirecionado para o Discord para realizar o pagamento.');
            
            // Limpa o carrinho após o sucesso
            carrinho = [];
            total = 0;
            document.getElementById('contador-carrinho').innerText = 0;
            fecharCarrinho();
            
            // Redireciona o cliente para o seu Discord
            window.location.href = linkDiscord;
        } else {
            throw new Error('Erro ao enviar');
        }
    })
    .catch(error => {
        alert('Erro de conexão: Verifique se você configurou a URL do Webhook no arquivo script.js');
        console.error('Erro:', error);
    });
}

// Fecha o modal se o usuário clicar fora da caixa do carrinho
window.onclick = function(event) {
    const modal = document.getElementById('modal-carrinho');
    if (event.target == modal) {
        fecharCarrinho();
    }
}
