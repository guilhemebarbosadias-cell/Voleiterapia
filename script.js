let pedido = [];

let categoriaSelecionada = "";
let uniformeSelecionado = "";
let funcaoSelecionada = "";
let numeroSelecionado = "";

let numerosBloqueadosFeminino = [];

// ======================================================
// PROTEÇÃO CONTRA ENVIO DUPLICADO
// ======================================================

let enviandoPedido = false;


// ======================================================
// URL DO GOOGLE APPS SCRIPT / WEB APP
// ======================================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";


// ======================================================
// VALORES
// ======================================================

const valores = {

    camisa: 75,

    babyLook: 75,

    calcaoMasc: 35,

    calcaoFem: 35,

    shortDoll: 30,

    shortSuplex: 35

};


// ======================================================
// BUSCAR CONFIGURAÇÕES DA PLANILHA
// ======================================================

async function buscarConfiguracoes(){

    try{

        const resposta =
            await fetch(
                URL_APPS_SCRIPT +
                "?acao=configuracoes"
            );


        const dados =
            await resposta.json();


        console.log(
            "CONFIGURAÇÕES RECEBIDAS:",
            dados
        );


        if(
            !dados ||
            dados.result !== "success"
        ){

            throw new Error(
                dados?.message ||
                "Não foi possível carregar as configurações."
            );

        }


        const configuracoes =
            dados.configuracoes || {};


        if(
            configuracoes["Camisa"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Camisa"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.camisa =
                    valor;

            }

        }


        if(
            configuracoes["Baby Look"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Baby Look"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.babyLook =
                    valor;

            }

        }


        if(
            configuracoes["Calção masculino"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Calção masculino"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.calcaoMasc =
                    valor;

            }

        }


        if(
            configuracoes["Calção feminino"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Calção feminino"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.calcaoFem =
                    valor;

            }

        }


        if(
            configuracoes["Short Doll"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Short Doll"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.shortDoll =
                    valor;

            }

        }


        if(
            configuracoes["Short Suplex"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Short Suplex"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.shortSuplex =
                    valor;

            }

        }

        else if(
            configuracoes["Suplex"] !== undefined
        ){

            const valor =
                Number(
                    configuracoes["Suplex"]
                );

            if(
                !Number.isNaN(valor)
            ){

                valores.shortSuplex =
                    valor;

            }

        }


        console.log(
            "VALORES ATUAIS DO SISTEMA:",
            valores
        );


        return true;


    }catch(error){

        console.error(
            "Erro ao buscar configurações:",
            error
        );


        return false;

    }

}


// ======================================================
// BUSCAR NÚMEROS FEMININOS
// ======================================================

async function buscarNumerosOficiais(){

    try{

        const resposta =
            await fetch(
                URL_APPS_SCRIPT
            );


        const dados =
            await resposta.json();


        if(
            dados.result === "success"
        ){

            numerosBloqueadosFeminino =
                dados.feminino || [];

        }else{

            numerosBloqueadosFeminino =
                [];

        }


    }catch(error){

        console.error(
            "Erro ao buscar números femininos:",
            error
        );


        numerosBloqueadosFeminino =
            [];

    }

}


// ======================================================
// ABRIR CONFIGURAÇÃO
// ======================================================

async function abrirItem(){

    const configuracao =
        document.getElementById(
            "configuracao"
        );


    if(configuracao){

        configuracao.style.display =
            "block";

    }


    await buscarConfiguracoes();

    await buscarNumerosOficiais();

    gerarMapaNumeros();

}


// ======================================================
// SELECIONAR OFICIAL / ADICIONAL
// ======================================================

function selecionarUniforme(
    tipo,
    botao
){

    uniformeSelecionado =
        tipo;


    document
        .querySelectorAll(
            ".grupoUniforme .opcao"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "ativo"
                );

            }
        );


    if(botao){

        botao.classList.add(
            "ativo"
        );

    }


    gerarMapaNumeros();

}


// ======================================================
// SELECIONAR NORMAL / LÍBERO
// ======================================================

function selecionarFuncao(
    funcao,
    botao
){

    funcaoSelecionada =
        funcao;


    document
        .querySelectorAll(
            ".grupoFuncao .opcao"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "ativo"
                );

            }
        );


    if(botao){

        botao.classList.add(
            "ativo"
        );

    }

}


// ======================================================
// SELECIONAR CATEGORIA
// ======================================================

function selecionarCategoria(
    categoria,
    botao
){

    categoriaSelecionada =
        categoria;


    document
        .querySelectorAll(
            ".grupoCategoria .opcao"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "ativo"
                );

            }
        );


    if(botao){

        botao.classList.add(
            "ativo"
        );

    }


    mostrarOpcoesUniforme();

    gerarMapaNumeros();

}


// ======================================================
// MOSTRAR PRODUTOS
// ======================================================

function mostrarOpcoesUniforme(){

    const area =
        document.getElementById(
            "produtos"
        );


    if(!area){

        return;

    }


    const tamanho = `

        <label>
            Tamanho da camisa
        </label>

        <select id="tamanhoCamisa">

            <option>PP</option>
            <option>P</option>
            <option>M</option>
            <option>G</option>
            <option>GG</option>
            <option>XGG</option>

        </select>

    `;


    let html = "";


    if(
        categoriaSelecionada ===
        "Masculino"
    ){

        html = `

        <div class="card">

            <label>
                Modelo da camisa
            </label>

            <select id="modeloCamisa">

                <option>
                    Camisa
                </option>

            </select>


            ${tamanho}


            <label>
                Adicionar calção?
            </label>


            <select
                id="usaInferior"
                onchange="mostrarInferior()">

                <option value="nao">
                    Não
                </option>

                <option value="sim">
                    Sim
                </option>

            </select>


            <div id="inferior"></div>

        </div>

        `;

    }


    if(
        categoriaSelecionada ===
        "Feminino"
    ){

        html = `

        <div class="card">

            <label>
                Modelo da camisa
            </label>

            <select id="modeloCamisa">

                <option>
                    Baby Look
                </option>

                <option>
                    Camisa
                </option>

            </select>


            ${tamanho}


            <label>
                Adicionar peça inferior?
            </label>


            <select
                id="usaInferior"
                onchange="mostrarInferior()">

                <option value="nao">
                    Não
                </option>

                <option value="sim">
                    Sim
                </option>

            </select>


            <div id="inferior"></div>

        </div>

        `;

    }


    area.innerHTML =
        html;

}


// ======================================================
// MOSTRAR PEÇA INFERIOR
// ======================================================

function mostrarInferior(){

    const area =
        document.getElementById(
            "inferior"
        );


    const campoUsa =
        document.getElementById(
            "usaInferior"
        );


    if(
        !area ||
        !campoUsa
    ){

        return;

    }


    const usa =
        campoUsa.value;


    if(
        usa === "nao"
    ){

        area.innerHTML =
            "";

        return;

    }


    let html = "";


    if(
        categoriaSelecionada ===
        "Masculino"
    ){

        html = `

        <label>
            Tipo de calção
        </label>

        <select id="tipoInferior">

            <option value="calcaoMasc">
                Calção masculino
            </option>

        </select>


        <label>
            Tamanho do calção
        </label>

        <select id="tamanhoInferior">

            <option>PP</option>
            <option>P</option>
            <option>M</option>
            <option>G</option>
            <option>GG</option>

        </select>

        `;

    }


    if(
        categoriaSelecionada ===
        "Feminino"
    ){

        html = `

        <label>
            Tipo de peça
        </label>

        <select id="tipoInferior">

            <option value="calcaoFem">
                Calção feminino
            </option>

            <option value="shortDoll">
                Short Doll
            </option>

            <option value="shortSuplex">
                Short Suplex
            </option>

        </select>


        <label>
            Tamanho
        </label>

        <select id="tamanhoInferior">

            <option>PP</option>
            <option>P</option>
            <option>M</option>
            <option>G</option>
            <option>GG</option>

        </select>

        `;

    }


    area.innerHTML =
        html;

}


// ======================================================
// MAPA DE NÚMEROS
// ======================================================

function gerarMapaNumeros(){

    const mapa =
        document.getElementById(
            "mapaNumero"
        );


    if(!mapa){

        return;

    }


    mapa.innerHTML =
        "";


    for(
        let i = 0;
        i <= 99;
        i++
    ){

        const numero =
            i
                .toString()
                .padStart(
                    2,
                    "0"
                );


        const botao =
            document.createElement(
                "button"
            );


        botao.type =
            "button";


        botao.innerText =
            numero;


        let bloqueado =
            false;


        if(
            uniformeSelecionado ===
            "Oficial" &&
            categoriaSelecionada ===
            "Feminino"
        ){

            bloqueado =
                numerosBloqueadosFeminino
                    .includes(
                        numero
                    );

        }


        if(bloqueado){

            botao.disabled =
                true;


            botao.classList.add(
                "bloqueado"
            );


            botao.style.opacity =
                "0.35";


            botao.style.filter =
                "grayscale(100%)";


            botao.style.cursor =
                "not-allowed";

        }


        botao.onclick =
            function(){

                if(
                    botao.disabled
                ){

                    return;

                }


                document
                    .querySelectorAll(
                        "#mapaNumero button"
                    )
                    .forEach(
                        btn => {

                            btn.classList.remove(
                                "ativo"
                            );

                        }
                    );


                botao.classList.add(
                    "ativo"
                );


                numeroSelecionado =
                    numero;

            };


        mapa.appendChild(
            botao
        );

    }

}


// ======================================================
// CALCULAR VALOR
// ======================================================

function calcularValor(){

    let total =
        valores.camisa;


    const modelo =
        document.getElementById(
            "modeloCamisa"
        );


    if(
        modelo &&
        modelo.value ===
        "Baby Look"
    ){

        total =
            valores.babyLook;

    }

    else{

        total =
            valores.camisa;

    }


    const usa =
        document.getElementById(
            "usaInferior"
        );


    if(
        usa &&
        usa.value ===
        "sim"
    ){

        const tipo =
            document.getElementById(
                "tipoInferior"
            );


        if(
            tipo
        ){

            if(
                tipo.value ===
                "calcaoMasc"
            ){

                total +=
                    valores.calcaoMasc;

            }


            if(
                tipo.value ===
                "calcaoFem"
            ){

                total +=
                    valores.calcaoFem;

            }


            if(
                tipo.value ===
                "shortDoll"
            ){

                total +=
                    valores.shortDoll;

            }


            if(
                tipo.value ===
                "shortSuplex"
            ){

                total +=
                    valores.shortSuplex;

            }

        }

    }


    return total;

}


// ======================================================
// ADICIONAR ITEM AO PEDIDO
// ======================================================

function adicionarItemPedido(){

    const campoNome =
        document.getElementById(
            "nomePersonalizado"
        );


    const nome =
        campoNome
            ? campoNome.value.trim()
            : "";


    if(
        uniformeSelecionado ===
        ""
    ){

        alert(
            "Selecione Oficial ou Adicional."
        );

        return;

    }


    if(
        funcaoSelecionada ===
        ""
    ){

        alert(
            "Selecione Normal ou Líbero."
        );

        return;

    }


    if(
        categoriaSelecionada ===
        ""
    ){

        alert(
            "Selecione Masculino ou Feminino."
        );

        return;

    }


    if(
        numeroSelecionado ===
        ""
    ){

        alert(
            "Selecione o número."
        );

        return;

    }


    if(
        nome === ""
    ){

        alert(
            "Digite o nome."
        );

        return;

    }


    const modelo =
        document.getElementById(
            "modeloCamisa"
        );


    const tamanhoCamisa =
        document.getElementById(
            "tamanhoCamisa"
        );


    if(
        !modelo ||
        !tamanhoCamisa
    ){

        alert(
            "Selecione a categoria novamente."
        );

        return;

    }


    const item = {

        id:
            pedido.length + 1,

        nome:
            nome.toUpperCase(),

        uniforme:
            uniformeSelecionado,

        funcao:
            funcaoSelecionada,

        categoria:
            categoriaSelecionada,

        numero:
            numeroSelecionado,

        modelo:
            modelo.value,

        tamanhoCamisa:
            tamanhoCamisa.value,

        inferior:
            "Nenhum",

        tamanhoInferior:
            "N/A",

        valor:
            calcularValor()

    };


    const usa =
        document.getElementById(
            "usaInferior"
        );


    if(
        usa &&
        usa.value ===
        "sim"
    ){

        const tipoInferior =
            document.getElementById(
                "tipoInferior"
            );


        const tamanhoInferior =
            document.getElementById(
                "tamanhoInferior"
            );


        if(
            tipoInferior &&
            tamanhoInferior
        ){

            item.inferior =
                tipoInferior
                    .options[
                        tipoInferior
                            .selectedIndex
                    ]
                    .text;


            item.tamanhoInferior =
                tamanhoInferior.value;

        }

    }


    pedido.push(
        item
    );


    mostrarPedido();


    limparItem();

}


// ======================================================
// MOSTRAR PEDIDO
// ======================================================

function mostrarPedido(){

    const lista =
        document.getElementById(
            "listaItens"
        );


    if(!lista){

        return;

    }


    lista.innerHTML =
        "";


    let total =
        0;


    pedido.forEach(
        function(item,index){

            total +=
                item.valor;


            lista.innerHTML += `

            <div class="card">

                <strong>
                    Jogador ${index + 1}
                </strong>

                <p>
                    Nome: ${item.nome}
                </p>

                <p>
                    Número: ${item.numero}
                </p>

                <p>
                    Uniforme: ${item.uniforme}
                </p>

                <p>
                    Função: ${item.funcao}
                </p>

                <p>
                    Categoria: ${item.categoria}
                </p>

                <p>
                    Camisa: ${item.modelo}
                </p>

                <p>
                    Tamanho:
                    ${item.tamanhoCamisa}
                </p>

                <p>
                    Peça inferior:
                    ${item.inferior}
                </p>

                <p>
                    Tamanho inferior:
                    ${item.tamanhoInferior}
                </p>

                <p>
                    Valor:
                    R$ ${Number(
                        item.valor || 0
                    ).toFixed(2)}
                </p>

            </div>

            `;

        }
    );


    mostrarResumo(
        total
    );

}


// ======================================================
// MOSTRAR RESUMO
// ======================================================

function mostrarResumo(
    total
){

    const resumo =
        document.getElementById(
            "resumo"
        );


    if(!resumo){

        return;

    }


    const parcela =
        total / 3;


    resumo.innerHTML = `

        <strong>
            VÔLEI TERAPIA
        </strong>

        <br><br>

        Quantidade de uniformes:
        ${pedido.length}

        <br><br>

        Valor total:

        <strong>
            R$ ${total.toFixed(2)}
        </strong>

        <br><br>

        Pagamento:

        <br>

        3 parcelas de:

        <strong>
            R$ ${parcela.toFixed(2)}
        </strong>

    `;

}


// ======================================================
// LIMPAR ITEM
// ======================================================

function limparItem(){

    const campoNome =
        document.getElementById(
            "nomePersonalizado"
        );


    if(campoNome){

        campoNome.value =
            "";

    }


    numeroSelecionado =
        "";


    document
        .querySelectorAll(
            "#mapaNumero button"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "ativo"
                );

            }
        );

}


// ======================================================
// GERAR CÓDIGO DO PEDIDO
// ======================================================

function gerarCodigoPedido(){

    let numero =
        localStorage.getItem(
            "codigoVT"
        ) || 0;


    numero++;


    localStorage.setItem(
        "codigoVT",
        numero
    );


    return "VT" + numero;

}


// ======================================================
// FINALIZAR PEDIDO
// ======================================================

async function finalizarPedido(){

    // ==================================================
    // IMPEDIR DUPLO CLIQUE / DUPLO ENVIO
    // ==================================================

    if(enviandoPedido){

        return;

    }


    if(
        pedido.length === 0
    ){

        alert(
            "Adicione pelo menos um uniforme."
        );

        return;

    }


    // ==================================================
    // BLOQUEAR ENVIO IMEDIATAMENTE
    // ==================================================

    enviandoPedido =
        true;


    const botaoFinalizar =
        document.getElementById(
            "btnFinalizar"
        );


    if(botaoFinalizar){

        botaoFinalizar.disabled =
            true;

        botaoFinalizar.textContent =
            "ENVIANDO PEDIDO...";

    }


    const codigo =
        gerarCodigoPedido();


    const dataAtual =
        new Date()
            .toLocaleDateString(
                "pt-BR"
            );


    const valorTotalGeral =
        pedido.reduce(
            (acc,item) =>
                acc + Number(
                    item.valor || 0
                ),
            0
        );


    const campoResponsavel =
        document.getElementById(
            "responsavel"
        );


    let nomeResponsavel =
        campoResponsavel
            ? campoResponsavel.value.trim()
            : "Não informado";


    if(
        nomeResponsavel === ""
    ){

        nomeResponsavel =
            "Não informado";

    }


    const dadosEnvio = {

        idPedido:
            codigo,

        data:
            dataAtual,

        responsavel:
            nomeResponsavel,

        quantidade:
            pedido.length,

        valorTotal:
            valorTotalGeral,

        parcelas:
            "3x de R$ " +
            (
                valorTotalGeral / 3
            ).toFixed(2),

        pago:
            "Não",

        itens:
            pedido

    };


    const dadosLocal = {

        codigo:
            codigo,

        responsavel:
            nomeResponsavel,

        data:
            dataAtual,

        itens:
            pedido

    };


    localStorage.setItem(
        codigo,
        JSON.stringify(
            dadosLocal
        )
    );


    try{

        await fetch(

            URL_APPS_SCRIPT,

            {

                method:
                    "POST",

                mode:
                    "no-cors",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        dadosEnvio
                    )

            }

        );


        alert(
            "Pedido " +
            codigo +
            " enviado com sucesso!"
        );


        // ==================================================
        // RESETAR PEDIDO
        // ==================================================

        pedido = [];

        categoriaSelecionada =
            "";

        uniformeSelecionado =
            "";

        funcaoSelecionada =
            "";

        numeroSelecionado =
            "";


        const lista =
            document.getElementById(
                "listaItens"
            );


        if(lista){

            lista.innerHTML =
                "Nenhum item adicionado.";

        }


        const resumo =
            document.getElementById(
                "resumo"
            );


        if(resumo){

            resumo.innerHTML =
                "Nenhum pedido.";

        }


        const configuracao =
            document.getElementById(
                "configuracao"
            );


        if(configuracao){

            configuracao.style.display =
                "none";

        }


        if(campoResponsavel){

            campoResponsavel.value =
                "";

        }


        document
            .querySelectorAll(
                ".opcao"
            )
            .forEach(
                btn => {

                    btn.classList.remove(
                        "ativo"
                    );

                }
            );


        numeroSelecionado =
            "";


    }catch(error){

        console.error(
            "Erro ao enviar pedido:",
            error
        );


        // ==================================================
        // LIBERAR NOVAMENTE EM CASO DE ERRO
        // ==================================================

        enviandoPedido =
            false;


        if(botaoFinalizar){

            botaoFinalizar.disabled =
                false;

            botaoFinalizar.textContent =
                "FINALIZAR PEDIDO";

        }


        alert(
            "Não foi possível enviar o pedido. " +
            "O pedido foi salvo localmente."
        );

    }

}


// ======================================================
// CARREGAR VALORES AO ABRIR A PÁGINA
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function(){

        console.log(
            "Carregando configurações da planilha..."
        );


        await buscarConfiguracoes();


        console.log(
            "Valores carregados:",
            valores
        );

    }
);
