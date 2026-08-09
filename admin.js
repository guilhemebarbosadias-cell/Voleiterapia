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
// PEGAR VALOR TOTAL
// ======================================================

function obterValorTotalPedido(pedido) {

    return Number(
        pedido?.valorTotal
    ) || 0;

}


// ======================================================
// PEGAR VALOR PAGO
// ======================================================

function obterValorPagoPedido(pedido) {

    return Number(
        pedido?.Pago
    ) || 0;

}


// ======================================================
// CALCULAR RESTANTE
// ======================================================

function obterRestantePedido(pedido) {

    const total =
        obterValorTotalPedido(pedido);

    const pago =
        obterValorPagoPedido(pedido);

    const restante =
        total - pago;

    return Math.max(
        0,
        restante
    );

}


// ======================================================
// OBTER STATUS CORRETO
// ======================================================

function obterStatusPedido(pedido) {

    const total =
        obterValorTotalPedido(pedido);

    const pago =
        obterValorPagoPedido(pedido);

    const restante =
        obterRestantePedido(pedido);

    if (total <= 0) {

        return "Sem valor";

    }

    if (restante <= 0) {

        return "Pago";

    }

    if (pago > 0) {

        return "Pagamento parcial";

    }

    return "Não pago";

}


// ======================================================
// ATUALIZAR RESUMO FINANCEIRO
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


    let totalVendido = 0;

    let totalRecebido = 0;

    let totalAberto = 0;

    let pedidosParciais = 0;

    let pedidosNaoPagos = 0;


    pedidos.forEach(
        function(pedido) {

            const total =
                obterValorTotalPedido(
                    pedido
                );

            const pago =
                obterValorPagoPedido(
                    pedido
                );

            const restante =
                obterRestantePedido(
                    pedido
                );


            totalVendido += total;

            totalRecebido += pago;

            totalAberto += restante;


            if (
                total > 0 &&
                pago > 0 &&
                restante > 0
            ) {

                pedidosParciais++;

            }

            else if (
                total > 0 &&
                pago <= 0
            ) {

                pedidosNaoPagos++;

            }

        }
    );


    if (totalPedidos) {

        totalPedidos.innerText =
            pedidos.length;

    }


    if (totalUniformes) {

        totalUniformes.innerText =
            itens.length;

    }


    if (valorTotal) {

        valorTotal.innerText =
            formatarMoeda(
                totalVendido
            );

    }


    if (valorRecebido) {

        valorRecebido.innerText =
            formatarMoeda(
                totalRecebido
            );

    }


    if (valorPendente) {

        valorPendente.innerText =
            formatarMoeda(
                totalAberto
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
                obterStatusPedido(
                    pedido
                );

            const total =
                obterValorTotalPedido(
                    pedido
                );

            const pago =
                obterValorPagoPedido(
                    pedido
                );

            const restante =
                obterRestantePedido(
                    pedido
                );


            html += `

                <div class="card">

                    <h3>
                        Pedido
                        ${pedido.idPedido || ""}
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
                        ${formatarMoeda(total)}
                    </p>

                    <p>
                        <strong>Pago:</strong>
                        ${formatarMoeda(pago)}
                    </p>

                    <p>
                        <strong>Restante:</strong>
                        ${formatarMoeda(restante)}
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


    area.innerHTML =
        html;

}


// ======================================================
// MODELO
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


    area.innerHTML =
        html;

}


// ======================================================
// PAGAMENTOS
// ======================================================
// O PAGAMENTO É LANÇADO DIRETAMENTE NO PEDIDO.
// NÃO EXISTE UMA NOVA ABA DE LANÇAMENTO.
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
        function(pedido, index) {

            const total =
                obterValorTotalPedido(
                    pedido
                );

            const pago =
                obterValorPagoPedido(
                    pedido
                );

            const restante =
                obterRestantePedido(
                    pedido
                );

            const status =
                obterStatusPedido(
                    pedido
                );


            html += `

                <div
                    class="card"
                    style="
                        margin-bottom:15px;
                    "
                >

                    <h3>
                        💰 Pedido
                        ${pedido.idPedido || ""}
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

                        ${formatarMoeda(total)}

                    </p>


                    <p>

                        <strong>
                            Já pago:
                        </strong>

                        ${formatarMoeda(pago)}

                    </p>


                    <p>

                        <strong>
                            Restante:
                        </strong>

                        <span
                            id="restante-${index}"
                        >
                            ${formatarMoeda(restante)}
                        </span>

                    </p>


                    <p>

                        <strong>
                            Status:
                        </strong>

                        <span
                            id="status-${index}"
                        >
                            ${status}
                        </span>

                    </p>


                    ${
                        restante > 0
                        ?

                        `

                        <div
                            style="
                                margin-top:15px;
                                padding-top:15px;
                                border-top:1px solid #ddd;
                            "
                        >

                            <label
                                style="
                                    display:block;
                                    font-weight:bold;
                                    margin-bottom:6px;
                                "
                            >

                                Valor recebido agora

                            </label>


                            <input
                                type="number"
                                id="pagamento-${index}"
                                min="0"
                                max="${restante}"
                                step="0.01"
                                placeholder="Ex.: 25,00"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:12px;
                                    border:1px solid #ccc;
                                    border-radius:10px;
                                    font-size:16px;
                                "
                            >


                            <button
                                type="button"
                                class="admin-button"
                                style="
                                    width:100%;
                                    margin-top:10px;
                                    background:#ff007f;
                                "
                                onclick="
                                    registrarPagamento(
                                        ${index}
                                    )
                                "
                            >

                                💰 LANÇAR PAGAMENTO

                            </button>

                        </div>

                        `

                        :

                        `

                        <div
                            style="
                                margin-top:15px;
                                padding:12px;
                                background:#e8f5e9;
                                border-radius:10px;
                                text-align:center;
                                font-weight:bold;
                            "
                        >

                            ✅ Pedido totalmente pago

                        </div>

                        `
                    }

                </div>

            `;

        }
    );


    area.innerHTML =
        html;

}


// ======================================================
// REGISTRAR PAGAMENTO
// ======================================================

async function registrarPagamento(index) {

    const pedido =
        pedidos[index];


    if (!pedido) {

        alert(
            "Pedido não encontrado."
        );

        return;

    }


    const campo =
        document.getElementById(
            `pagamento-${index}`
        );


    if (!campo) {

        alert(
            "Campo de pagamento não encontrado."
        );

        return;

    }


    const valor =
        Number(
            String(
                campo.value
            ).replace(",", ".")
        );


    if (
        !valor ||
        valor <= 0
    ) {

        alert(
            "Digite um valor de pagamento."
        );

        return;

    }


    const total =
        obterValorTotalPedido(
            pedido
        );


    const pagoAtual =
        obterValorPagoPedido(
            pedido
        );


    const restanteAtual =
        obterRestantePedido(
            pedido
        );


    if (valor > restanteAtual) {

        alert(
            "O valor informado é maior que o restante do pedido."
        );

        return;

    }


    const novoPago =
        pagoAtual + valor;


    const novoRestante =
        Math.max(
            0,
            total - novoPago
        );


    let novoStatus =
        "Não pago";


    if (novoRestante <= 0) {

        novoStatus =
            "Pago";

    }

    else if (novoPago > 0) {

        novoStatus =
            "Pagamento parcial";

    }


    const botao =
        campo.parentElement
            ?.querySelector(
                "button"
            );


    if (botao) {

        botao.disabled =
            true;

        botao.innerText =
            "⏳ REGISTRANDO...";

    }


    try {

        /*
         * O Apps Script recebe:
         *
         * acao=lancarPagamento
         * idPedido
         * valor
         */

        const parametros =
            new URLSearchParams({

                acao:
                    "lancarPagamento",

                idPedido:
                    pedido.idPedido || "",

                valor:
                    valor.toFixed(2)

            });


        const resposta =
            await fetch(
                URL_APPS_SCRIPT +
                "?" +
                parametros.toString()
            );


        const dados =
            await resposta.json();


        console.log(
            "RESPOSTA DO PAGAMENTO:",
            dados
        );


        if (
            !dados ||
            dados.result !== "success"
        ) {

            throw new Error(
                dados?.message ||
                "O pagamento não foi registrado."
            );

        }


        // ==================================================
        // ATUALIZAR PEDIDO LOCALMENTE
        // ==================================================

        pedido.Pago =
            novoPago;

        pedido.Restante =
            novoRestante;

        pedido.Status =
            novoStatus;


        // ==================================================
        // ATUALIZAR RESUMO
        // ==================================================

        atualizarResumo();


        // ==================================================
        // RECARREGAR ABA DE PAGAMENTOS
        // ==================================================

        mostrarPagamentos();


        alert(
            "Pagamento registrado com sucesso!"
        );


    } catch (erro) {

        console.error(
            "ERRO AO REGISTRAR PAGAMENTO:",
            erro
        );


        alert(
            "Não foi possível registrar o pagamento.\n\n" +
            erro.message
        );


        if (botao) {

            botao.disabled =
                false;

            botao.innerText =
                "💰 LANÇAR PAGAMENTO";

        }

    }

}


// ======================================================
// PRODUÇÃO
// ======================================================

function mostrarProducao() {

    const area =
        document.getElementById(
            "conteudoAdmin"
        );

    if (!area) return;


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

            }

            else {

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

                            <th style="padding:12px;text-align:left;">
                                Nome
                            </th>

                            <th style="padding:12px;text-align:center;">
                                Nº
                            </th>

                            <th style="padding:12px;text-align:left;">
                                Função
                            </th>

                            <th style="padding:12px;text-align:left;">
                                Modelo
                            </th>

                            <th style="padding:12px;text-align:center;">
                                Tam. camisa
                            </th>

                            <th style="padding:12px;text-align:left;">
                                Peça inferior
                            </th>

                            <th style="padding:12px;text-align:center;">
                                Tam. inferior
                            </th>

                        </tr>

                    </thead>

                    <tbody>
    `;


    itens.forEach(
        function(item) {

            const nome =
                item.nome || "";

            const numero =
                item.numero || "";

            const funcao =
                item.funcao || "";


            let modelo =
                obterModelo(item);


            if (
                modelo
                    .toLowerCase()
                    .includes("baby")
            ) {

                modelo =
                    "Baby Look";

            }

            else {

                modelo =
                    "Camisa";

            }


            const tamanhoCamisa =
                item.tamanhoCamisa || "";


            const inferior =
                item.inferior || "Nenhum";


            const tamanhoInferior =
                item.tamanhoInferior || "N/A";


            html += `

                <tr
                    style="
                        border-bottom:1px solid #ddd;
                    "
                >

                    <td style="padding:12px;">
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

                    <td style="padding:12px;">
                        ${funcao}
                    </td>

                    <td style="padding:12px;">
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

                    <td style="padding:12px;">
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


    html += `

                    </tbody>

                </table>

            </div>

        </div>


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


    area.innerHTML =
        html;

}


// ======================================================
// EXPORTAR PRODUÇÃO
// ======================================================

function exportarProducaoPlanilha() {

    if (
        !itens ||
        itens.length === 0
    ) {

        alert(
            "Não há uniformes para exportar."
        );

        return;

    }


    let csv = "";

    csv +=
        "TIPO;NOME;NÚMERO;FUNÇÃO;MODELO;TAMANHO;PEÇA INFERIOR;TAMANHO INFERIOR\n";


    itens.forEach(
        function(item) {

            csv +=
                "CAMISA;" +
                escaparCSV(
                    item.nome || ""
                ) + ";" +
                escaparCSV(
                    item.numero || ""
                ) + ";" +
                escaparCSV(
                    item.funcao || ""
                ) + ";" +
                escaparCSV(
                    obterModelo(item)
                ) + ";" +
                escaparCSV(
                    item.tamanhoCamisa || ""
                ) + ";" +
                escaparCSV(
                    item.inferior || ""
                ) + ";" +
                escaparCSV(
                    item.tamanhoInferior || ""
                ) +
                "\n";

        }
    );


    const blob =
        new Blob(
            ["\uFEFF" + csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "lista-producao-volei-terapia.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    alert(
        "Lista de produção exportada com sucesso!"
    );

}


// ======================================================
// ESCAPAR CSV
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

            <h2>
                ⚙️ Configurações
            </h2>

            <p style="color:#777;">

                Gerencie os valores e as principais
                configurações do sistema.

            </p>

        </div>


        <div class="card">

            <h3>
                💰 Valores das peças
            </h3>

            <div style="display:grid;gap:12px;">

                <div>

                    <label>
                        Camisa
                    </label>

                    <input
                        id="configCamisa"
                        type="number"
                        min="0"
                        step="0.01"
                        value="75"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #ccc;
                            border-radius:10px;
                            font-size:16px;
                        "
                    >

                </div>


                <div>

                    <label>
                        Baby Look
                    </label>

                    <input
                        id="configBabyLook"
                        type="number"
                        min="0"
                        step="0.01"
                        value="75"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #ccc;
                            border-radius:10px;
                            font-size:16px;
                        "
                    >

                </div>


                <div>

                    <label>
                        Calção masculino
                    </label>

                    <input
                        id="configCalcaoMasc"
                        type="number"
                        min="0"
                        step="0.01"
                        value="35"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #ccc;
                            border-radius:10px;
                            font-size:16px;
                        "
                    >

                </div>


                <div>

                    <label>
                        Calção feminino
                    </label>

                    <input
                        id="configCalcaoFem"
                        type="number"
                        min="0"
                        step="0.01"
                        value="35"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #ccc;
                            border-radius:10px;
                            font-size:16px;
                        "
                    >

                </div>


                <div>

                    <label>
                        Short Doll
                    </label>

                    <input
                        id="configShortDoll"
                        type="number"
                        min="0"
                        step="0.01"
                        value="30"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #ccc;
                            border-radius:10px;
                            font-size:16px;
                        "
                    >

                </div>


                <div>

                    <label>
                        Short Suplex
                    </label>

                    <input
                        id="configShortSuplex"
                        type="number"
                        min="0"
                        step="0.01"
                        value="35"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #ccc;
                            border-radius:10px;
                            font-size:16px;
                        "
                    >

                </div>

            </div>

        </div>


        <div class="card">

            <h3>
                🏐 Configurações do sistema
            </h3>

            <label>
                Nome do time
            </label>

            <input
                id="configNomeTime"
                type="text"
                value="Vôlei Terapia"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    border:1px solid #ccc;
                    border-radius:10px;
                    font-size:16px;
                "
            >

        </div>


        <div class="card">

            <button
                type="button"
                class="admin-button"
                style="
                    width:100%;
                    background:#ff007f;
                "
                onclick="salvarConfiguracoes()"
            >

                💾 SALVAR ALTERAÇÕES

            </button>


            <button
                type="button"
                class="admin-button"
                style="
                    width:100%;
                    margin-top:10px;
                    background:#555;
                "
                onclick="restaurarConfiguracoes()"
            >

                🔄 RESTAURAR PADRÃO

            </button>

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
            style:"currency",
            currency:"BRL"
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
