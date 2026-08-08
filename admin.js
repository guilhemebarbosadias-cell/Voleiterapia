// ======================================================
// URL DO GOOGLE APPS SCRIPT
// ======================================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";


// ======================================================
// DADOS
// ======================================================

let pedidos = [];
let itens = [];


// ======================================================
// NORMALIZAR TEXTO
// Ajuda a reconhecer cabeçalhos da planilha
// mesmo com espaços, acentos ou maiúsculas.
// ======================================================

function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

}


// ======================================================
// PEGAR VALOR DE UM OBJETO
// Aceita diferentes nomes de coluna.
// ======================================================

function pegarValor(objeto, nomes) {

    if (!objeto) return "";

    const chaves =
        Object.keys(objeto);

    for (let nome of nomes) {

        const procurado =
            normalizarTexto(nome);

        for (let chave of chaves) {

            if (
                normalizarTexto(chave)
                === procurado
            ) {

                return objeto[chave];

            }

        }

    }

    return "";

}


// ======================================================
// CARREGAR DADOS DO ADMIN
// ======================================================

async function carregarDados() {

    try {

        // IMPORTANTE:
        // Agora pedimos explicitamente os dados
        // administrativos.

        const resposta =
            await fetch(
                URL_APPS_SCRIPT +
                "?acao=admin"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "DADOS RECEBIDOS DO APPS SCRIPT:",
            dados
        );


        if (
            dados.result !== "success"
        ) {

            throw new Error(
                dados.message ||
                "O Apps Script não retornou sucesso."
            );

        }


        pedidos =
            Array.isArray(dados.pedidos)
                ? dados.pedidos
                : [];


        itens =
            Array.isArray(dados.itens)
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


    if (totalPedidos) {

        totalPedidos.innerText =
            pedidos.length;

    }


    if (totalUniformes) {

        totalUniformes.innerText =
            itens.length;

    }


    let total = 0;
    let pendente = 0;


    pedidos.forEach(
        function(pedido) {

            const valor =
                Number(
                    pegarValor(
                        pedido,
                        [
                            "Valor Total",
                            "valorTotal",
                            "valor"
                        ]
                    )
                ) || 0;


            total += valor;


            const pago =
                String(
                    pegarValor(
                        pedido,
                        [
                            "Pago",
                            "pago",
                            "Pagamento"
                        ]
                    )
                )
                .trim()
                .toLowerCase();


            if (
                pago !== "sim" &&
                pago !== "pago"
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


    if (!area) return;


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

            const responsavel =
                pegarValor(
                    pedido,
                    [
                        "Responsável",
                        "Responsavel",
                        "Nome"
                    ]
                );


            const data =
                pegarValor(
                    pedido,
                    [
                        "Data"
                    ]
                );


            const quantidade =
                pegarValor(
                    pedido,
                    [
                        "Quantidade",
                        "Qtd"
                    ]
                );


            const valor =
                Number(
                    pegarValor(
                        pedido,
                        [
                            "Valor Total",
                            "valorTotal",
                            "Valor"
                        ]
                    )
                ) || 0;


            const parcelas =
                pegarValor(
                    pedido,
                    [
                        "Parcelas"
                    ]
                );


            const pago =
                pegarValor(
                    pedido,
                    [
                        "Pago",
                        "Pagamento"
                    ]
                );


            html += `

                <div class="card">

                    <h3>
                        Pedido ${index + 1}
                    </h3>

                    <p>
                        <strong>Responsável:</strong>
                        ${responsavel || "Não informado"}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${data || "Não informado"}
                    </p>

                    <p>
                        <strong>Quantidade:</strong>
                        ${quantidade || 0}
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


    if (!area) return;


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
                        "Nome",
                        "Nome Personalizado"
                    ]
                );


            const numero =
                pegarValor(
                    item,
                    [
                        "Número",
                        "Numero"
                    ]
                );


            const funcao =
                pegarValor(
                    item,
                    [
                        "Função",
                        "Funcao"
                    ]
                );


            const modelo =
                pegarValor(
                    item,
                    [
                        "Modelo",
                        "Modelo da Camisa"
                    ]
                );


            const tamanhoCamisa =
                pegarValor(
                    item,
                    [
                        "Tamanho Camisa",
                        "TamanhoCamisa",
                        "Tamanho"
                    ]
                );


            const inferior =
                pegarValor(
                    item,
                    [
                        "Inferior",
                        "Peça Inferior",
                        "Peca Inferior"
                    ]
                );


            const tamanhoInferior =
                pegarValor(
                    item,
                    [
                        "Tamanho Inferior"
                    ]
                );


            const valor =
                Number(
                    pegarValor(
                        item,
                        [
                            "Valor"
                        ]
                    )
                ) || 0;


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
                        <strong>Função:</strong>
                        ${funcao || "Não informado"}
                    </p>

                    <p>
                        <strong>Modelo:</strong>
                        ${modelo || "Não informado"}
                    </p>

                    <p>
                        <strong>Tamanho da camisa:</strong>
                        ${tamanhoCamisa || "Não informado"}
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


    if (!area) return;


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
        function(pedido) {

            const responsavel =
                pegarValor(
                    pedido,
                    [
                        "Responsável",
                        "Responsavel"
                    ]
                );


            const valor =
                Number(
                    pegarValor(
                        pedido,
                        [
                            "Valor Total",
                            "valorTotal",
                            "Valor"
                        ]
                    )
                ) || 0;


            const pagamento =
                pegarValor(
                    pedido,
                    [
                        "Pago",
                        "Pagamento"
                    ]
                );


            const pago =
                String(pagamento)
                    .trim()
                    .toLowerCase()
                    === "sim";


            html += `

                <div class="card">

                    <h3>
                        ${responsavel || "Pedido"}
                    </h3>

                    <p>
                        <strong>Valor:</strong>
                        ${formatarMoeda(valor)}
                    </p>

                    <p>
                        <strong>Situação:</strong>
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


    if (!area) return;


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


    if (!area) return;


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
