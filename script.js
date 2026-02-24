// script.js

// Função para processar a compra
function enviarPedidoDiscord(nomeProduto) {
    // 1. Pega a opção que o cliente selecionou na caixinha
    const select = document.getElementById('quantidade');
    const pacoteEscolhido = select.options[select.selectedIndex].text;
    
    // 2. Cole aqui o link do Webhook do canal de vendas do seu Discord
    const webhookUrl = 'COLE_AQUI_A_URL_DO_SEU_WEBHOOK';

    // 3. Monta a mensagem bonitinha que vai aparecer no seu servidor
    const mensagem = {
        content: `🛒 **Novo Pedido na BitResell Store!**\n\n📦 **Produto:** ${nomeProduto}\n💎 **Pacote:** ${pacoteEscolhido}\n\n*Aguardando o cliente no servidor para finalizar o Pix.*`
    };

    // 4. Envia a informação pro Discord
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensagem)
    })
    .then(response => {
        // Se der certo, avisa o cliente e manda ele pro seu servidor!
        alert('Pedido registrado com sucesso! Você será redirecionado para o nosso Discord para receber sua chave/transferência.');
        
        // Coloque o link de convite do seu Discord aqui
        window.location.href = 'https://discord.gg/SEU_CONVITE_AQUI'; 
    })
    .catch(error => {
        alert('Opa, deu um erro de conexão. Tente novamente!');
        console.error(error);
    });
}
