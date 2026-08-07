let pedido=[];
let categoriaSelecionada="";
let uniformeSelecionado="";
let corUniformeSelecionada="";
let numeroSelecionado="";

const URL_APPS_SCRIPT="https://script.google.com/macros/s/AKfycbwoTbeb_jXc1UcgYPFvjVIQmmZ3_yi4sK7Nd2Obyj4S6eXsnRCZeyNKZ02s9S9V66Px/exec";

const valores={
camisa:75,
calcaoMasc:35,
calcaoFem:35,
shortDoll:30,
shortSuplex:35
};

function abrirItem(){
document.getElementById("configuracao").style.display="block";
gerarMapaNumeros();
}

function selecionarUniforme(tipo,botao){
uniformeSelecionado=tipo;
document.querySelectorAll(".opcao").forEach(btn=>btn.classList.remove("ativo"));
botao.classList.add("ativo");
}

function selecionarCor(cor,botao){
corUniformeSelecionada=cor;
document.querySelectorAll(".opcao").forEach(btn=>btn.classList.remove("ativo"));
botao.classList.add("ativo");
}

function selecionarCategoria(categoria,botao){
categoriaSelecionada=categoria;
document.querySelectorAll(".opcao").forEach(btn=>btn.classList.remove("ativo"));
botao.classList.add("ativo");
mostrarOpcoesUniforme();
}

function mostrarOpcoesUniforme(){
let area=document.getElementById("produtos");
let tamanho=`
<label>Tamanho da camisa</label>
<select id="tamanhoCamisa">
<option>PP</option>
<option>P</option>
<option>M</option>
<option>G</option>
<option>GG</option>
<option>XGG</option>
</select>`;

let html="";

if(categoriaSelecionada==="Masculino"){
html=`
<div class="card">
<label>Modelo da camisa</label>
<select id="modeloCamisa">
<option>Camisa masculina</option>
</select>
${tamanho}
<label>Adicionar calção?</label>
<select id="usaInferior" onchange="mostrarInferior()">
<option value="nao">Não</option>
<option value="sim">Sim</option>
</select>
<div id="inferior"></div>
</div>`;
}

if(categoriaSelecionada==="Feminino"){
html=`
<div class="card">
<label>Modelo da camisa</label>
<select id="modeloCamisa">
<option>Baby Look</option>
<option>Camisa tradicional feminina</option>
</select>
${tamanho}
<label>Adicionar peça inferior?</label>
<select id="usaInferior" onchange="mostrarInferior()">
<option value="nao">Não</option>
<option value="sim">Sim</option>
</select>
<div id="inferior"></div>
</div>`;
}

area.innerHTML=html;
}

function mostrarInferior(){
let area=document.getElementById("inferior");
let usa=document.getElementById("usaInferior").value;

if(usa==="nao"){
area.innerHTML="";
return;
}

let html="";

if(categoriaSelecionada==="Masculino"){
html=`
<label>Tipo de calção</label>
<select id="tipoInferior">
<option value="calcaoMasc">Calção masculino</option>
</select>
<label>Tamanho do calção</label>
<select id="tamanhoInferior">
<option>PP</option>
<option>P</option>
<option>M</option>
<option>G</option>
<option>GG</option>
</select>`;
}

if(categoriaSelecionada==="Feminino"){
html=`
<label>Tipo de peça</label>
<select id="tipoInferior">
<option value="calcaoFem">Calção feminino</option>
<option value="shortDoll">Short Doll</option>
<option value="shortSuplex">Short Suplex</option>
</select>
<label>Tamanho</label>
<select id="tamanhoInferior">
<option>PP</option>
<option>P</option>
<option>M</option>
<option>G</option>
<option>GG</option>
</select>`;
}

area.innerHTML=html;
  function gerarMapaNumeros(){

let mapa=document.getElementById("mapaNumero");
mapa.innerHTML="";

for(let i=0;i<=99;i++){

let numero=i.toString().padStart(2,"0");

let botao=document.createElement("button");

botao.type="button";
botao.innerText=numero;

botao.onclick=function(){

if(botao.classList.contains("bloqueado")){
return;
}

document.querySelectorAll("#mapaNumero button")
.forEach(btn=>btn.classList.remove("ativo"));

botao.classList.add("ativo");

numeroSelecionado=numero;

};

mapa.appendChild(botao);

}

}



function calcularValor(){

let total=valores.camisa;

let usa=document.getElementById("usaInferior");

if(usa && usa.value==="sim"){

let tipo=document.getElementById("tipoInferior").value;

if(tipo==="calcaoMasc")total+=valores.calcaoMasc;
if(tipo==="calcaoFem")total+=valores.calcaoFem;
if(tipo==="shortDoll")total+=valores.shortDoll;
if(tipo==="shortSuplex")total+=valores.shortSuplex;

}

return total;

}



function adicionarItemPedido(){

let nome=document.getElementById("nomePersonalizado").value.trim();

if(uniformeSelecionado===""){
alert("Selecione o tipo de uniforme.");
return;
}

if(corUniformeSelecionada===""){
alert("Selecione a cor do uniforme.");
return;
}

if(categoriaSelecionada===""){
alert("Selecione masculino ou feminino.");
return;
}

if(numeroSelecionado===""){
alert("Selecione o número.");
return;
}

if(nome===""){
alert("Digite o nome para personalização.");
return;
}



let item={

id:pedido.length+1,

nome:nome.toUpperCase(),

uniforme:uniformeSelecionado,

corUniforme:corUniformeSelecionada,

categoria:categoriaSelecionada,

numero:numeroSelecionado,

modelo
}
  function limparItem(){

document.getElementById("nomePersonalizado").value="";

numeroSelecionado="";

document.querySelectorAll("#mapaNumero button")
.forEach(btn=>{
btn.classList.remove("ativo");
});

}


function gerarCodigoPedido(){

let numero=localStorage.getItem("codigoVT") || 0;

numero++;

localStorage.setItem("codigoVT",numero);

return "VT"+numero;

}



function finalizarPedido(){

if(pedido.length===0){

alert("Adicione pelo menos um jogador.");

return;

}


let codigo=gerarCodigoPedido();

let dataAtual=new Date().toLocaleDateString("pt-BR");

let valorTotalGeral=pedido.reduce(
(acc,curr)=>acc+curr.valor,
0
);



let campoResponsavel=document.getElementById("responsavel");

let nomeResponsavelFinal=
campoResponsavel ?
campoResponsavel.value.trim()
:
"Não informado";



let itensFormatados=pedido.map(item=>({

nome:item.nome,

numero:item.numero,

uniforme:item.uniforme,

corUniforme:item.corUniforme,

categoria:item.categoria,

modeloCamisa:item.modelo,

tamanho:item.tamanhoCamisa,

pecaInferior:item.inferior,

tamanhoInferior:item.tamanhoInferior || "N/A",

valor:item.valor,

produto:"Camisa / "+item.inferior

}));



let dadosEnvio={

idPedido:codigo,

data:dataAtual,

responsavel:nomeResponsavelFinal,

quantidade:pedido.length,

valorTotal:valorTotalGeral,

parcelas:
"3x de R$ "+
(valorTotalGeral/3).toFixed(2),

pago:"Não",

itens:itensFormatados

};



let dadosLocal={

codigo:codigo,

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
"Pedido "+
codigo+
" finalizado e enviado com sucesso!"
);

})

.catch(error=>{

console.error(
"Erro ao enviar:",
error
);

alert(
"Pedido salvo localmente."
);

});

}

  alert("JS funcionando");
