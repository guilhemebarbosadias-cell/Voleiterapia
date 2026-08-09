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

    let totalVendido = 0;
    let totalRecebido = 0;
    let totalAberto = 0;

    let pedidosPagos = 0;
    let pedidosParciais = 0;
    let pedidosNaoPagos = 0;

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

            totalVendido +=
                valorTotalPedido;

            totalRecebido +=
                valorPagoPedido;

            totalAberto +=
                valorRestantePedido;

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

    esconderAreaLancamentoAntiga();

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


    area.innerHTML =
        html;

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

    esconderAreaLancamentoAntiga();

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
// NÃO EXISTE UMA ABA SEPARADA PARA LANÇAMENTO.
// ======================================================

function mostrarPagamentos() {

    esconderAreaLancamentoAntiga();

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


    let html = `

        <div
            style="
                margin-bottom:15px;
                padding:15px;
                background:#f5f5f5;
                border-radius:12px;
            "
        >

            <strong>
                💰 Pagamentos
            </strong>

            <div
                style="
                    color:#777;
                    margin-top:5px;
                    font-size:14px;
                "
            >
                Selecione o pedido e lance o valor
                recebido diretamente nele.
            </div>

        </div>

    `;


    pedidos.forEach(
        function(pedido, index) {

            const idPedido =
                pedido.idPedido ||
                pedido.ID ||
                pedido.id ||
                `Pedido ${index + 1}`;


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
                ) || Math.max(
                    valorTotal - valorPago,
                    0
                );


            const bloqueado =
                valorRestante <= 0;


            html += `

                <div
                    class="card"
                    style="
                        margin-bottom:15px;
                    "
                >

                    <h3>
                        💰 ${idPedido}
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
                            Já pago:
                        </strong>

                        ${formatarMoeda(
                            valorPago
                        )}
                    </p>


                    <p>
                        <strong>
                            Restante:
                        </strong>

                        <span
                            style="
                                font-weight:bold;
                                color:${
                                    bloqueado
                                        ? "#168a3a"
                                        : "#d97706"
                                };
                            "
                        >
                            ${formatarMoeda(
                                valorRestante
                            )}
                        </span>

                    </p>


                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${status}

                    </p>


                    ${
                        bloqueado

                        ?

                        `
                            <div
                                style="
                                    margin-top:15px;
                                    padding:12px;
                                    background:#e9f8ee;
                                    color:#168a3a;
                                    border-radius:10px;
                                    font-weight:bold;
                                    text-align:center;
                                "
                            >
                                ✅ Pedido totalmente pago
                            </div>
                        `

                        :

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
                                    id="pagamento-${index}"
                                    type="number"
                                    min="0"
                                    max="${valorRestante}"
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
                                    💰 REGISTRAR PAGAMENTO
                                </button>

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


    const valorRecebido =
        Number(
            campo.value
        ) || 0;


    const valorTotal =
        Number(
            pedido.valorTotal
        ) || 0;


    const valorPagoAtual =
        Number(
            pedido.Pago
        ) || 0;


    const valorRestanteAtual =
        Number(
            pedido.Restante
        ) || Math.max(
            valorTotal - valorPagoAtual,
            0
        );


    if (valorRecebido <= 0) {

        alert(
            "Informe um valor de pagamento."
        );

        campo.focus();

        return;

    }


    if (
        valorRecebido >
        valorRestanteAtual
    ) {

        alert(
            "O valor informado é maior que o valor restante do pedido."
        );

        campo.focus();

        return;

    }


    const idPedido =
        pedido.idPedido ||
        pedido.ID ||
        pedido.id;


    if (!idPedido) {

        alert(
            "Este pedido não possui ID."
        );

        return;

    }


    const botao =
        document.querySelector(
            `[onclick="registrarPagamento(${index})"]`
        );


    if (botao) {

        botao.disabled = true;

        botao.innerText =
            "⏳ REGISTRANDO...";

    }


    try {

        /*
         * O Apps Script continua sendo o responsável
         * por alterar a planilha.
         *
         * O JavaScript apenas envia:
         * - ID do pedido
         * - valor recebido
         */

        const url =
            URL_APPS_SCRIPT +
            "?acao=registrarPagamento" +
            "&idPedido=" +
            encodeURIComponent(
                idPedido
            ) +
            "&valor=" +
            encodeURIComponent(
                valorRecebido
            );


        console.log(
            "ENVIANDO PAGAMENTO:",
            {
                idPedido:
                    idPedido,

                valor:
                    valorRecebido
            }
        );


        const resposta =
            await fetch(
                url
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
                "O Apps Script não confirmou o pagamento."
            );

        }


        alert(
            "Pagamento registrado com sucesso!"
        );


        /*
         * Recarrega os dados da planilha.
         * Assim o valor pago, restante e status
         * aparecem imediatamente atualizados.
         */

        await carregarDados();


        mostrarPagamentos();


    } catch (erro) {

        console.error(
            "ERRO AO REGISTRAR PAGAMENTO:",
            erro
        );


        alert(
            "Não foi possível registrar o pagamento.\n\n" +
            (
                erro.message ||
                "Erro desconhecido."
            )
        );


        if (botao) {

            botao.disabled = false;

            botao.innerText =
                "💰 REGISTRAR PAGAMENTO";

        }

    }

}


// ======================================================
// ESCONDER ÁREA ANTIGA DE PAGAMENTO
// ======================================================
// Mantém compatibilidade caso o HTML antigo ainda
// possua areaLancamentoPagamento.
// ======================================================

function esconderAreaLancamentoAntiga() {

    const area =
        document.getElementById(
            "areaLancamentoPagamento"
        );


    if (area) {

        area.style.display =
            "none";

    }

}


// ======================================================
// PRODUÇÃO
// ======================================================

function mostrarProducao() {

    esconderAreaLancamentoAntiga();

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

                            <th style="padding:12px;">
                                Nome
                            </th>

                            <th style="padding:12px;">
                                Nº
                            </th>

                            <th style="padding:12px;">
                                Função
                            </th>

                            <th style="padding:12px;">
                                Modelo
                            </th>

                            <th style="padding:12px;">
                                Tam. camisa
                            </th>

                            <th style="padding:12px;">
                                Peça inferior
                            </th>

                            <th style="padding:12px;">
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

            } else {

                modelo =
                    "Camisa";

            }


            const tamanhoCamisa =
                item.tamanhoCamisa || "";


            const inferior =
                item.inferior ||
                "Nenhum";


            const tamanhoInferior =
                item.tamanhoInferior ||
                "N/A";


            html += `

                <tr
                    style="
                        border-bottom:
                            1px solid #ddd;
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
// EXPORTAR PRODUÇÃO PARA PLANILHA
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

    esconderAreaLancamentoAntiga();

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

            <p style="color:#777;">
                Os valores abaixo poderão ser alterados
                diretamente por esta área.
            </p>


            <div
                style="
                    display:grid;
                    gap:12px;
                "
            >

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
                    margin-top:6px;
                "
            >


            <label
                style="
                    display:block;
                    margin-top:15px;
                "
            >
                Número inicial
            </label>

            <input
                id="configNumeroInicial"
                type="number"
                min="1"
                max="99"
                value="1"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    border:1px solid #ccc;
                    border-radius:10px;
                    font-size:16px;
                    margin-top:6px;
                "
            >


            <label
                style="
                    display:block;
                    margin-top:15px;
                "
            >
                Número final
            </label>

            <input
                id="configNumeroFinal"
                type="number"
                min="1"
                max="99"
                value="99"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    border:1px solid #ccc;
                    border-radius:10px;
                    font-size:16px;
                    margin-top:6px;
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
// SALVAR CONFIGURAÇÕES
// ======================================================

function salvarConfiguracoes() {

    const configuracoes = {

        camisa:
            Number(
                document.getElementById(
                    "configCamisa"
                )?.value
            ) || 0,

        babyLook:
            Number(
                document.getElementById(
                    "configBabyLook"
                )?.value
            ) || 0,

        calcaoMasc:
            Number(
                document.getElementById(
                    "configCalcaoMasc"
                )?.value
            ) || 0,

        calcaoFem:
            Number(
                document.getElementById(
                    "configCalcaoFem"
                )?.value
            ) || 0,

        shortDoll:
            Number(
                document.getElementById(
                    "configShortDoll"
                )?.value
            ) || 0,

        shortSuplex:
            Number(
                document.getElementById(
                    "configShortSuplex"
                )?.value
            ) || 0,

        nomeTime:
            document.getElementById(
                "configNomeTime"
            )?.value || "Vôlei Terapia",

        numeroInicial:
            Number(
                document.getElementById(
                    "configNumeroInicial"
                )?.value
            ) || 1,

        numeroFinal:
            Number(
                document.getElementById(
                    "configNumeroFinal"
                )?.value
            ) || 99

    };


    localStorage.setItem(
        "configVoleiTerapia",
        JSON.stringify(
            configuracoes
        )
    );


    alert(
        "Configurações salvas neste dispositivo."
    );

}


// ======================================================
// RESTAURAR CONFIGURAÇÕES
// ======================================================

function restaurarConfiguracoes() {

    if (
        !confirm(
            "Restaurar as configurações padrão?"
        )
    ) {

        return;

    }


    const padrao = {

        camisa: 75,
        babyLook: 75,
        calcaoMasc: 35,
        calcaoFem: 35,
        shortDoll: 30,
        shortSuplex: 35,
        nomeTime: "Vôlei Terapia",
        numeroInicial: 1,
        numeroFinal: 99

    };


    localStorage.setItem(
        "configVoleiTerapia",
        JSON.stringify(
            padrao
        )
    );


    mostrarConfiguracoes();


    alert(
        "Configurações restauradas."
    );

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

        esconderAreaLancamentoAntiga();

        carregarDados();

    }
);
