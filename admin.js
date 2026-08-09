// ======================================================
// ADMIN - VÔLEI TERAPIA
// ======================================================

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
// CARREGAR DADOS
// ======================================================

async function carregarDados() {

    try {

        const resposta =
            await fetch(
                URL_APPS_SCRIPT + "?acao=admin"
            );


        const dados =
            await resposta.json();


        console.log(
            "DADOS RECEBIDOS DO APPS SCRIPT:",
            dados
        );


        if (
            !dados ||
            dados.result !== "success"
        ) {

            throw new Error(
                dados?.message ||
                "Não foi possível carregar os dados."
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
// ATUALIZAR RESUMO FINANCEIRO
// ======================================================

function atualizarResumo() {

    // ==================================================
    // ELEMENTOS EXISTENTES
    // ==================================================

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


    // ==================================================
    // CONTADORES
    // ==================================================

    let totalVendido = 0;

    let totalRecebido = 0;

    let totalAberto = 0;

    let pedidosPagos = 0;

    let pedidosParciais = 0;

    let pedidosNaoPagos = 0;


    // ==================================================
    // ANALISAR PEDIDOS
    // ==================================================

    pedidos.forEach(
        function(pedido) {

            const valorTotalPedido =
                Number(
                    pedido.valorTotal
                ) || 0;


            const valorPagoPedido =
                Number(
                    pedido.Pago
                ) || 0;


            const valorRestantePedido =
                Number(
                    pedido.Restante
                ) || 0;


            // ------------------------------------------
            // VALORES
            // ------------------------------------------

            totalVendido +=
                valorTotalPedido;


            totalRecebido +=
                valorPagoPedido;


            totalAberto +=
                valorRestantePedido;


            // ------------------------------------------
            // SITUAÇÃO DO PEDIDO
            // ------------------------------------------

            if (
                valorRestantePedido <= 0 &&
                valorTotalPedido > 0
            ) {

                pedidosPagos++;

            }

            else if (
                valorPagoPedido > 0 &&
                valorRestantePedido > 0
            ) {

                pedidosParciais++;

            }

            else {

                pedidosNaoPagos++;

            }

        }
    );


    // ==================================================
    // PEDIDOS
    // ==================================================

    if (totalPedidos) {

        totalPedidos.innerText =
            pedidos.length;

    }


    // ==================================================
    // UNIFORMES
    // ==================================================

    if (totalUniformes) {

        totalUniformes.innerText =
            itens.length;

    }


    // ==================================================
    // TOTAL VENDIDO
    // ==================================================

    if (valorTotal) {

        valorTotal.innerText =
            formatarMoeda(
                totalVendido
            );

    }


    // ==================================================
    // TOTAL EM ABERTO
    // ==================================================

    if (valorPendente) {

        valorPendente.innerText =
            formatarMoeda(
                totalAberto
            );

    }


    const valorRecebido =
        document.getElementById(
            "valorRecebido"
        );


    const parciais =
        document.getElementById(
            "pedidosParciais"
        );


    const naoPagos =
        document.getElementById(
            "pedidosNaoPagos"
        );


    if (valorRecebido) {

        valorRecebido.innerText =
            formatarMoeda(
                totalRecebido
            );

    }


    if (parciais) {

        parciais.innerText =
            pedidosParciais;

    }


    if (naoPagos) {

        naoPagos.innerText =
            pedidosNaoPagos;

    }


    // ==================================================
    // LOG PARA CONFERÊNCIA
    // ==================================================

    console.log(
        "===== RESUMO FINANCEIRO ====="
    );


    console.log(
        "Total vendido:",
        totalVendido
    );


    console.log(
        "Total recebido:",
        totalRecebido
    );


    console.log(
        "Total em aberto:",
        totalAberto
    );


    console.log(
        "Pedidos pagos:",
        pedidosPagos
    );


    console.log(
        "Pedidos parciais:",
        pedidosParciais
    );


    console.log(
        "Pedidos não pagos:",
        pedidosNaoPagos
    );

}


// ======================================================
// PEDIDOS
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
        function(pedido) {

            const status =
                pedido.Status ||
                "Não pago";


            html += `

                <div class="card">

                    <h3>
                        Pedido ${pedido.idPedido || ""}
                    </h3>

                    <p>
                        <strong>Data:</strong>
                        ${pedido.data || ""}
                    </p>

                    <p>
                        <strong>Responsável:</strong>
                        ${pedido.responsavel || ""}
                    </p>

                    <p>
                        <strong>Quantidade:</strong>
                        ${pedido.quantidade || 0}
                    </p>

                    <p>
                        <strong>Valor:</strong>
                        ${formatarMoeda(
                            Number(
                                pedido.valorTotal
                            ) || 0
                        )}
                    </p>

                    <p>
                        <strong>Parcelas:</strong>
                        ${pedido.parcelas || ""}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${status}
                    </p>

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// FUNÇÃO PARA PEGAR O MODELO
// ======================================================

function obterModelo(item) {

    if (!item) return "";


    const possibilidades = [

        item.modelo,

        item.modeloCamisa,

        item["Modelo"],

        item["MODELO"],

        item["Modelo da camisa"],

        item["Modelo da Camisa"],

        item["modelo da camisa"],

        item["modeloCamisa"]

    ];


    for (
        let i = 0;
        i < possibilidades.length;
        i++
    ) {

        const valor =
            possibilidades[i];


        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        ) {

            return String(valor).trim();

        }

    }


    return "Não informado";

}


// ======================================================
// UNIFORMES
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

            const modelo =
                obterModelo(item);


            html += `

                <div class="card">

                    <h3>
                        Uniforme ${index + 1}
                    </h3>


                    <p>
                        <strong>Nome:</strong>
                        ${item.nome || ""}
                    </p>


                    <p>
                        <strong>Número:</strong>
                        ${item.numero || ""}
                    </p>


                    <p>
                        <strong>Categoria:</strong>
                        ${item.categoria || ""}
                    </p>


                    <p>
                        <strong>Função:</strong>
                        ${item.funcao || ""}
                    </p>


                    <p>
                        <strong>Modelo:</strong>
                        ${modelo}
                    </p>


                    <p>
                        <strong>Tamanho da camisa:</strong>
                        ${item.tamanhoCamisa || ""}
                    </p>


                    <p>
                        <strong>Peça inferior:</strong>
                        ${item.inferior || "Nenhum"}
                    </p>


                    <p>
                        <strong>Tamanho inferior:</strong>
                        ${item.tamanhoInferior || "N/A"}
                    </p>


                    <p>
                        <strong>Valor:</strong>
                        ${formatarMoeda(
                            Number(item.valor) || 0
                        )}
                    </p>

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// PAGAMENTOS
// APENAS LEITURA
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

            const status =
                pedido.Status !== undefined &&
                pedido.Status !== null &&
                String(pedido.Status).trim() !== ""
                    ? String(pedido.Status).trim()
                    : "Não pago";


            const valorTotal =
                Number(
                    pedido.valorTotal
                ) || 0;


            const valorPago =
                Number(
                    pedido.Pago
                ) || 0;


            const valorRestante =
                Number(
                    pedido.Restante
                ) || 0;


            html += `

                <div class="card">

                    <h3>
                        ${pedido.idPedido || "Pedido"}
                    </h3>


                    <p>
                        <strong>
                            Responsável:
                        </strong>

                        ${pedido.responsavel || ""}
                    </p>


                    <p>
                        <strong>
                            Valor total:
                        </strong>

                        ${formatarMoeda(
                            valorTotal
                        )}
                    </p>


                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${status}
                    </p>


                    <p>
                        <strong>
                            Pago:
                        </strong>

                        ${formatarMoeda(
                            valorPago
                        )}
                    </p>


                    <p>
                        <strong>
                            Restante:
                        </strong>

                        ${formatarMoeda(
                            valorRestante
                        )}
                    </p>

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// PRODUÇÃO
// LISTA DE PRODUÇÃO
// ======================================================

function mostrarProducao() {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );


    if (!area) return;


    // ==================================================
    // VERIFICAR SE EXISTEM ITENS
    // ==================================================

    if (
        !itens ||
        itens.length === 0
    ) {

        area.innerHTML = `

            <div class="empty">

                Nenhum uniforme encontrado
                para produção.

            </div>

        `;

        return;

    }


    // ==================================================
    // CONTADORES
    // ==================================================

    const totalUniformes =
        itens.length;


    let totalCamisas = 0;

    let totalBabyLook = 0;

    let totalInferiores = 0;


    itens.forEach(
        function(item) {

            const modelo =
                obterModelo(item)
                    .toLowerCase();


            if (
                modelo.includes("baby")
            ) {

                totalBabyLook++;

            } else {

                totalCamisas++;

            }


            const inferior =
                String(
                    item.inferior || ""
                )
                .trim()
                .toLowerCase();


            if (
                inferior !== "" &&
                inferior !== "nenhum" &&
                inferior !== "n/a"
            ) {

                totalInferiores++;

            }

        }
    );


    // ==================================================
    // CABEÇALHO / RESUMO
    // ==================================================

    let html = `

        <div class="card">

            <h2>
                🏭 Lista de Produção
            </h2>


            <p>
                <strong>
                    Total de uniformes:
                </strong>

                ${totalUniformes}

            </p>


            <p>
                <strong>
                    Camisas:
                </strong>

                ${totalCamisas}

            </p>


            <p>
                <strong>
                    Baby Look:
                </strong>

                ${totalBabyLook}

            </p>


            <p>
                <strong>
                    Peças inferiores:
                </strong>

                ${totalInferiores}

            </p>

        </div>


        <div class="card">

            <h3>
                👕 Lista
            </h3>


            <div
                style="
                    overflow-x:auto;
                "
            >

                <table
                    style="
                        width:100%;
                        border-collapse:collapse;
                        min-width:750px;
                    "
                >

                    <thead>

                        <tr
                            style="
                                background:#000;
                                color:#fff;
                            "
                        >

                            <th
                                style="
                                    padding:12px;
                                    text-align:left;
                                "
                            >
                                Nome
                            </th>


                            <th
                                style="
                                    padding:12px;
                                    text-align:center;
                                "
                            >
                                Nº
                            </th>


                            <th
                                style="
                                    padding:12px;
                                    text-align:left;
                                "
                            >
                                Função
                            </th>


                            <th
                                style="
                                    padding:12px;
                                    text-align:left;
                                "
                            >
                                Modelo
                            </th>


                            <th
                                style="
                                    padding:12px;
                                    text-align:center;
                                "
                            >
                                Tam. camisa
                            </th>


                            <th
                                style="
                                    padding:12px;
                                    text-align:left;
                                "
                            >
                                Peça inferior
                            </th>


                            <th
                                style="
                                    padding:12px;
                                    text-align:center;
                                "
                            >
                                Tam. inferior
                            </th>

                        </tr>

                    </thead>


                    <tbody>
    `;


    // ==================================================
    // LINHAS DA PRODUÇÃO
    // ==================================================

    itens.forEach(
        function(item) {

            const nome =
                item.nome || "";


            const numero =
                item.numero || "";


            const funcao =
                item.funcao || "";


            // ------------------------------------------
            // MODELO
            // ------------------------------------------

            let modelo =
                obterModelo(item);


            if (
                modelo
                    .toLowerCase()
                    .includes("baby")
            ) {

                modelo =
                    "Baby Look";

            } else {

                modelo =
                    "Camisa";

            }


            // ------------------------------------------
            // TAMANHO DA CAMISA
            // ------------------------------------------

            const tamanhoCamisa =
                item.tamanhoCamisa || "";


            // ------------------------------------------
            // PEÇA INFERIOR
            // ------------------------------------------

            const inferior =
                item.inferior || "Nenhum";


            // ------------------------------------------
            // TAMANHO INFERIOR
            // ------------------------------------------

            const tamanhoInferior =
                item.tamanhoInferior || "N/A";


            html += `

                <tr
                    style="
                        border-bottom:
                            1px solid #ddd;
                    "
                >

                    <td
                        style="
                            padding:12px;
                        "
                    >

                        <strong>
                            ${nome}
                        </strong>

                    </td>


                    <td
                        style="
                            padding:12px;
                            text-align:center;
                            font-weight:bold;
                        "
                    >

                        ${numero}

                    </td>


                    <td
                        style="
                            padding:12px;
                        "
                    >

                        ${funcao}

                    </td>


                    <td
                        style="
                            padding:12px;
                        "
                    >

                        ${modelo}

                    </td>


                    <td
                        style="
                            padding:12px;
                            text-align:center;
                        "
                    >

                        ${tamanhoCamisa}

                    </td>


                    <td
                        style="
                            padding:12px;
                        "
                    >

                        ${inferior}

                    </td>


                    <td
                        style="
                            padding:12px;
                            text-align:center;
                        "
                    >

                        ${tamanhoInferior}

                    </td>

                </tr>

            `;

        }
    );


    // ==================================================
    // FECHAR TABELA
    // ==================================================

    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    // ==================================================
    // BOTÃO DE EXPORTAÇÃO
    // ==================================================

    html += `

        <div class="card">

            <button
                type="button"
                class="admin-button"
                style="
                    width:100%;
                    background:#ff007f;
                "
                onclick="
                    exportarProducaoPlanilha()
                "
            >

                📊 EXPORTAR PARA PLANILHA

            </button>

        </div>

    `;


    // ==================================================
    // MOSTRAR NA TELA
    // ==================================================

    area.innerHTML =
        html;

}


// ======================================================
// EXPORTAR PRODUÇÃO PARA PLANILHA
// ======================================================

function exportarProducaoPlanilha() {

    if (!itens || itens.length === 0) {

        alert(
            "Não há uniformes para exportar."
        );

        return;

    }


    // ==================================================
    // CABEÇALHO DA PLANILHA
    // ==================================================

    let csv = "";

    csv +=
        "TIPO;NOME;NÚMERO;FUNÇÃO;MODELO;TAMANHO;PEÇA INFERIOR;TAMANHO INFERIOR\n";


    // ==================================================
    // ADICIONAR CADA UNIFORME
    // ==================================================

    itens.forEach(
        function(item) {

            const nome =
                item.nome || "";

            const numero =
                item.numero || "";

            const funcao =
                item.funcao || "";

            const modelo =
                obterModelo(item);

            const tamanho =
                item.tamanhoCamisa || "";

            const inferior =
                item.inferior || "";

            const tamanhoInferior =
                item.tamanhoInferior || "";


            // ==================================================
            // LINHA DA CAMISA
            // ==================================================

            csv +=
                "CAMISA;" +
                escaparCSV(nome) + ";" +
                escaparCSV(numero) + ";" +
                escaparCSV(funcao) + ";" +
                escaparCSV(modelo) + ";" +
                escaparCSV(tamanho) + ";" +
                escaparCSV(inferior) + ";" +
                escaparCSV(tamanhoInferior) +
                "\n";

        }
    );


    // ==================================================
    // CRIAR ARQUIVO CSV
    // ==================================================

    const blob =
        new Blob(
            ["\uFEFF" + csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    // ==================================================
    // CRIAR DOWNLOAD
    // ==================================================

    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "lista-producao-volei-terapia.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);


    alert(
        "Lista de produção exportada com sucesso!"
    );

}


// ======================================================
// ESCAPAR DADOS PARA CSV
// ======================================================

function escaparCSV(valor) {

    if (
        valor === undefined ||
        valor === null
    ) {

        return "";

    }


    return String(valor)
        .replace(/"/g, '""')
        .replace(/;/g, ",");

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

    return Number(
        valor || 0
    ).toLocaleString(
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
