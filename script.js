let pedido = [];

let categoriaSelecionada = "";
let uniformeSelecionado = "";
let funcaoSelecionada = "";
let numeroSelecionado = "";

let numerosBloqueadosMasculino = [];
let numerosBloqueadosFeminino = [];


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
    calcaoMasc: 35,
    calcaoFem: 35,
    shortDoll: 30,
    shortSuplex: 35

};


// ======================================================
// BUSCAR NÚMEROS OFICIAIS NA PLANILHA
// ======================================================

async function buscarNumerosOficiais(){

    try{

        let resposta = await fetch(URL_APPS_SCRIPT);

        let dados = await resposta.json();


        if(dados.result === "success"){

            numerosBloqueadosMasculino =
                dados.masculino || [];

            numerosBloqueadosFeminino =
                dados.feminino || [];

        }else{

            numerosBloqueadosMasculino = [];
            numerosBloqueadosFeminino = [];

        }


    }catch(error){

        console.error(
            "Erro ao buscar números oficiais:",
            error
        );

        numerosBloqueadosMasculino = [];
        numerosBloqueadosFeminino = [];

    }

}


// ======================================================
// ABRIR CONFIGURAÇÃO
// ======================================================

async function abrirItem(){

    document.getElementById("configuracao").style.display = "block";


    await buscarNumerosOficiais();


    gerarMapaNumeros();

}


// ======================================================
// SELECIONAR OFICIAL / ADICIONAL
// ======================================================

function selecionarUniforme(tipo, botao){

    uniformeSelecionado = tipo;


    document
        .querySelectorAll(".grupoUniforme .opcao")
        .forEach(btn => {

            btn.classList.remove("ativo");

        });


    botao.classList.add("ativo");


    gerarMapaNumeros();

}


// ======================================================
// SELECIONAR NORMAL / LÍBERO
// ======================================================

function selecionarFuncao(funcao, botao){

    funcaoSelecionada = funcao;


    document
        .querySelectorAll(".grupoFuncao .opcao")
        .forEach(btn => {

            btn.classList.remove("ativo");

        });


    botao.classList.add("ativo");

}


// ======================================================
// SELECIONAR CATEGORIA
// ======================================================

function selecionarCategoria(categoria, botao){

    categoriaSelecionada = categoria;


    document
        .querySelectorAll(".grupoCategoria .opcao")
        .forEach(btn => {

            btn.classList.remove("ativo");

        });


    botao.classList.add("ativo");


    mostrarOpcoesUniforme();


    gerarMapaNumeros();

}


// ======================================================
// MOSTRAR PRODUTOS
// ======================================================

function mostrarOpcoesUniforme(){

    let area = document.getElementById("produtos");


    let tamanho = `

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


    if(categoriaSelecionada === "Masculino"){

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


    if(categoriaSelecionada === "Feminino"){

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


    area.innerHTML = html;

}


// ======================================================
// MOSTRAR PEÇA INFERIOR
// ======================================================

function mostrarInferior(){

    let area = document.getElementById("inferior");

    let usa = document.getElementById("usaInferior").value;


    if(usa === "nao"){

        area.innerHTML = "";

        return;

    }


    let html = "";


    if(categoriaSelecionada === "Masculino"){

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


    if(categoriaSelecionada === "Feminino"){

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


    area.innerHTML = html;

}


// ======================================================
// MAPA DE NÚMEROS COM BLOQUEIO POR CATEGORIA
// ======================================================

function gerarMapaNumeros(){

    let mapa = document.getElementById("mapaNumero");


    if(!mapa) return;


    mapa.innerHTML = "";


    for(let i = 0; i <= 99; i++){

        let numero = i.toString().padStart(2,"0");


        let botao = document.createElement("button");


        botao.type = "button";


        botao.innerText = numero;


        let bloqueado = false;


        if(uniformeSelecionado === "Oficial"){

            if(categoriaSelecionada === "Masculino"){

                bloqueado =
                    numerosBloqueadosMasculino.includes(numero);

            }


            if(categoriaSelecionada === "Feminino"){

                bloqueado =
                    numerosBloqueadosFeminino.includes(numero);

            }

        }


        if(bloqueado){

            botao.disabled = true;

            botao.classList.add("bloqueado");

            botao.style.opacity = "0.35";

        }


        botao.onclick = function(){

            if(botao.disabled){

                return;

            }


            document
                .querySelectorAll("#mapaNumero button")
                .forEach(btn => {

                    btn.classList.remove("ativo");

                });


            botao.classList.add("ativo");


            numeroSelecionado = numero;

        };


        mapa.appendChild(botao);

    }

}


// ======================================================
// CALCULAR VALOR
// ======================================================

function calcularValor(){

    let total = valores.camisa;


    let usa =
        document.getElementById("usaInferior");


    if(usa && usa.value === "sim"){

        let tipo =
            document.getElementById("tipoInferior").value;


        if(tipo === "calcaoMasc"){
            total += valores.calcaoMasc;
        }


        if(tipo === "calcaoFem"){
            total += valores.calcaoFem;
        }


        if(tipo === "shortDoll"){
            total += valores.shortDoll;
        }


        if(tipo === "shortSuplex"){
            total += valores.shortSuplex;
        }

    }


    return total;

}


// ======================================================
// ADICIONAR ITEM AO PEDIDO
// ======================================================

function adicionarItemPedido(){

    try{

        let campoNome =
            document.getElementById("nomePersonalizado");


        let nome =
            campoNome
                ? campoNome.value.trim()
                : "";


        if(uniformeSelecionado === ""){

            alert("Selecione Oficial ou Adicional.");

            return;

        }


        if(funcaoSelecionada === ""){

            alert("Selecione Normal ou Líbero.");

            return;

        }


        if(categoriaSelecionada === ""){

            alert("Selecione Masculino ou Feminino.");

            return;

        }


        if(numeroSelecionado === ""){

            alert("Selecione o número.");

            return;

        }


        if(nome === ""){

            alert("Digite o nome.");

            return;

        }


        let modeloCamisa =
            document.getElementById("modeloCamisa");


        let tamanhoCamisa =
            document.getElementById("tamanhoCamisa");


        if(!modeloCamisa){

            alert("Selecione a categoria novamente.");

            return;

        }


        if(!tamanhoCamisa){

            alert("Selecione o tamanho da camisa.");

            return;

        }


        let item = {

            id: pedido.length + 1,

            nome: nome.toUpperCase(),

            uniforme: uniformeSelecionado,

            funcao: funcaoSelecionada,

            categoria: categoriaSelecionada,

            numero: numeroSelecionado,

            modelo: modeloCamisa.value,

            tamanhoCamisa: tamanhoCamisa.value,

            inferior: "Nenhum",

            tamanhoInferior: "N/A",

            valor: calcularValor()

        };


        let usaInferior =
            document.getElementById("usaInferior");


        if(
            usaInferior &&
            usaInferior.value === "sim"
        ){

            let tipoInferior =
                document.getElementById("tipoInferior");


            let tamanhoInferior =
                document.getElementById("tamanhoInferior");


            if(tipoInferior && tamanhoInferior){

                item.inferior =
                    tipoInferior.options[
                        tipoInferior.selectedIndex
                    ].text;


                item.tamanhoInferior =
                    tamanhoInferior.value;

            }

        }


        pedido.push(item);


        mostrarPedido();


        limparItem();


    }catch(error){

        alert(
            "Erro ao adicionar o uniforme: " +
            error.message
        );

    }

}


// ======================================================
// MOSTRAR PEDIDO
// ======================================================

function mostrarPedido(){

    let lista =
        document.getElementById("listaItens");


    if(!lista) return;


    lista.innerHTML = "";


    let total = 0;


    pedido.forEach((item,index)=>{

        total += item.valor;


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
                Tamanho: ${item.tamanhoCamisa}
            </p>

            <p>
                Peça inferior: ${item.inferior}
            </p>

            <p>
                Tamanho inferior: ${item.tamanhoInferior}
            </p>

            <p>
                Valor:
                R$ ${item.valor.toFixed(2)}
            </p>

        </div>

        `;

    });


    mostrarResumo(total);

}


// ======================================================
// MOSTRAR RESUMO
// ======================================================

function mostrarResumo(total){

    let resumo =
        document.getElementById("resumo");


    if(!resumo) return;


    let parcela =
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
// LIMPAR CAMPOS DO ITEM
// ======================================================

function limparItem(){

    let campoNome =
        document.getElementById("nomePersonalizado");


    if(campoNome){

        campoNome.value = "";

    }


    numeroSelecionado = "";


    document
        .querySelectorAll("#mapaNumero button")
        .forEach(btn => {

            btn.classList.remove("ativo");

        });

}


// ======================================================
// GERAR CÓDIGO DO PEDIDO
// ======================================================

function gerarCodigoPedido(){

    let numero =
        localStorage.getItem("codigoVT") || 0;


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

    if(pedido.length === 0){

        alert("Adicione pelo menos um uniforme.");

        return;

    }


    let codigo =
        gerarCodigoPedido();


    let dataAtual =
        new Date().toLocaleDateString("pt-BR");


    let valorTotalGeral =
        pedido.reduce(
            (acc,item) => acc + item.valor,
            0
        );


    let campoResponsavel =
        document.getElementById("responsavel");


    let nomeResponsavel =
        campoResponsavel ?
        campoResponsavel.value.trim() :
        "Não informado";


    if(nomeResponsavel === ""){

        nomeResponsavel = "Não informado";

    }


    let dadosEnvio = {

        idPedido: codigo,

        data: dataAtual,

        responsavel: nomeResponsavel,

        quantidade: pedido.length,

        valorTotal: valorTotalGeral,

        parcelas:
            "3x de R$ " +
            (valorTotalGeral / 3).toFixed(2),

        pago: "Não",

        itens: pedido

    };


    let dadosLocal = {

        codigo: codigo,

        responsavel: nomeResponsavel,

        data: dataAtual,

        itens: pedido

    };


    localStorage.setItem(
        codigo,
        JSON.stringify(dadosLocal)
    );


    try{

        await fetch(

            URL_APPS_SCRIPT,

            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(dadosEnvio)

            }

        );


        alert(
            "Pedido " +
            codigo +
            " enviado com sucesso!"
        );


        pedido = [];

        categoriaSelecionada = "";

        uniformeSelecionado = "";

        funcaoSelecionada = "";

        numeroSelecionado = "";


        let lista =
            document.getElementById("listaItens");


        if(lista){

            lista.innerHTML = "";

        }


        let resumo =
            document.getElementById("resumo");


        if(resumo){

            resumo.innerHTML = "";

        }


        let configuracao =
            document.getElementById("configuracao");


        if(configuracao){

            configuracao.style.display = "none";

        }


        let campoResponsavel =
            document.getElementById("responsavel");


        if(campoResponsavel){

            campoResponsavel.value = "";

        }


        document
            .querySelectorAll(".opcao")
            .forEach(btn => {

                btn.classList.remove("ativo");

            });

    }catch(error){

        console.error(error);


        alert(
            "Não foi possível enviar o pedido. " +
            "O pedido foi salvo localmente."
        );

    }

}
