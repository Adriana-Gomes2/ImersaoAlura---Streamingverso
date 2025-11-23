// Guarda qual tipo de conteúdo estamos vendo no momento: 'series' ou 'filmes'.
let tipoAtual = 'series';

// Esta função busca os dados das séries ou filmes nos arquivos.
async function buscarDados(tipo) {
    // Decide qual arquivo carregar com base no 'tipo' (series ou filmes).
    const arquivo = tipo === 'series' ? 'Dataseries.json' : 'Datafilmes.json';
    try {
        // Tenta carregar o arquivo. 'await' espera a resposta chegar.
        const response = await fetch(arquivo);
        if (!response.ok) {
            // Se algo der errado ao carregar, avisa no console.
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Transforma os dados do arquivo em um formato que o JavaScript entende.
        const data = await response.json();
        return data;
    } catch (error) {
        // Se ocorrer um erro, ele será mostrado no console do navegador.
        console.error("Erro ao buscar os dados:", error);
        return [];
    }
}

// Esta função desenha os cards na tela para cada filme ou série.
function renderizarCards(dados) {
    // Encontra o lugar na página onde os cards vão aparecer.
    const container = document.querySelector('.card-container');
    // Limpa a tela antes de mostrar os novos cards.
    container.innerHTML = '';
    // Para cada item na lista de dados (cada filme ou série)...
    dados.forEach(item => {
        // ...cria o HTML para o card com as informações do item.
        const card = `
            <article>
                <img src="${item.imagem}" alt="Pôster de ${item.nome}">
                <div class="card-content">
                    <h2>${item.nome}</h2>
                    <p>${item.descricao}</p>
                    <p><strong>Gênero:</strong> ${item.genero}</p>
                    <p><strong>Onde Assistir:</strong> ${item.onde_assistir}</p>
                    <a href="${item.link}" target="_blank">Mais detalhes</a>
                </div>
            </article>
        `;
        // Adiciona o card que acabamos de criar na página.
        container.innerHTML += card;
    });
}

// Função principal que organiza tudo: busca os dados e manda desenhar na tela.
async function buscarErenderizar(tipo) {
    // Atualiza a variável para saber se estamos mostrando séries ou filmes.
    tipoAtual = tipo;
    // Pega os dados usando a função que criamos antes.
    const dados = await buscarDados(tipo);
    // Pega o que o usuário digitou no campo de busca.
    const termoBusca = document.getElementById('input-busca').value.toLowerCase();

    // Filtra a lista, mostrando apenas os itens que têm o nome parecido com a busca.
    const dadosFiltrados = dados.filter(item => 
        item.nome.toLowerCase().includes(termoBusca)||
        item.descricao.toLowerCase().includes(termoBusca)||
        item.genero.toLowerCase().includes(termoBusca)||
        item.onde_assistir.toLowerCase().includes(termoBusca)
    );

    // Manda desenhar na tela apenas os cards que foram filtrados.
    renderizarCards(dadosFiltrados);
}

// Espera a página HTML carregar completamente antes de rodar o código abaixo.
document.addEventListener('DOMContentLoaded', () => {
    // Encontra o botão de busca na página.
    const botaoBusca = document.getElementById('botao-busca');
    // Faz o botão de busca funcionar: quando clicado, ele chama a função de buscar e renderizar.
    botaoBusca.addEventListener('click', () => buscarErenderizar(tipoAtual));

    // Carrega as séries na tela assim que a página abre.
    buscarErenderizar('series');
});