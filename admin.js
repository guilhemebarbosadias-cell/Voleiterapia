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
                    pedido.valorTotal
                ) || 0;


            const restante =
                Number(
                    pedido.Restante
                ) || 0;


            total += valor;

            pendente += restante;

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


    if (itens.length === 0) {

        area.innerHTML = `
            <div class="empty">
                Nenhum uniforme encontrado para produção.
            </div>
        `;

        return;

    }


    // ==================================================
    // SEPARAR CAMISAS E PEÇAS INFERIORES
    // ==================================================

    const camisas = [];

    const inferiores = [];


    itens.forEach(
        function(item) {

            // ------------------------------------------
            // CAMISA
            // ------------------------------------------

            camisas.push({

                nome:
                    item.nome || "",

                numero:
                    item.numero || "",

                modelo:
                    obterModelo(item),

                tamanho:
                    item.tamanhoCamisa || ""

            });


            // ------------------------------------------
            // PEÇA INFERIOR
            // ------------------------------------------

            const inferior =
                String(
                    item.inferior || ""
                ).trim();


            if (
                inferior !== "" &&
                inferior.toLowerCase() !== "nenhum" &&
                inferior.toLowerCase() !== "n/a"
            ) {

                inferiores.push({

                    nome:
                        item.nome || "",

                    peca:
                        inferior,

                    tamanho:
                        item.tamanhoInferior || ""

                });

            }

        }
    );


    // ==================================================
    // RESUMO
    // ==================================================

    let html = `

        <div class="card">

            <h2>
                🏭 Lista de Produção
            </h2>

            <p>
                <strong>
                    Total de camisas:
                </strong>

                ${camisas.length}
            </p>

            <p>
                <strong>
                    Total de peças inferiores:
                </strong>

                ${inferiores.length}
            </p>

        </div>

    `;


    // ==================================================
    // LISTA DE CAMISAS
    // ==================================================

    html += `

        <div class="card">

            <h3>
                👕 CAMISAS
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
                        margin-top:15px;
                    "
                >

                    <thead>

                        <tr>

                            <th
                                style="
                                    text-align:left;
                                    padding:10px;
                                    border-bottom:2px solid #ff007f;
                                "
                            >
                                Qtd.
                            </th>

                            <th
                                style="
                                    text-align:left;
                                    padding:10px;
                                    border-bottom:2px solid #ff007f;
                                "
                            >
                                Nome
                            </th>

                            <th
                                style="
                                    text-align:left;
                                    padding:10px;
                                    border-bottom:2px solid #ff007f;
                                "
                            >
                                Nº
                            </th>

                            <th
                                style="
                                    text-align:left;
                                    padding:10px;
                                    border-bottom:2px solid #ff007f;
                                "
                            >
                                Modelo
                            </th>

                            <th
                                style="
                                    text-align:left;
                                    padding:10px;
                                    border-bottom:2px solid #ff007f;
                                "
                            >
                                Tamanho
                            </th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    camisas.forEach(
        function(camisa) {

            html += `

                <tr>

                    <td
                        style="
                            padding:10px;
                            border-bottom:1px solid #ddd;
                        "
                    >
                        1
                    </td>

                    <td
                        style="
                            padding:10px;
                            border-bottom:1px solid #ddd;
                            font-weight:bold;
                        "
                    >
                        ${camisa.nome}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border-bottom:1px solid #ddd;
                        "
                    >
                        ${camisa.numero}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border-bottom:1px solid #ddd;
                        "
                    >
                        ${camisa.modelo}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border-bottom:1px solid #ddd;
                        "
                    >
                        ${camisa.tamanho}
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

    `;


    // ==================================================
    // LISTA DE INFERIORES
    // ==================================================

    if (inferiores.length > 0) {

        html += `

            <div class="card">

                <h3>
                    🩳 PEÇAS INFERIORES
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
                            margin-top:15px;
                        "
                    >

                        <thead>

                            <tr>

                                <th
                                    style="
                                        text-align:left;
                                        padding:10px;
                                        border-bottom:2px solid #ff007f;
                                    "
                                >
                                    Qtd.
                                </th>

                                <th
                                    style="
                                        text-align:left;
                                        padding:10px;
                                        border-bottom:2px solid #ff007f;
                                    "
                                >
                                    Nome
                                </th>

                                <th
                                    style="
                                        text-align:left;
                                        padding:10px;
                                        border-bottom:2px solid #ff007f;
                                    "
                                >
                                    Peça
                                </th>

                                <th
                                    style="
                                        text-align:left;
                                        padding:10px;
                                        border-bottom:2px solid #ff007f;
                                    "
                                >
                                    Tamanho
                                </th>

                            </tr>

                        </thead>

                        <tbody>

        `;


        inferiores.forEach(
            function(inferior) {

                html += `

                    <tr>

                        <td
                            style="
                                padding:10px;
                                border-bottom:1px solid #ddd;
                            "
                        >
                            1
                        </td>

                        <td
                            style="
                                padding:10px;
                                border-bottom:1px solid #ddd;
                                font-weight:bold;
                            "
                        >
                            ${inferior.nome}
                        </td>

                        <td
                            style="
                                padding:10px;
                                border-bottom:1px solid #ddd;
                            "
                        >
                            ${inferior.peca}
                        </td>

                        <td
                            style="
                                padding:10px;
                                border-bottom:1px solid #ddd;
                            "
                        >
                            ${inferior.tamanho}
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

        `;

    }


    // ==================================================
    // BOTÕES
    // PREPARADOS PARA A PRÓXIMA ETAPA
    // ==================================================

    html += `

        <div class="card">

            <button
                type="button"
                class="admin-button"
                onclick="window.print()"
                style="
                    width:100%;
                    margin-bottom:10px;
                    background:#000;
                "
            >

                🖨️ IMPRIMIR / SALVAR PDF

            </button>


            <button
                type="button"
                class="admin-button"
                style="
                    width:100%;
                    background:#ff007f;
                "
                onclick="exportarProducaoPlanilha()"
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
    // CABEÇALHO
    // ==================================================

    let linhas = [];


    linhas.push([
        "TIPO",
        "QTD.",
        "NOME",
        "Nº",
        "MODELO",
        "TAMANHO",
        "PEÇA INFERIOR",
        "TAMANHO INFERIOR"
    ]);


    // ==================================================
    // ADICIONAR ITENS
    // ==================================================

    itens.forEach(
        function(item) {

            const nome =
                item.nome || "";

            const numero =
                item.numero || "";

            const modelo =
                obterModelo(item);

            const tamanho =
                item.tamanhoCamisa || "";

            const inferior =
                String(
                    item.inferior || ""
                ).trim();

            const tamanhoInferior =
                item.tamanhoInferior || "";


            // ------------------------------------------
            // CAMISA
            // ------------------------------------------

            linhas.push([

                "CAMISA",

                "1",

                nome,

                numero,

                modelo,

                tamanho,

                "",

                ""

            ]);


            // ------------------------------------------
            // INFERIOR
            // ------------------------------------------

            if (
                inferior !== "" &&
                inferior.toLowerCase() !== "nenhum" &&
                inferior.toLowerCase() !== "n/a"
            ) {

                linhas.push([

                    "INFERIOR",

                    "1",

                    nome,

                    "",

                    "",

                    "",

                    inferior,

                    tamanhoInferior

                ]);

            }

        }
    );


    // ==================================================
    // TRANSFORMAR EM CSV
    // ==================================================

    const csv =
        linhas
            .map(
                function(linha) {

                    return linha
                        .map(
                            function(valor) {

                                const texto =
                                    String(
                                        valor ?? ""
                                    )
                                    .replace(
                                        /"/g,
                                        '""'
                                    );

                                return `"${texto}"`;

                            }
                        )
                        .join(";");

                }
            )
            .join("\n");


    // ==================================================
    // CRIAR ARQUIVO
    // ==================================================

    const blob =
        new Blob(
            [
                "\uFEFF" + csv
            ],
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
