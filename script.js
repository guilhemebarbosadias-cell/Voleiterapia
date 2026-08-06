// VÔLEI TERAPIA
// SISTEMA DE PEDIDOS DE UNIFORME
// SCRIPT V2 - PARTE 1/2

let pedidoAtual={
codigo:"",
responsavel:"",
data:"",
itens:[]
};

let itemAtual={};
let categoriaSelecionada="";

function gerarCodigoPedido(){
let numero=localStorage.getItem("numeroVT")||0;
numero++;
localStorage.setItem("numeroVT",numero);
return "VT"+numero;
}

function iniciarPedido(){
pedidoAtual={
codigo:gerarCodigoPedido(),
responsavel:"",
data:new Date().toLocaleDateString("pt-BR"),
itens:[]
};
return pedidoAtual.codigo;
}

function abrirItem(){
document.getElementById("configuracao").style.display="block";

if(!pedidoAtual.codigo){
iniciarPedido();
}

gerarNumeros();
}

function selecionarCategoria(categoria,botao){
categoriaSelecionada=categoria;

document.querySelectorAll(".dashboard .btn").forEach(btn=>{
btn.classList.remove("selecionado");
});

if(botao){
botao.classList.add("selecionado");
}

atualizarInformacoes();
}

function atualizarInformacoes(){
let produtos=document.getElementById("produtos");

let tipo=document.getElementById("tipo").value;
let uniforme=document.getElementById("tipoUniforme").value;
let publico=document.getElementById("publico").value;

produtos.innerHTML=`
<p><strong>Categoria:</strong> ${categoriaSelecionada||"Não selecionada"}</p>
<p><strong>Peça:</strong> ${tipo}</p>
<p><strong>Modelo:</strong> ${uniforme}</p>
<p><strong>Público:</strong> ${publico}</p>
`;
}

function gerarNumeros(){
let mapa=document.getElementById("mapaNumero");

mapa.innerHTML="";

for(let i=0;i<=99;i++){
let botao=document.createElement("button");

botao.type="button";
botao.className="btn";
botao.innerText=i;

botao.onclick=function(){
selecionarNumero(i);
};

mapa.appendChild(botao);
}
}

function selecionarNumero(numero){
itemAtual.numero=numero;

document.querySelectorAll("#mapaNumero .btn").forEach(btn=>{
btn.classList.remove("selecionado");

if(Number(btn.innerText)===numero){
btn.classList.add("selecionado");
}
});
}

function criarItem(){

let nome=document.getElementById("nomePersonalizado").value.trim();

let tamanho=document.getElementById("tamanhoCamisa")?.value||"";

let tamanhoShort=document.getElementById("tamanhoShort")?.value||"";

let short=document.getElementById("usaShort")?.checked||false;

let item={
id:pedidoAtual.codigo+"-"+String(pedidoAtual.itens.length+1).padStart(2,"0"),
nome:nome.toUpperCase()||"SEM NOME",
numero:itemAtual.numero,
categoria:categoriaSelecionada,
tipo:document.getElementById("tipo").value,
modelo:document.getElementById("tipoUniforme").value,
publico:document.getElementById("publico").value,
tamanhoCamisa:tamanho,
short:short,
tamanhoShort:tamanhoShort
};

return item;
}// VÔLEI TERAPIA
// SISTEMA DE PEDIDOS DE UNIFORME
// SCRIPT V2 - PARTE 2/2

function adicionarItemPedido(){
let responsavel=document.getElementById("responsavel").value.trim();

if(!responsavel){
alert("Informe o responsável pelo pedido.");
document.getElementById("responsavel").focus();
return;
}

if(!categoriaSelecionada){
alert("Selecione a categoria.");
return;
}

if(itemAtual.numero===undefined){
alert("Selecione o número.");
return;
}

let item=criarItem();

pedidoAtual.responsavel=responsavel;

pedidoAtual.itens.push(item);

mostrarPedido();

limparItem();
}

function mostrarPedido(){
let lista=document.getElementById("listaItens");

if(pedidoAtual.itens.length===0){
lista.innerHTML="Nenhum item adicionado.";
return;
}

lista.innerHTML="";

pedidoAtual.itens.forEach(item=>{

lista.innerHTML+=`
<div class="item">
<strong>${item.id}</strong><br>
Nome: ${item.nome}<br>
Número: ${item.numero}<br>
Categoria: ${item.categoria}<br>
Modelo: ${item.modelo}<br>
Tamanho camisa: ${item.tamanhoCamisa||"Não informado"}<br>
Short: ${item.short?"Sim":"Não"}
${item.short?`<br>Tamanho short: ${item.tamanhoShort||"Não informado"}`:""}
</div>
`;

});

mostrarResumo();
}

function mostrarResumo(){
let resumo=document.getElementById("resumo");

resumo.innerHTML=`
Pedido: ${pedidoAtual.codigo||"Novo"}<br>
Responsável: ${pedidoAtual.responsavel}<br>
Quantidade de itens: ${pedidoAtual.itens.length}
`;
}

function limparItem(){
document.getElementById("nomePersonalizado").value="";

itemAtual={};

document.querySelectorAll("#mapaNumero .btn").forEach(btn=>{
btn.classList.remove("selecionado");
});
}

function salvarPedido(){

if(!pedidoAtual.codigo){
iniciarPedido();
}

localStorage.setItem(
pedidoAtual.codigo,
JSON.stringify(pedidoAtual)
);

}

function exportarHyper(){

let texto="";

texto+="PEDIDO "+pedidoAtual.codigo+"\n";
texto+="VÔLEI TERAPIA\n";
texto+="====================\n\n";

texto+="CAMISAS\n\n";

pedidoAtual.itens.forEach(item=>{

texto+=item.id+"\n";
texto+="Modelo: "+item.modelo+"\n";
texto+="Nome: "+item.nome+"\n";
texto+="Número: "+item.numero+"\n";
texto+="Tamanho: "+item.tamanhoCamisa+"\n";
texto+="--------------------\n";

});

texto+="\nSHORTS\n\n";

pedidoAtual.itens.forEach(item=>{

if(item.short){

texto+=item.id+"\n";
texto+="Número: "+item.numero+"\n";
texto+="Tamanho: "+item.tamanhoShort+"\n";
texto+="--------------------\n";

}

});

return texto;

}

function finalizarPedido(){

if(pedidoAtual.itens.length===0){
alert("Adicione itens antes de finalizar.");
return;
}

salvarPedido();

let texto=exportarHyper();

navigator.clipboard.writeText(texto)
.then(()=>{

alert(
"Pedido "+pedidoAtual.codigo+" salvo e copiado!"
);

})
.catch(()=>{

alert(
"Pedido salvo. Não foi possível copiar automaticamente."
);

});

}

