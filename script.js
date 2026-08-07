let pedido = [];

let categoriaSelecionada = "";
let uniformeSelecionado = "";
let funcaoSelecionada = "";
let numeroSelecionado = "";

let numerosBloqueados = [];


// URL CORRETA DO GOOGLE APPS SCRIPT / WEB APP
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";


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

            numerosBloqueados =
            dados.numerosOficiais || [];

        }


    }catch(error){

        console.error(
            "Erro ao buscar números oficiais:",
            error
        );

        numerosBloqueados = [];

    }

}



// ======================================================
// ABRIR CONFIGURAÇÃO
// ======================================================

async function abrirItem() {

    document.getElementById("configuracao").style.display = "block";


    await buscarNumerosOficiais();


    gerarMapaNumeros();

}
// ======================================================
// SELECIONAR OFICIAL / ADICIONAL
// ======================================================

function selecionarUniforme(tipo, botao) {

    uniformeSelecionado = tipo;


    document
        .querySelectorAll(".grupoUniforme .opcao")
        .forEach(btn => {

            btn.classList.remove("ativo");

        });


    botao.classList.add("ativo");


    // Atualiza o bloqueio conforme a escolha

    gerarMapaNumeros();

}



// ======================================================
// SELECIONAR NORMAL / LÍBERO
// ======================================================

function selecionarFuncao(funcao, botao) {

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

function selecionarCategoria(categoria, botao) {

    categoriaSelecionada = categoria;


    document
        .querySelectorAll(".grupoCategoria .opcao")
        .forEach(btn => {

            btn.classList.remove("ativo");

        });


    botao.classList.add("ativo");


    mostrarOpcoesUniforme();

}



// ======================================================
// MOSTRAR PRODUTOS
// ======================================================

function mostrarOpcoesUniforme() {

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



    if (categoriaSelecionada === "Masculino") {


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



    if (categoriaSelecionada === "Feminino") {


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
// MAPA DE NÚMEROS COM BLOQUEIO OFICIAL
// ======================================================

function gerarMapaNumeros() {

    let mapa = document.getElementById("mapaNumero");


    if (!mapa) return;


    mapa.innerHTML = "";



    for (let i = 0; i <= 99; i++) {


        let numero = i.toString().padStart(2, "0");


        let botao = document.createElement("button");


        botao.type = "button";


        botao.innerText = numero;



        let bloqueado = false;



        // Só bloqueia se for uniforme Oficial

        if (uniformeSelecionado === "Oficial") {


            bloqueado =
            numerosBloqueados.includes(numero);


        }



        if (bloqueado) {


            botao.disabled = true;


            botao.classList.add("bloqueado");


        }



        botao.onclick = function () {


            if (botao.disabled) {

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
