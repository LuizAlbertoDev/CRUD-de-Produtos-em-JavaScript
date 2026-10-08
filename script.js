const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const filtro = document.getElementById('filtroProduto');
const totalProdutos = document.getElementById('totalProdutos');
const valorTotal = document.getElementById('valorTotal');

let produtos = [];
let editando = null;

function carregar() {
    try {
        const dados = JSON.parse(localStorage.getItem('produtos'));
        produtos = Array.isArray(dados) ? dados : [];
    } catch {
        produtos = [];
    }
}

function salvar() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nomeProduto').value.trim();
    const preco = Number(document.getElementById('precoProduto').value);

    if (!nome || !Number.isFinite(preco) || preco <= 0) {
        return;
    }

    if (editando !== null) {
        produtos = produtos.map((produto) =>
            produto.id === editando ? { ...produto, nome, preco } : produto
        );
        editando = null;
    } else {
        produtos.push({ id: Date.now(), nome, preco });
    }

    salvar();
    form.reset();
    render();
});

function render() {
    const texto = filtro.value.trim().toLowerCase();
    lista.replaceChildren();

    produtos
        .filter((produto) => produto.nome.toLowerCase().includes(texto))
        .forEach((produto) => {
            const item = document.createElement('li');
            const descricao = document.createElement('span');
            descricao.textContent = `${produto.nome} - ${produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

            const acoes = document.createElement('div');
            acoes.className = 'acoes';

            const botaoEditar = document.createElement('button');
            botaoEditar.type = 'button';
            botaoEditar.className = 'editar';
            botaoEditar.textContent = 'Editar';
            botaoEditar.addEventListener('click', () => editar(produto.id));

            const botaoExcluir = document.createElement('button');
            botaoExcluir.type = 'button';
            botaoExcluir.className = 'excluir';
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.addEventListener('click', () => excluir(produto.id));

            acoes.append(botaoEditar, botaoExcluir);
            item.append(descricao, acoes);
            lista.appendChild(item);
        });

    atualizarDashboard();
}

function editar(id) {
    const produto = produtos.find((item) => item.id === id);
    if (!produto) return;

    document.getElementById('nomeProduto').value = produto.nome;
    document.getElementById('precoProduto').value = produto.preco;
    editando = id;
}

function excluir(id) {
    produtos = produtos.filter((produto) => produto.id !== id);
    if (editando === id) {
        editando = null;
        form.reset();
    }
    salvar();
    render();
}

function atualizarDashboard() {
    const soma = produtos.reduce((total, produto) => total + produto.preco, 0);
    totalProdutos.textContent = `Produtos: ${produtos.length}`;
    valorTotal.textContent = `Total: ${soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

filtro.addEventListener('input', render);
carregar();
render();
