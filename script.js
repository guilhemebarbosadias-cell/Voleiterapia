let pedido = [];

let categoriaSelecionada = "";
let uniformeSelecionado = "";
let funcaoSelecionada = "";
let numeroSelecionado = "";


const URL_APPS_SCRIPT = "https://script.google.com/macros/library/d/1uSf2z3nxidqRk9EccX32maaNp8UYkENU3o62_B89fT0_ubnfsYX1_UtI/6";


const valores = {

    camisa: 75,
    calcaoMasc: 35,
    calcaoFem: 35,
    shortDoll: 30,
    shortSuplex: 35

};





function abrirItem(){

    document.getElementById("configuracao").style.display = "block";

    gerarMapaNumeros();

}






function selecionarUniforme(tipo, botao){

    uniformeSelecionado = tipo;


    document.querySelectorAll(".grupoUniforme .opcao")
    .forEach(btn=>{

        btn.classList.remove("ativo");

    });


    botao.classList.add("ativo");

}






function selecionarFuncao(funcao, botao){

    funcaoSelecionada = funcao;


    document.querySelectorAll(".grupoFuncao .opcao")
    .forEach(btn=>{

        btn.classList.remove("ativo");

    });


    botao.classList.add("ativo");

}






function selecionarCategoria(categoria, botao){

    categoriaSelecionada = categoria;


    document.querySelectorAll(".grupoCategoria .opcao")
    .forEach(btn=>{

        btn.classList.remove("ativo");

    });


    botao.classList.add("ativo");


    mostrarOpcoesUniforme();

}







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
        Camisa masculina
        </option>

        </select>


        ${tamanho}


        <label>
        Adicionar calção?
        </label>


        <select id="usaInferior" onchange="mostrarInferior()">

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
        Camisa tradicional feminina
        </option>


        </select>


        ${tamanho}



        <label>
        Adicionar peça inferior?
        </label>


        <select id="usaInferior" onchange="mostrarInferior()">


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






function gerarMapaNumeros(){


    let mapa = document.getElementById("mapaNumero");


    if(!mapa) return;



    mapa.innerHTML = "";



    for(let i = 0; i <= 99; i++){


        let numero = i.toString().padStart(2,"0");



        let botao = document.createElement("button");


        botao.type = "button";


        botao.innerText = numero;



        botao.onclick = function(){


            document.querySelectorAll("#mapaNumero button")
            .forEach(btn=>{

                btn.classList.remove("ativo");

            });



            botao.classList.add("ativo");



            numeroSelecionado = numero;


        };



        mapa.appendChild(botao);


    }


}






function calcularValor(){


    let total = valores.camisa;


    let usa = document.getElementById("usaInferior");



    if(usa && usa.value === "sim"){


        let tipo = document.getElementById("tipoInferior").value;



        if(tipo === "calcaoMasc")
        total += valores.calcaoMasc;


        if(tipo === "calcaoFem")
        total += valores.calcaoFem;


        if(tipo === "shortDoll")
        total += valores.shortDoll;


        if(tipo === "shortSuplex")
        total += valores.shortSuplex;


    }



    return total;


}






function adicionarItemPedido(){


    let nome = document
    .getElementById("nomePersonalizado")
    .value
    .trim();



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



    let item = {


        id: pedido.length + 1,


        nome: nome.toUpperCase(),


        uniforme: uniformeSelecionado,


        funcao: funcaoSelecionada,


        categoria: categoriaSelecionada,


        numero: numeroSelecionado,


        modelo: document.getElementById("modeloCamisa").value,


        tamanhoCamisa: document.getElementById("tamanhoCamisa").value,


        inferior:"Nenhum",


        tamanhoInferior:"N/A",


        valor: calcularValor()


    };



    let usa = document.getElementById("usaInferior");



    if(usa && usa.value === "sim"){


        item.inferior =
        document.getElementById("tipoInferior")
        .options[
        document.getElementById("tipoInferior").selectedIndex
        ]
        .text;


        item.tamanhoInferior =
        document.getElementById("tamanhoInferior").value;


    }



    pedido.push(item);



    mostrarPedido();



    limparItem();


}
function mostrarPedido(){

    let lista = document.getElementById("listaItens");

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
        Camisa:
        ${item.modelo}
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
        Valor:
        R$ ${item.valor.toFixed(2)}
        </p>



        </div>

        `;


    });



    mostrarResumo(total);


}






function mostrarResumo(total){


    let resumo = document.getElementById("resumo");


    let parcela = total / 3;



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






function limparItem(){


    document.getElementById("nomePersonalizado").value = "";


    numeroSelecionado = "";



    document.querySelectorAll("#mapaNumero button")
    .forEach(btn=>{

        btn.classList.remove("ativo");

    });


}







function gerarCodigoPedido(){


    let numero = localStorage.getItem("codigoVT") || 0;


    numero++;


    localStorage.setItem(
        "codigoVT",
        numero
    );


    return "VT" + numero;


}







function finalizarPedido(){


    if(pedido.length === 0){

        alert("Adicione pelo menos um uniforme.");

        return;

    }



    let codigo = gerarCodigoPedido();


    let dataAtual =
    new Date().toLocaleDateString("pt-BR");



    let valorTotalGeral =
    pedido.reduce(
        (acc,item)=>acc + item.valor,
        0
    );



    let campoResponsavel =
    document.getElementById("responsavel");



    let nomeResponsavel =
    campoResponsavel ?
    campoResponsavel.value.trim()
    :
    "Não informado";





    let dadosEnvio = {


        idPedido: codigo,


        data: dataAtual,


        responsavel: nomeResponsavel,


        quantidade: pedido.length,


        valorTotal: valorTotalGeral,


        parcelas:
        "3x de R$ " +
        (valorTotalGeral / 3).toFixed(2),


        pago:"Não",


        itens: pedido


    };





    let dadosLocal = {


        codigo: codigo,


        responsavel: nomeResponsavel,


        data:dataAtual,


        itens:pedido


    };





    localStorage.setItem(
        codigo,
        JSON.stringify(dadosLocal)
    );






    fetch(URL_APPS_SCRIPT,{


        method:"POST",


        mode:"no-cors",


        headers:{


            "Content-Type":"application/json"


        },


        body:JSON.stringify(dadosEnvio)


    })



    .then(()=>{


        alert(
        "Pedido " +
        codigo +
        " enviado com sucesso!"
        );


    })



    .catch(error=>{


        console.error(error);


        alert(
        "Pedido salvo localmente."
        );


    });



}
