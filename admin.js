// ======================================================
// ADMIN - VÔLEI TERAPIA
// ======================================================

// ======================================================
// URL DO GOOGLE APPS SCRIPT
// ======================================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";


// ======================================================
// AÇÃO DE LANÇAMENTO DE PAGAMENTO
// ======================================================
//
// O Apps Script já está preparado para receber o lançamento.
// Caso a função do Apps Script tenha outro nome de ação,
// basta alterar SOMENTE esta linha.
//

const ACAO_LANCAR_PAGAMENTO =
"lancarPagamento";


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
// CONVERTER VALOR
// ======================================================
//
// Aceita:
// 75
// "75"
// "75,00"
// "R$ 75,00"
//

function converterNumero(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {

        return 0;

    }


    if (typeof valor === "number") {

        return isNaN(valor)
            ? 0
            : valor;

    }


    let texto =
        String(valor)
            .trim();


    texto =
        texto.replace(
            /R\$/gi,
            ""
        );


    texto =
        texto.replace(
            /\s/g,
            ""
        );


    // Caso venha no formato brasileiro:
    // 1.234,56
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
// CALCULAR PAGAMENTO DO PEDIDO
// ======================================================
//
// IMPORTANTE:
//
// Não confiamos mais em pedido.Restante.
//
// O restante é sempre:
// valorTotal - valorPago
//
// Isso corrige o problema:
// Valor total = 75
// Pago = 0
// Restante = 0
//
// O sistema passa a considerar:
// Restante = 75
//

function obterDadosPagamento(pedido) {

    const valorTotal =
        converterNumero(
            pedido?.valorTotal
        );


    const valorPago =
        converterNumero(
            pedido?.Pago
        );


    let restante =
        valorTotal - valorPago;


    // Evita valores negativos
    if (restante < 0) {

        restante = 0;

    }


    return {

        valorTotal:
            valorTotal,

        valorPago:
            valorPago,

        restante:
            restante

    };

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

            const pagamento =
                obterDadosPagamento(
                    pedido
                );


            totalVendido +=
                pagamento.valorTotal;


            totalRecebido +=
                pagamento.valorPago;


            totalAberto +=
                pagamento.restante;


            // ------------------------------------------
            // SITUAÇÃO
            // ------------------------------------------

            if (
                pagamento.valorTotal > 0 &&
                pagamento.restante <= 0
            ) {

                pedidosPagos++;

            }

            else if (
                pagamento.valorPago > 0 &&
                pagamento.restante > 0
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

            const pagamento =
                obterDadosPagamento(
                    pedido
                );


            const status =
                obterStatusPagamento(
                    pagamento
                );


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
                            pagamento.valorTotal
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
// STATUS DO PAGAMENTO
// ======================================================

function obterStatusPagamento(
    pagamento
) {

    if (
        pagamento.valorTotal > 0 &&
        pagamento.restante <= 0
    ) {

        return "Pago";

    }


    if (
        pagamento.valorPago > 0 &&
        pagamento.restante > 0
    ) {

        return "Parcial";

    }


    return "Não pago";

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

            return String(
                valor
            ).trim();

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
                        <strong>
                            Tamanho da camisa:
                        </strong>
                        ${item.tamanhoCamisa || ""}
                    </p>


                    <p>
                        <strong>
                            Peça inferior:
                        </strong>
                        ${item.inferior || "Nenhum"}
                    </p>


                    <p>
                        <strong>
                            Tamanho inferior:
                        </strong>
                        ${item.tamanhoInferior || "N/A"}
                    </p>


                    <p>
                        <strong>Valor:</strong>
                        ${formatarMoeda(
                            converterNumero(
                                item.valor
                            )
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
//
// O pagamento é lançado DIRETAMENTE NO PEDIDO.
//
// Não existe uma tela separada.
// Não existe seleção de pedido em outro lugar.
//
// É exatamente:
//
// Pedido
// Responsável
// Valor total
// Pago
// Restante
// [campo para valor]
// [REGISTRAR PAGAMENTO]
//
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

            const pagamento =
                obterDadosPagamento(
                    pedido
                );


            const status =
                obterStatusPagamento(
                    pagamento
                );


            const id =
                pedido.idPedido ||
                `pedido-${index}`;


            const pago =
                pagamento.valorPago;


            const restante =
                pagamento.restante;


            const pagoTexto =
                formatarMoeda(
                    pago
                );


            const restanteTexto =
                formatarMoeda(
                    restante
                );


            const totalTexto =
                formatarMoeda(
                    pagamento.valorTotal
                );


            const estaPago =
                restante <= 0 &&
                pagamento.valorTotal > 0;


            html += `

                <div
                    class="card"
                    style="
                        margin-bottom:15px;
                    "
                >

                    <h3
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:10px;
                            flex-wrap:wrap;
                        "
                    >

                        <span>
                            💰 Pedido ${id}
                        </span>

                        <span
                            style="
                                font-size:14px;
                                padding:6px 10px;
                                border-radius:20px;
                                background:${
                                    estaPago
                                    ? "#d4edda"
                                    : pagamento.valorPago > 0
                                        ? "#fff3cd"
                                        : "#f8d7da"
                                };
                                color:${
                                    estaPago
                                    ? "#155724"
                                    : pagamento.valorPago > 0
                                        ? "#856404"
                                        : "#721c24"
                                };
                            "
                        >
                            ${status}
                        </span>

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

                        ${totalTexto}

                    </p>


                    <p>

                        <strong>
                            Já pago:
                        </strong>

                        ${pagoTexto}

                    </p>


                    <p>

                        <strong>
                            Restante:
                        </strong>

                        <span
                            id="restante-${index}"
                        >
                            ${restanteTexto}
                        </span>

                    </p>


                    ${
                        estaPago

                        ?

                        `

                        <div
                            style="
                                margin-top:15px;
                                padding:12px;
                                background:#d4edda;
                                border-radius:10px;
                                color:#155724;
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
                                border-top:1px solid #eee;
                            "
                        >

                            <label
                                for="pagamento-${index}"
                                style="
                                    display:block;
                                    font-weight:bold;
                                    margin-bottom:7px;
                                "
                            >

                                Valor recebido agora

                            </label>


                            <input
                                id="pagamento-${index}"
                                type="number"
                                min="0.01"
                                max="${restante.toFixed(2)}"
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

async function registrarPagamento(
    indice
) {

    const pedido =
        pedidos[indice];


    if (!pedido) {

        alert(
            "Pedido não encontrado."
        );

        return;

    }


    const pagamento =
        obterDadosPagamento(
            pedido
        );


    if (
        pagamento.restante <= 0
    ) {

        alert(
            "Este pedido já está totalmente pago."
        );

        return;

    }


    const campo =
        document.getElementById(
            `pagamento-${indice}`
        );


    if (!campo) {

        alert(
            "Campo de pagamento não encontrado."
        );

        return;

    }


    const valor =
        converterNumero(
            campo.value
        );


    if (
        valor <= 0
    ) {

        alert(
            "Digite um valor de pagamento."
        );

        campo.focus();

        return;

    }


    if (
        valor > pagamento.restante
    ) {

        alert(
            "O valor informado é maior que o restante do pedido."
        );

        campo.focus();

        return;

    }


    const idPedido =
        pedido.idPedido;


    if (!idPedido) {

        alert(
            "Este pedido não possui ID."
        );

        return;

    }


    const botao =
        campo
            .parentElement
            ?.querySelector(
                "button"
            );


    if (botao) {

        botao.disabled =
            true;

        botao.innerText =
            "⏳ REGISTRANDO...";

        botao.style.opacity =
            "0.6";

    }


    try {

        console.log(
            "ENVIANDO PAGAMENTO:",
            {
                acao:
                    ACAO_LANCAR_PAGAMENTO,

                idPedido:
                    idPedido,

                valor:
                    valor
            }
        );


        // ==================================================
        // ENVIO PARA O APPS SCRIPT
        // ==================================================

        const parametros =
            new URLSearchParams();


        parametros.append(
            "acao",
            ACAO_LANCAR_PAGAMENTO
        );


        parametros.append(
            "idPedido",
            idPedido
        );


        parametros.append(
            "valorPagamento",
            valor.toFixed(2)
        );


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
                "O Apps Script não confirmou o pagamento."
            );

        }


        alert(
            "Pagamento registrado com sucesso!"
        );


        // ==================================================
        // RECARREGAR DADOS
        // ==================================================

        await carregarDados();


        // ==================================================
        // CONTINUAR NA ABA PAGAMENTOS
        // ==================================================

        mostrarPagamentos();


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
                "💰 REGISTRAR PAGAMENTO";

            botao.style.opacity =
                "1";

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
        .replace(
            /"/g,
            '""'
        )
        .replace(
            /;/g,
            ","
        );

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

            <p
                style="
                    color:#777;
                "
            >

                Gerencie os valores e as principais
                configurações do sistema.

            </p>

        </div>


        <div class="card">

            <h3>
                💰 Valores das peças
            </h3>


            <p
                style="
                    color:#777;
                "
            >

                Os valores abaixo poderão ser
                configurados nesta área.

            </p>


            <div
                style="
                    display:grid;
                    gap:12px;
                "
            >

                ${criarCampoConfiguracao(
                    "configCamisa",
                    "Camisa",
                    "75"
                )}


                ${criarCampoConfiguracao(
                    "configBabyLook",
                    "Baby Look",
                    "75"
                )}


                ${criarCampoConfiguracao(
                    "configCalcaoMasc",
                    "Calção masculino",
                    "35"
                )}


                ${criarCampoConfiguracao(
                    "configCalcaoFem",
                    "Calção feminino",
                    "35"
                )}


                ${criarCampoConfiguracao(
                    "configShortDoll",
                    "Short Doll",
                    "30"
                )}


                ${criarCampoConfiguracao(
                    "configShortSuplex",
                    "Short Suplex",
                    "35"
                )}

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
                onclick="
                    salvarConfiguracoes()
                "
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
                onclick="
                    restaurarConfiguracoes()
                "
            >

                🔄 RESTAURAR PADRÃO

            </button>

        </div>

    `;

}


// ======================================================
// CAMPO DE CONFIGURAÇÃO
// ======================================================

function criarCampoConfiguracao(
    id,
    label,
    valor
) {

    return `

        <div>

            <label
                for="${id}"
                style="
                    display:block;
                    font-weight:bold;
                    margin-bottom:6px;
                "
            >

                ${label}

            </label>


            <input
                id="${id}"
                type="number"
                min="0"
                step="0.01"
                value="${valor}"
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

    `;

}


// ======================================================
// SALVAR CONFIGURAÇÕES
// ======================================================
//
// Por enquanto ficam salvas no navegador.
// Não altera os valores históricos dos pedidos.
//

function salvarConfiguracoes() {

    const configuracoes = {

        camisa:
            obterValorInput(
                "configCamisa"
            ),

        babyLook:
            obterValorInput(
                "configBabyLook"
            ),

        calcaoMasc:
            obterValorInput(
                "configCalcaoMasc"
            ),

        calcaoFem:
            obterValorInput(
                "configCalcaoFem"
            ),

        shortDoll:
            obterValorInput(
                "configShortDoll"
            ),

        shortSuplex:
            obterValorInput(
                "configShortSuplex"
            ),

        nomeTime:
            obterValorInputTexto(
                "configNomeTime"
            ),

        numeroInicial:
            obterValorInput(
                "configNumeroInicial"
            ),

        numeroFinal:
            obterValorInput(
                "configNumeroFinal"
            )

    };


    localStorage.setItem(
        "configVoleiTerapia",
        JSON.stringify(
            configuracoes
        )
    );


    alert(
        "Configurações salvas."
    );

}


// ======================================================
// RESTAURAR CONFIGURAÇÕES
// ======================================================

function restaurarConfiguracoes() {

    const padrao = {

        camisa: 75,

        babyLook: 75,

        calcaoMasc: 35,

        calcaoFem: 35,

        shortDoll: 30,

        shortSuplex: 35,

        nomeTime:
            "Vôlei Terapia",

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
// OBTER CONFIGURAÇÕES
// ======================================================

function obterConfiguracoes() {

    try {

        const dados =
            localStorage.getItem(
                "configVoleiTerapia"
            );


        if (!dados) {

            return null;

        }


        return JSON.parse(
            dados
        );

    } catch (erro) {

        console.error(
            "Erro nas configurações:",
            erro
        );


        return null;

    }

}


// ======================================================
// INPUT NUMÉRICO
// ======================================================

function obterValorInput(id) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return 0;

    }


    return converterNumero(
        elemento.value
    );

}


// ======================================================
// INPUT TEXTO
// ======================================================

function obterValorInputTexto(id) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return "";

    }


    return elemento.value;

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
            style:
                "currency",

            currency:
                "BRL"
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
