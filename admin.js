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
                    pedido.restante
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
                pedido.status ||
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

            const valorTotal =
                Number(
                    pedido.valorTotal
                ) || 0;


            const valorPago =
                Number(
                    pedido.pago
                ) || 0;


            const valorRestante =
                Number(
                    pedido.restante
                ) || 0;


            const status =
                pedido.status ||
                "Não pago";


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


                    ${
                        valorRestante > 0

                        ? `

                        <div style="
                            margin-top:15px;
                            padding-top:15px;
                            border-top:1px solid #ddd;
                        ">

                            <label
                                style="
                                    display:block;
                                    font-weight:bold;
                                    margin-bottom:8px;
                                "
                            >
                                Valor recebido agora:
                            </label>


                            <input
                                type="number"
                                id="pagamento-${index}"
                                min="0.01"
                                max="${valorRestante}"
                                step="0.01"
                                placeholder="0,00"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:12px;
                                    border:1px solid #ccc;
                                    border-radius:10px;
                                    font-size:16px;
                                    margin-bottom:10px;
                                "
                            >


                            <button
                                class="admin-button"
                                onclick="
                                    registrarPagamento(
                                        ${index}
                                    )
                                "
                                style="
                                    width:100%;
                                    background:#ff007f;
                                "
                            >
                                💰 Registrar pagamento
                            </button>

                        </div>

                        `

                        : `

                        <div style="
                            margin-top:15px;
                            padding:12px;
                            background:#eee;
                            border-radius:10px;
                            text-align:center;
                            font-weight:bold;
                        ">
                            ✓ Pedido totalmente pago
                        </div>

                        `

                    }

                </div>

            `;

        }
    );


    area.innerHTML = html;

}


// ======================================================
// REGISTRAR PAGAMENTO
// ======================================================

async function registrarPagamento(
    index
) {

    const pedido =
        pedidos[index];


    if (!pedido) {

        alert(
            "Pedido não encontrado."
        );

        return;

    }


    const input =
        document.getElementById(
            "pagamento-" + index
        );


    if (!input) {

        alert(
            "Campo de pagamento não encontrado."
        );

        return;

    }


    const valor =
        Number(
            input.value
        ) || 0;


    const restanteAtual =
        Number(
            pedido.restante
        ) || 0;


    if (valor <= 0) {

        alert(
            "Digite um valor de pagamento."
        );

        return;

    }


    if (
        valor > restanteAtual
    ) {

        alert(
            "O valor informado é maior que o restante do pedido."
        );

        return;

    }


    const confirmar =
        confirm(
            "Registrar pagamento de " +
            formatarMoeda(valor) +
            " para o pedido " +
            (pedido.idPedido || "") +
            "?"
        );


    if (!confirmar) {

        return;

    }


    try {

        input.disabled =
            true;


        const botoes =
            document.querySelectorAll(
                ".admin-button"
            );


        const botao =
            botoes[
                botoes.length - 1
            ];


        if (botao) {

            botao.disabled =
                true;

            botao.innerText =
                "Registrando...";

        }


        const resposta =
            await fetch(
                URL_APPS_SCRIPT,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            acao:
                                "registrarPagamento",

                            idPedido:
                                pedido.idPedido,

                            responsavel:
                                pedido.responsavel,

                            valorPago:
                                valor

                        })

                }
            );


        const dados =
            await resposta.json();


        console.log(
            "RESPOSTA DO PAGAMENTO:",
            dados
        );


        if (
            !dados ||
            dados.result !==
            "success"
        ) {

            throw new Error(
                dados?.message ||
                "Não foi possível registrar o pagamento."
            );

        }


        alert(
            "Pagamento registrado com sucesso!"
        );


        // Recarrega os dados da planilha.

        await carregarDados();


        // Mostra novamente a tela de pagamentos.

        mostrarPagamentos();


    }

    catch (erro) {

        console.error(
            "ERRO AO REGISTRAR PAGAMENTO:",
            erro
        );


        alert(
            "Não foi possível registrar o pagamento.\n\n" +
            erro.message
        );


        input.disabled =
            false;

    }

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

function mostrarMensagem(
    texto
) {

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

function formatarMoeda(
    valor
) {

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
