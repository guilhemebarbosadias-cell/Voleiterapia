let pedido = [];

let categoriaSelecionada = "";
let uniformeSelecionado = "";
let funcaoSelecionada = "";
let numeroSelecionado = "";


// URL CORRETA DO GOOGLE APPS SCRIPT / WEB APP
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";


const valores = {
    camisa: 75,
    calcaoMasc: 35,
    calcaoFem: 35,
    shortDoll: 30,
    shortSuplex: 35
};


// ======================================================
// ABRIR CONFIGURAÇÃO
// ======================================================

function abrirItem() {

    document.getElementById("configuracao").style.display = "block";

    gerarMapaNumeros();

}


// ======================================================
// SELECIONAR OFICIAL / ADICIONAL
// ======================================================

function selecionarUniforme(tipo, botao) {

    uniformeSelecionado = tipo;

    document
        .querySelectorAll(".grupoUniforme .opcao")
        .forEach(btn => {
            btn.classList.remove("ativo");
        });

    botao.classList.add("ativo");

}


// ======================================================
// SELECIONAR NORMAL / LÍBERO
// ======================================================

function selecionarFuncao(funcao, botao) {

    funcaoSelecionada = funcao;

    document
        .querySelectorAll(".grupoFuncao .opcao")
        .forEach(btn => {
            btn.classList.remove("ativo");
        });

    botao.classList.add("ativo");

}


// ======================================================
// SELECIONAR CATEGORIA
// ======================================================

function selecionarCategoria(categoria, botao) {

    categoriaSelecionada = categoria;

    document
        .querySelectorAll(".grupoCategoria .opcao")
        .forEach(btn => {
            btn.classList.remove("ativo");
        });

    botao.classList.add("ativo");

    mostrarOpcoesUniforme();

}


// ======================================================
// MOSTRAR PRODUTOS
// ======================================================

function mostrarOpcoesUniforme() {

    let area = document.getElementById("produtos");

    let tamanho = `

        <label>
            Tamanho da camisa
        </label>

        <select id="tamanhoCamisa">

            <option>PP</option>
            <option>P</option>
            <option>M</option>
            <option>G</option>
            <option>GG</option>
            <option>XGG</option>

        </select>

    `;

    let html = "";


    // MASCULINO

    if (categoriaSelecionada === "Masculino") {

        html = `

            <div class="card">

                <label>
                    Modelo da camisa
                </label>

                <select id="modeloCamisa">

                    <option>
                        Camisa masculina
                    </option>

                </select>

                ${tamanho}

                <label>
                    Adicionar calção?
                </label>

                <select
                    id="usaInferior"
                    onchange="mostrarInferior()">

                    <option value="nao">
                        Não
                    </option>

                    <option value="sim">
                        Sim
                    </option>

                </select>

                <div id="inferior"></div>

            </div>

        `;

    }


    // FEMININO

    if (categoriaSelecionada === "Feminino") {

        html = `

            <div class="card">

                <label>
                    Modelo da camisa
                </label>

                <select id="modeloCamisa">

                    <option>
                        Baby Look
                    </option>

                    <option>
                        Camisa tradicional feminina
                    </option>

                </select>

                ${tamanho}

                <label>
                    Adicionar peça inferior?
                </label>

                <select
                    id="usaInferior"
                    onchange="mostrarInferior()">

                    <option value="nao">
                        Não
                    </option>

                    <option value="sim">
                        Sim
                    </option>

                </select>

                <div id="inferior"></div>

            </div>

        `;

    }


    area.innerHTML = html;

}


// ======================================================
// MOSTRAR INFERIOR
// ======================================================

function mostrarInferior() {

    let area = document.getElementById("inferior");

    let usa = document.getElementById("usaInferior").value;


    if (usa === "nao") {

        area.innerHTML = "";

        return;

    }


    let html = "";


    // MASCULINO

    if (categoriaSelecionada === "Masculino") {

        html = `

            <label>
                Tipo de calção
            </label>

            <select id="tipoInferior">

                <option value="calcaoMasc">
                    Calção masculino
                </option>

            </select>

            <label>
                Tamanho do calção
            </label>

            <select id="tamanhoInferior">

                <option>PP</option>
                <option>P</option>
                <option>M</option>
                <option>G</option>
                <option>GG</option>

            </select>

        `;

    }


    // FEMININO

    if (categoriaSelecionada === "Feminino") {

        html = `

            <label>
                Tipo de peça
            </label>

            <select id="tipoInferior">

                <option value="calcaoFem">
                    Calção feminino
                </option>

                <option value="shortDoll">
                    Short Doll
                </option>

                <option value="shortSuplex">
                    Short Suplex
                </option>

            </select>

            <label>
                Tamanho
            </label>

            <select id="tamanhoInferior">

                <option>PP</option>
                <option>P</option>
                <option>M</option>
                <option>G</option>
                <option>GG</option>

            </select>

        `;

    }


    area.innerHTML = html;

}


// ======================================================
// MAPA DE NÚMEROS
// ======================================================

function gerarMapaNumeros() {

    let mapa = document.getElementById("mapaNumero");

    if (!mapa) return;

    mapa.innerHTML = "";


    for (let i = 0; i <= 99; i++) {

        let numero = i.toString().padStart(2, "0");

        let botao = document.createElement("button");

        botao.type = "button";

        botao.innerText = numero;


        botao.onclick = function () {

            document
                .querySelectorAll("#mapaNumero button")
                .forEach(btn => {
                    btn.classList.remove("ativo");
                });

            botao.classList.add("ativo");

            numeroSelecionado = numero;

        };


        mapa.appendChild(botao);

    }

}


// ======================================================
// CALCULAR VALOR
// ======================================================

function calcularValor() {

    let total = valores.camisa;

    let usa = document.getElementById("usaInferior");


    if (usa && usa.value === "sim") {

        let tipo = document.getElementById("tipoInferior").value;


        if (tipo === "calcaoMasc") {
            total += valores.calcaoMasc;
        }

        if (tipo === "calcaoFem") {
            total += valores.calcaoFem;
        }

        if (tipo === "shortDoll") {
            total += valores.shortDoll;
        }

        if (tipo === "shortSuplex") {
            total += valores.shortSuplex;
        }

    }


    return total;

}


// ======================================================
// ADICIONAR ITEM AO PEDIDO
// ======================================================

function adicionarItemPedido() {

    let campoNome = document.getElementById("nomePersonalizado");

    let nome = campoNome
        ? campoNome.value.trim()
        : "";


    if (uniformeSelecionado === "") {

        alert("Selecione Oficial ou Adicional.");

        return;

    }


    if (funcaoSelecionada === "") {

        alert("Selecione Normal ou Líbero.");

        return;

    }


    if (categoriaSelecionada === "") {

        alert("Selecione Masculino ou Feminino.");

        return;

    }


    if (numeroSelecionado === "") {

        alert("Selecione o número.");

        return;

    }


    if (nome === "") {

        alert("Digite o nome.");

        return;

    }


    let modelo = document.getElementById("modeloCamisa");

    let tamanhoCamisa = document.getElementById("tamanhoCamisa");


    let item = {

        id: pedido.length + 1,

        nome: nome.toUpperCase(),

        uniforme: uniformeSelecionado,

        funcao: funcaoSelecionada,

        categoria: categoriaSelecionada,

        numero: numeroSelecionado,

        modelo: modelo ? modelo.value : "",

        tamanhoCamisa: tamanhoCamisa ? tamanhoCamisa.value : "",

        inferior: "Nenhum",

        tamanhoInferior: "N/A",

        valor: calcularValor()

    };


    let usa = document.getElementById("usaInferior");


    if (usa && usa.value === "sim") {

        let tipoInferior =
            document.getElementById("tipoInferior");

        let tamanhoInferior =
            document.getElementById("tamanhoInferior");


        if (tipoInferior) {

            item.inferior =
                tipoInferior.options[
                    tipoInferior.selectedIndex
                ].text;

        }


        if (tamanhoInferior) {

            item.tamanhoInferior =
                tamanhoInferior.value;

        }

    }


    pedido.push(item);


    mostrarPedido();


    limparItem();

}


// ======================================================
// MOSTRAR PEDIDO
// ======================================================

function mostrarPedido() {

    let lista = document.getElementById("listaItens");

    if (!lista) return;

    lista.innerHTML = "";


    let total = 0;


    pedido.forEach((item, index) => {

        total += item.valor;


        lista.innerHTML += `

            <div class="card">

                <strong>
                    Jogador ${index + 1}
                </strong>

                <p>
                    Nome: ${item.nome}
                </p>

                <p>
                    Número: ${item.numero}
                </p>

                <p>
                    Uniforme: ${item.uniforme}
                </p>

                <p>
                    Função: ${item.funcao}
                </p>

                <p>
                    Categoria: ${item.categoria}
                </p>

                <p>
                    Camisa:
                    ${item.modelo}
                </p>

                <p>
                    Tamanho:
                    ${item.tamanhoCamisa}
                </p>

                <p>
                    Peça inferior:
                    ${item.inferior}
                </p>

                <p>
                    Valor:
                    R$ ${item.valor.toFixed(2)}
                </p>

            </div>

        `;

    });


    mostrarResumo(total);

}


// ======================================================
// RESUMO
// ======================================================

function mostrarResumo(total) {

    let resumo = document.getElementById("resumo");

    if (!resumo) return;


    let parcela = total / 3;


    if (pedido.length === 0) {

        resumo.innerHTML = "Nenhum pedido.";

        return;

    }


    resumo.innerHTML = `

        <strong>
            VÔLEI TERAPIA
        </strong>

        <br><br>

        Quantidade de uniformes:
        ${pedido.length}

        <br><br>

        Valor total:

        <strong>
            R$ ${total.toFixed(2)}
        </strong>

        <br><br>

        Pagamento:

        <br>

        3 parcelas de:

        <strong>
            R$ ${parcela.toFixed(2)}
        </strong>

    `;

}


// ======================================================
// LIMPAR ITEM
// ======================================================

function limparItem() {

    let campoNome =
        document.getElementById("nomePersonalizado");

    if (campoNome) {
        campoNome.value = "";
    }


    numeroSelecionado = "";


    document
        .querySelectorAll("#mapaNumero button")
        .forEach(btn => {
            btn.classList.remove("ativo");
        });

}


// ======================================================
// GERAR CÓDIGO DO PEDIDO
// ======================================================

function gerarCodigoPedido() {

    let numero =
        localStorage.getItem("codigoVT") || 0;


    numero++;


    localStorage.setItem(
        "codigoVT",
        numero
    );


    return "VT" + numero;

}


// ======================================================
// LIMPAR PEDIDO COMPLETO
// ======================================================

function novoPedido() {

    pedido = [];

    uniformeSelecionado = "";
    funcaoSelecionada = "";
    categoriaSelecionada = "";
    numeroSelecionado = "";


    let campoResponsavel =
        document.getElementById("responsavel");

    if (campoResponsavel) {
        campoResponsavel.value = "";
    }


    let campoNome =
        document.getElementById("nomePersonalizado");

    if (campoNome) {
        campoNome.value = "";
    }


    document
        .querySelectorAll(".opcao")
        .forEach(btn => {
            btn.classList.remove("ativo");
        });


    let lista =
        document.getElementById("listaItens");

    if (lista) {
        lista.innerHTML = "Nenhum item adicionado.";
    }


    let resumo =
        document.getElementById("resumo");

    if (resumo) {
        resumo.innerHTML = "Nenhum pedido.";
    }


    let configuracao =
        document.getElementById("configuracao");

    if (configuracao) {
        configuracao.style.display = "none";
    }


    let produtos =
        document.getElementById("produtos");

    if (produtos) {
        produtos.innerHTML = "";
    }


    let mapa =
        document.getElementById("mapaNumero");

    if (mapa) {
        mapa.innerHTML = "";
    }

}


// ======================================================
// FINALIZAR PEDIDO
// ======================================================

function finalizarPedido() {

    if (pedido.length === 0) {

        alert("Adicione pelo menos um uniforme.");

        return;

    }


    let codigo = gerarCodigoPedido();


    let dataAtual =
        new Date().toLocaleDateString("pt-BR");


    let valorTotalGeral =
        pedido.reduce(
            (acc, item) => acc + item.valor,
            0
        );


    let campoResponsavel =
        document.getElementById("responsavel");


    let nomeResponsavel =
        campoResponsavel
            ? campoResponsavel.value.trim()
            : "Não informado";


    if (nomeResponsavel === "") {

        alert("Digite o nome do responsável.");

        return;

    }


    // Dados enviados para o Apps Script

    let dadosEnvio = {

        idPedido: codigo,

        data: dataAtual,

        responsavel: nomeResponsavel,

        quantidade: pedido.length,

        valorTotal: valorTotalGeral,

        parcelas:
            "3x de R$ " +
            (valorTotalGeral / 3).toFixed(2),

        pago: "Não",

        itens: pedido

    };


    // Backup local

    let dadosLocal = {

        codigo: codigo,

        responsavel: nomeResponsavel,

        data: dataAtual,

        itens: pedido

    };


    localStorage.setItem(
        codigo,
        JSON.stringify(dadosLocal)
    );


    // Envio para Google Apps Script

    fetch(URL_APPS_SCRIPT, {

        method: "POST",

        mode: "no-cors",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dadosEnvio)

    })

    .then(() => {

        alert(
            "Pedido " +
            codigo +
            " enviado com sucesso!"
        );


        // LIMPA O PEDIDO APÓS FINALIZAR

        novoPedido();

    })

    .catch(error => {

        console.error(
            "Erro ao enviar:",
            error
        );


        alert(
            "Não foi possível confirmar o envio. " +
            "O pedido foi salvo localmente."
        );

    });

}
