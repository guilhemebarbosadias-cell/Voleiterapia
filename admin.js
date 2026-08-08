const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";


// ======================================================
// DADOS DO ADMIN
// ======================================================

let pedidos = [];
let itens = [];


// ======================================================
// CARREGAR DADOS
// ======================================================

async function carregarDados() {

    try {

        const resposta = await fetch(
            URL_APPS_SCRIPT + "?acao=admin"
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }

        const dados = await resposta.json();

        console.log(
            "DADOS RECEBIDOS DO APPS SCRIPT:",
            dados
        );


        if (dados.result !== "success") {

            throw new Error(
                dados.message ||
                "Não foi possível carregar os dados."
            );

        }


        pedidos = Array.isArray(dados.pedidos)
            ? dados.pedidos
            : [];


        itens = Array.isArray(dados.itens)
            ? dados.itens
            : [];


        atualizarResumo();


    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR ADMIN:",
            erro
        );


        mostrarMensagem(
            "Não foi possível carregar os dados da administração."
        );

    }

}


// ======================================================
// NORMALIZAR TEXTO
// ======================================================

function normalizarTexto(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// ======================================================
// PEGAR VALOR DE VÁRIOS NOMES POSSÍVEIS
// ======================================================

function pegarValor(objeto, nomes) {

    if (!objeto) {
        return "";
    }


    const chaves =
        Object.keys(objeto);


    for (
        let i = 0;
        i < nomes.length;
        i++
    ) {

        const procurado =
            normalizarTexto(nomes[i]);


        for (
            let j = 0;
            j < chaves.length;
            j++
        ) {

            if (
                normalizarTexto(chaves[j]) ===
                procurado
            ) {

                return objeto[chaves[j]];

            }

        }

    }


    return "";

}


// ======================================================
// CONVERTER VALOR PARA NÚMERO
// ======================================================

function converterNumero(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    if (typeof valor === "number") {

        return valor;

    }


    let texto =
        String(valor)
            .trim()
            .replace("R$", "")
            .trim();


    // Caso esteja no formato brasileiro:
    // 1.250,50

    if (
        texto.includes(",")
    ) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    }


    const numero =
        Number(texto);


    return isNaN(numero)
        ? 0
        : numero;

}


// ======================================================
// ATUALIZAR RESUMO
// ======================================================

function atualizarResumo() {

    const totalPedidos =
        document.getElementById(
            "totalPedidos"
        );


    const totalUniformes =
        document.getElementById(
            "totalUniformes"
        );


    const valorTotal =
        document.getElementById(
            "valorTotal"
        );


    const valorPendente =
        document.getElementById(
            "valorPendente"
        );


    // --------------------------------------------------
    // QUANTIDADES
    // --------------------------------------------------

    if (totalPedidos) {

        totalPedidos.innerText =
            pedidos.length;

    }


    if (totalUniformes) {

        totalUniformes.innerText =
            itens.length;

    }


    // --------------------------------------------------
    // VALORES
    // --------------------------------------------------

    let total = 0;

    let pendente = 0;


    pedidos.forEach(
        function(pedido) {

            const valor =
                converterNumero(
                    pegarValor(
                        pedido,
                        [
                            "valorTotal",
                            "valor total",
                            "valor",
                            "total"
                        ]
                    )
                );


            total += valor;


            const pagamento =
                normalizarTexto(
                    pegarValor(
                        pedido,
                        [
                            "pago",
                            "pagamento",
                            "situacao",
                            "situação"
                        ]
                    )
                );


            if (
                pagamento !== "sim" &&
                pagamento !== "pago"
            ) {

                pendente += valor;

            }

        }
    );


    if (valorTotal) {

        valorTotal.innerText =
            formatarMoeda(total);

    }


    if (valorPendente) {

        valorPendente.innerText =
            formatarMoeda(pendente);

    }

}


// ======================================================
// MOSTRAR PEDIDOS
// ======================================================

function mostrarPedidos() {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );


    if (!area) {
        return;
    }


    if (pedidos.length === 0) {

        area.innerHTML = `

            <div class="empty">
                Nenhum pedido encontrado.
            </div>

        `;

        return;

    }


    let html = "";


    pedidos.forEach(
        function(pedido, index) {

            const codigo =
                pegarValor(
                    pedido,
                    [
                        "idPedido",
                        "id pedido",
                        "pedido",
                        "codigo"
                    ]
                );


            const data =
                pegarValor(
                    pedido,
                    [
                        "data",
                        "data do pedido"
                    ]
                );


            const responsavel =
                pegarValor(
                    pedido,
                    [
                        "responsavel",
                        "responsável",
                        "nome",
                        "cliente"
                    ]
                );


            const quantidade =
                converterNumero(
                    pegarValor(
                        pedido,
                        [
                            "quantidade",
                            "qtd"
                        ]
                    )
                );


            const valor =
                converterNumero(
                    pegarValor(
                        pedido,
                        [
                            "valorTotal",
                            "valor total",
                            "valor",
                            "total"
                        ]
                    )
                );


            const parcelas =
                pegarValor(
                    pedido,
                    [
                        "parcelas",
                        "parcelamento"
                    ]
                );


            const pago =
                pegarValor(
                    pedido,
                    [
                        "pago",
                        "pagamento",
                        "situação",
                        "situacao"
                    ]
                );


            html += `

                <div class="card">

                    <h3>
                        Pedido ${codigo || index + 1}
                    </h3>


                    <p>
                        <strong>Data:</strong>
                        ${data || "Não informado"}
                    </p>


                    <p>
                        <strong>Responsável:</strong>
                        ${responsavel || "Não informado"}
                    </p>


                    <p>
                        <strong>Quantidade:</strong>
                        ${quantidade}
                    </p>


                    <p>
                        <strong>Valor:</strong>
                        ${formatarMoeda(valor)}
                    </p>


                    <p>
                        <strong>Parcelas:</strong>
                        ${parcelas || "Não informado"}
                    </p>


                    <p>
                        <strong>Pagamento:</strong>
                        ${pago || "Não informado"}
                    </p>

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// MOSTRAR UNIFORMES
// ======================================================

function mostrarUniformes() {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );


    if (!area) {
        return;
    }


    if (itens.length === 0) {

        area.innerHTML = `

            <div class="empty">
                Nenhum uniforme encontrado.
            </div>

        `;

        return;

    }


    let html = "";


    itens.forEach(
        function(item, index) {

            const nome =
                pegarValor(
                    item,
                    [
                        "nome",
                        "nomePersonalizado",
                        "nome para personalização",
                        "jogador"
                    ]
                );


            const numero =
                pegarValor(
                    item,
                    [
                        "numero",
                        "número",
                        "numero da camisa",
                        "número da camisa"
                    ]
                );


            const categoria =
                pegarValor(
                    item,
                    [
                        "categoria"
                    ]
                );


            const funcao =
                pegarValor(
                    item,
                    [
                        "funcao",
                        "função"
                    ]
                );


            const uniforme =
                pegarValor(
                    item,
                    [
                        "uniforme",
                        "tipo de uniforme"
                    ]
                );


            const modelo =
                pegarValor(
                    item,
                    [
                        "modelo",
                        "modelo da camisa",
                        "modeloCamisa"
                    ]
                );


            const tamanho =
                pegarValor(
                    item,
                    [
                        "tamanhoCamisa",
                        "tamanho camisa",
                        "tamanho da camisa"
                    ]
                );


            const inferior =
                pegarValor(
                    item,
                    [
                        "inferior",
                        "pecaInferior",
                        "peça inferior",
                        "tipo inferior"
                    ]
                );


            const tamanhoInferior =
                pegarValor(
                    item,
                    [
                        "tamanhoInferior",
                        "tamanho inferior"
                    ]
                );


            const valor =
                converterNumero(
                    pegarValor(
                        item,
                        [
                            "valor",
                            "preco",
                            "preço"
                        ]
                    )
                );


            html += `

                <div class="card">

                    <h3>
                        Uniforme ${index + 1}
                    </h3>


                    <p>
                        <strong>Nome:</strong>
                        ${nome || "Não informado"}
                    </p>


                    <p>
                        <strong>Número:</strong>
                        ${numero || "Não informado"}
                    </p>


                    <p>
                        <strong>Categoria:</strong>
                        ${categoria || "Não informado"}
                    </p>


                    <p>
                        <strong>Função:</strong>
                        ${funcao || "Não informado"}
                    </p>


                    <p>
                        <strong>Uniforme:</strong>
                        ${uniforme || "Não informado"}
                    </p>


                    <p>
                        <strong>Modelo:</strong>
                        ${modelo || "Não informado"}
                    </p>


                    <p>
                        <strong>Tamanho:</strong>
                        ${tamanho || "Não informado"}
                    </p>


                    <p>
                        <strong>Peça inferior:</strong>
                        ${inferior || "Nenhum"}
                    </p>


                    <p>
                        <strong>Tamanho inferior:</strong>
                        ${tamanhoInferior || "N/A"}
                    </p>


                    <p>
                        <strong>Valor:</strong>
                        ${formatarMoeda(valor)}
                    </p>

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// MOSTRAR PAGAMENTOS
// ======================================================

function mostrarPagamentos() {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );


    if (!area) {
        return;
    }


    if (pedidos.length === 0) {

        area.innerHTML = `

            <div class="empty">
                Nenhum pagamento encontrado.
            </div>

        `;

        return;

    }


    let html = "";


    pedidos.forEach(
        function(pedido, index) {

            const codigo =
                pegarValor(
                    pedido,
                    [
                        "idPedido",
                        "id pedido",
                        "pedido",
                        "codigo"
                    ]
                );


            const responsavel =
                pegarValor(
                    pedido,
                    [
                        "responsavel",
                        "responsável",
                        "nome"
                    ]
                );


            const valor =
                converterNumero(
                    pegarValor(
                        pedido,
                        [
                            "valorTotal",
                            "valor total",
                            "valor",
                            "total"
                        ]
                    )
                );


            const pagamento =
                normalizarTexto(
                    pegarValor(
                        pedido,
                        [
                            "pago",
                            "pagamento",
                            "situação",
                            "situacao"
                        ]
                    )
                );


            const pago =
                pagamento === "sim" ||
                pagamento === "pago";


            html += `

                <div class="card">

                    <h3>
                        ${codigo || "Pedido " + (index + 1)}
                    </h3>


                    <p>
                        <strong>
                            Responsável:
                        </strong>

                        ${responsavel || "Não informado"}
                    </p>


                    <p>
                        <strong>
                            Valor:
                        </strong>

                        ${formatarMoeda(valor)}
                    </p>


                    <p>
                        <strong>
                            Situação:
                        </strong>

                        ${
                            pago
                            ? "Pago"
                            : "Em aberto"
                        }

                    </p>

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// CONFIGURAÇÕES
// ======================================================

function mostrarConfiguracoes() {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );


    if (!area) {
        return;
    }


    area.innerHTML = `

        <div class="card">

            <h3>
                Configurações
            </h3>

            <p>
                Esta área será usada para
                configurar o sistema.
            </p>

            <p>
                Futuramente poderemos colocar
                aqui os valores dos uniformes,
                opções de peças e outras
                configurações.
            </p>

        </div>

    `;

}


// ======================================================
// MENSAGEM
// ======================================================

function mostrarMensagem(texto) {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );


    if (!area) {
        return;
    }


    area.innerHTML = `

        <div class="empty">
            ${texto}
        </div>

    `;

}


// ======================================================
// FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ======================================================
// VOLTAR AO INÍCIO
// ======================================================

function voltarInicio() {

    window.location.href =
        "index.html";

}


// ======================================================
// INICIAR ADMIN
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarDados();

    }
);
