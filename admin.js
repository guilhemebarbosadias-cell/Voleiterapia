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
      "DADOS DO ADMIN:",
      dados
    );


    if (
      dados.result !==
      "success"
    ) {

      throw new Error(
        dados.message ||
        "Erro ao carregar dados."
      );

    }


    pedidos =
      dados.pedidos || [];


    itens =
      dados.itens || [];


    atualizarResumo();


  } catch (erro) {

    console.error(
      "ERRO ADMIN:",
      erro
    );


    mostrarMensagem(
      "Erro ao carregar os dados."
    );

  }

}


// ======================================================
// RESUMO
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


      total += valor;


      const pago =
        String(
          pedido.pago || ""
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
// PEDIDOS
// ======================================================

function mostrarPedidos() {

  const area =
    document.getElementById(
      "conteudoAdmin"
    );


  if (!area) return;


  if (
    pedidos.length === 0
  ) {

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

      html += `

        <div class="card">

          <h3>
            Pedido ${pedido.idPedido || (index + 1)}
          </h3>

          <p>
            <strong>Data:</strong>
            ${pedido.data || "Não informado"}
          </p>

          <p>
            <strong>Responsável:</strong>
            ${pedido.responsavel || "Não informado"}
          </p>

          <p>
            <strong>Quantidade:</strong>
            ${pedido.quantidade || 0}
          </p>

          <p>
            <strong>Valor:</strong>
            ${formatarMoeda(
              pedido.valorTotal
            )}
          </p>

          <p>
            <strong>Parcelas:</strong>
            ${pedido.parcelas || "Não informado"}
          </p>

          <p>
            <strong>Pagamento:</strong>
            ${pedido.pago || "Não informado"}
          </p>

        </div>

      `;

    }
  );


  area.innerHTML =
    html;

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


  if (
    itens.length === 0
  ) {

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

      html += `

        <div class="card">

          <h3>
            Uniforme ${index + 1}
          </h3>

          <p>
            <strong>Nome:</strong>
            ${item.nome || "Não informado"}
          </p>

          <p>
            <strong>Número:</strong>
            ${item.numero || "Não informado"}
          </p>

          <p>
            <strong>Função:</strong>
            ${item.funcao || "Não informado"}
          </p>

          <p>
            <strong>Modelo:</strong>
            ${item.modelo || "Não informado"}
          </p>

          <p>
            <strong>Tamanho:</strong>
            ${item.tamanhoCamisa || "Não informado"}
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
            ${formatarMoeda(item.valor)}
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

function mostrarPagamentos() {

  const area =
    document.getElementById(
      "conteudoAdmin"
    );


  if (!area) return;


  if (
    pedidos.length === 0
  ) {

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

      const pago =
        String(
          pedido.pago || ""
        )
        .trim()
        .toLowerCase() ===
        "sim";


      html += `

        <div class="card">

          <h3>
            ${pedido.idPedido || "Pedido " + (index + 1)}
          </h3>

          <p>
            <strong>Responsável:</strong>
            ${pedido.responsavel || "Não informado"}
          </p>

          <p>
            <strong>Valor:</strong>
            ${formatarMoeda(
              pedido.valorTotal
            )}
          </p>

          <p>
            <strong>Situação:</strong>
            ${pago ? "Pago" : "Em aberto"}
          </p>

        </div>

      `;

    }
  );


  area.innerHTML =
    html;

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
        Esta área será usada futuramente
        para configurar os valores e
        opções dos uniformes.
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
// MOEDA
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
// VOLTAR
// ======================================================

function voltarInicio() {

  window.location.href =
    "index.html";

}


// ======================================================
// INICIAR
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    carregarDados();

  }
);
