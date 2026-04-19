const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const filtro = document.getElementById('filtroProduto');

const totalProdutos = document.getElementById('totalProdutos');
const valorTotal = document.getElementById('valorTotal');

let produtos = [];
let editando = null;

// LOAD
function carregar() {
    const data = localStorage.getItem('produtos');
    produtos = data ? JSON.parse(data) : [];
}

// SAVE
function salvar() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// SUBMIT
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);

    if (!nome || preco <= 0) return;

    if (editando) {
        produtos = produtos.map(p =>
            p.id === editando ? { ...p, nome, preco } : p
        );
        editando = null;
    } else {
        produtos.push({
            id: Date.now(),
            nome,
            preco
        });
    }

    salvar();
    form.reset();
    render();
});

// RENDER
function render() {

    const filtroTexto = filtro.value.toLowerCase();

    lista.innerHTML = '';

    produtos
        .filter(p => p.nome.toLowerCase().includes(filtroTexto))
        .forEach(produto => {

            const li = document.createElement('li');

            li.innerHTML = `
                <span>${produto.nome} - R$ ${produto.preco.toFixed(2)}</span>

                <div class="acoes">
                    <button class="editar" onclick="editar(${produto.id})">✏️Editar</button>
                    <button class="excluir" onclick="excluir(${produto.id})">🗑️Excluir</button>
                </div>
            `;

            lista.appendChild(li);
        });

    atualizarDashboard();
}

// EDITAR
function editar(id) {
    const p = produtos.find(x => x.id === id);

    document.getElementById('nomeProduto').value = p.nome;
    document.getElementById('precoProduto').value = p.preco;

    editando = id;
}

// EXCLUIR (SEM MODAL)
function excluir(id) {
    produtos = produtos.filter(p => p.id !== id);
    salvar();
    render();
}

// DASHBOARD
function atualizarDashboard() {

    const total = produtos.length;
    const soma = produtos.reduce((acc, p) => acc + p.preco, 0);

    totalProdutos.innerText = `Produtos: ${total}`;
    valorTotal.innerText = `Total: R$ ${soma.toFixed(2)}`;
}

// FILTRO
filtro.addEventListener('input', render);

// INIT
carregar();
render();