// ======================================================
// URL DO GOOGLE APPS SCRIPT / WEB APP
// CONSULTA EXCLUSIVA DA ÁREA ADMINISTRATIVA
// ======================================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec?acao=admin";


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
            await fetch(URL_APPS_SCRIPT);


        const dados =
            await resposta.json();


        console.log(
            "DADOS RECEBIDOS DO ADMIN:",
            dados
        );


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
        document.getElementById("totalPedidos");


    const totalUniformes =
        document.getElementById("totalUniformes");


    const valorTotal =
        document.getElementById("valorTotal");


    const valorPendente =
        document.getElementById("valorPendente");


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
                pedido["Valor Total"] ??
                pedido.valorTotal ??
                0
            );


        total += valor;


        const pago =
            String(
                pedido["Pago"] ??
                pedido.pago ??
                "Não"
            )
            .trim()
            .toLowerCase();


        if (pago !== "sim") {

            pendente += valor;

        }

    });


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
// BOTÃO PEDIDOS
// ======================================================

function mostrarPedidos() {

    const area =
        document.getElementById("conteudoAdmin");


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

        const id =
            pedido["ID Pedido"] ??
            pedido.idPedido ??
            "";


        const data =
            pedido["Data"] ??
            pedido.data ??
            "";


        const responsavel =
            pedido["Responsável"] ??
            pedido.responsavel ??
            "";


        const quantidade =
            pedido["Quantidade"] ??
            pedido.quantidade ??
            0;


        const valor =
            Number(
                pedido["Valor Total"] ??
                pedido.valorTotal ??
                0
            );


        const parcelas =
            pedido["Parcelas"] ??
            pedido.parcelas ??
            "";


        const pago =
            pedido["Pago"] ??
            pedido.pago ??
            "Não";


        html += `

            <div class="card">

                <h3>
                    Pedido ${id}
                </h3>


                <p>
                    <strong>Data:</strong>
                    ${data}
                </p>


                <p>
                    <strong>Responsável:</strong>
                    ${responsavel}
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
                    ${parcelas}
                </p>


                <p>
                    <strong>Pagamento:</strong>
                    ${pago}
                </p>

            </div>

        `;

    });


    area.innerHTML = html;

}


// ======================================================
// BOTÃO UNIFORMES
// ======================================================

function mostrarUniformes() {

    const area =
        document.getElementById("conteudoAdmin");


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

        const nome =
            item["Nome"] ??
            item.nome ??
            "";


        const numero =
            item["Número"] ??
            item.numero ??
            "";


        const categoria =
            item["Categoria"] ??
            item.categoria ??
            "";


        const funcao =
            item["Função"] ??
            item.funcao ??
            "";


        const uniforme =
            item["Uniforme"] ??
            item.uniforme ??
            "";


        const modelo =
            item["Modelo"] ??
            item.modelo ??
            "";


        const tamanho =
            item["Tamanho Camisa"] ??
            item.tamanhoCamisa ??
            "";


        const inferior =
            item["Peça Inferior"] ??
            item.inferior ??
            "Nenhum";


        const tamanhoInferior =
            item["Tamanho Inferior"] ??
            item.tamanhoInferior ??
            "N/A";


        const valor =
            Number(
                item["Valor"] ??
                item.valor ??
                0
            );


        const responsavel =
            item["Responsável"] ??
            item.responsavel ??
            "";


        html += `

            <div class="card">

                <h3>
                    Uniforme ${index + 1}
                </h3>


                <p>
                    <strong>Responsável:</strong>
                    ${responsavel}
                </p>


                <p>
                    <strong>Nome:</strong>
                    ${nome}
                </p>


                <p>
                    <strong>Número:</strong>
                    ${numero}
                </p>


                <p>
                    <strong>Categoria:</strong>
                    ${categoria}
                </p>


                <p>
                    <strong>Função:</strong>
                    ${funcao}
                </p>


                <p>
                    <strong>Uniforme:</strong>
                    ${uniforme}
                </p>


                <p>
                    <strong>Modelo:</strong>
                    ${modelo}
                </p>


                <p>
                    <strong>Tamanho:</strong>
                    ${tamanho}
                </p>


                <p>
                    <strong>Peça inferior:</strong>
                    ${inferior}
                </p>


                <p>
                    <strong>Tamanho inferior:</strong>
                    ${tamanhoInferior}
                </p>


                <p>
                    <strong>Valor:</strong>
                    ${formatarMoeda(valor)}
                </p>

            </div>

        `;

    });


    area.innerHTML = html;

}


// ======================================================
// BOTÃO PAGAMENTOS
// ======================================================

function mostrarPagamentos() {

    const area =
        document.getElementById("conteudoAdmin");


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

        const id =
            pedido["ID Pedido"] ??
            pedido.idPedido ??
            "Pedido";


        const responsavel =
            pedido["Responsável"] ??
            pedido.responsavel ??
            "";


        const valor =
            Number(
                pedido["Valor Total"] ??
                pedido.valorTotal ??
                0
            );


        const pago =
            String(
                pedido["Pago"] ??
                pedido.pago ??
                "Não"
            )
            .trim()
            .toLowerCase() === "sim";


        html += `

            <div class="card">

                <h3>
                    ${id}
                </h3>


                <p>

                    <strong>
                        Responsável:
                    </strong>

                    ${responsavel}

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

    });


    area.innerHTML = html;

}


// ======================================================
// BOTÃO CONFIGURAÇÕES
// ======================================================

function mostrarConfiguracoes() {

    const area =
        document.getElementById("conteudoAdmin");


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
        document.getElementById("conteudoAdmin");


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
