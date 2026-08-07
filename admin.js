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

        const resposta =
            await fetch(
                URL_APPS_SCRIPT +
                "?acao=admin"
            );


        const dados =
            await resposta.json();


        if (dados.result !== "success") {

            throw new Error(
                dados.message ||
                "Não foi possível carregar os dados."
            );

        }


        pedidos =
            dados.pedidos || [];


        itens =
            dados.itens || [];


        atualizarResumo();


    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
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


    pedidos.forEach(function(pedido) {

        let valor =
            Number(
                pedido.valorTotal
            ) || 0;


        total += valor;


        if (
            String(
                pedido.pago
            ).toLowerCase() !== "sim"
        ) {

            pendente += valor;

        }

    });


    if (valorTotal) {

        valorTotal.innerText =
            formatarMoeda(
                total
            );

    }


    if (valorPendente) {

        valorPendente.innerText =
            formatarMoeda(
                pendente
            );

    }

}


// ======================================================
// BOTÃO PEDIDOS
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


    pedidos.forEach(function(pedido) {

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
                    <strong>Pagamento:</strong>
                    ${pedido.pago || "Não"}
                </p>

            </div>

        `;

    });


    area.innerHTML =
        html;

}


// ======================================================
// BOTÃO UNIFORMES
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


    itens.forEach(function(item, index) {

        html += `

            <div class="card">

                <h3>
                    Uniforme
                    ${index + 1}
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
                    <strong>Uniforme:</strong>
                    ${item.uniforme || ""}
                </p>


                <p>
                    <strong>Modelo:</strong>
                    ${item.modelo || ""}
                </p>


                <p>
                    <strong>Tamanho:</strong>
                    ${item.tamanhoCamisa || ""}
                </p>


                <p>
                    <strong>Peça inferior:</strong>
                    ${item.inferior || "Nenhum"}
                </p>


                <p>
                    <strong>Valor:</strong>
                    ${formatarMoeda(
                        Number(
                            item.valor
                        ) || 0
                    )}
                </p>

            </div>

        `;

    });


    area.innerHTML =
        html;

}


// ======================================================
// BOTÃO PAGAMENTOS
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


    pedidos.forEach(function(pedido) {

        const pago =
            String(
                pedido.pago || "Não"
            ).toLowerCase() === "sim";


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
                        Valor:
                    </strong>

                    ${formatarMoeda(
                        Number(
                            pedido.valorTotal
                        ) || 0
                    )}

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

    });


    area.innerHTML =
        html;

}


// ======================================================
// BOTÃO CONFIGURAÇÕES
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
