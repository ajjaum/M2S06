// Variáveis globais para armazenar os dados do aluno
let nomeDados, idadeDados, serieDados, nomeEscolaDados, materiaFavoritaDados, cepDados;

// Array inicial de notas das matérias
const notasIniciais = [
    { nomeMateria: "Matemática", arrayNotas: [8, 7, 9, 8], media: 8 },
    { nomeMateria: "Português", arrayNotas: [7, 8, 7, 8], media: 7.5 },
    { nomeMateria: "Ciências", arrayNotas: [9, 8, 9, 9], media: 8.75 }
];



// Salvar o array no LocalStorage
localStorage.setItem('notas', JSON.stringify(notasIniciais));

// Função para carregar os dados do aluno do LocalStorage
function carregarDadosAluno() {
    let aluno = JSON.parse(localStorage.getItem('aluno'));
    if (aluno) {
        document.getElementById('nome').innerHTML = `<strong>Nome: </strong> ${aluno.nome}`;
        document.getElementById('idade').innerHTML = `<strong>Idade: </strong> ${aluno.idade}`;
        document.getElementById('serie').innerHTML = `<strong>Série: </strong> ${aluno.serie}`;
        document.getElementById('escola').innerHTML = `<strong>Escola: </strong> ${aluno.escola}`;
        document.getElementById('materiaFavorita').innerHTML = `<strong>Matéria Favorita: </strong> ${aluno.materiaFavorita}`;
        document.getElementById('rua').innerHTML = `<strong>Rua: </strong> ${aluno.endereco.rua}`;
        document.getElementById('bairro').innerHTML = `<strong>Bairro: </strong> ${aluno.endereco.bairro}`;
        document.getElementById('cidade').innerHTML = `<strong>Cidade: </strong> ${aluno.endereco.cidade}`;
        document.getElementById('estado').innerHTML = `<strong>Estado: </strong> ${aluno.endereco.estado}`;
    } else {
        console.error('Nenhum dado de aluno encontrado no LocalStorage.');
    }

    // Carregar notas das matérias
    let notas = JSON.parse(localStorage.getItem('notas'));
    if (notas) {
        notas.forEach(nota => {
            criarLinha(nota);
        });
        atualizarMedias();  // Atualiza as médias depois de carregar as notas
    } else {
        console.error('Nenhuma nota encontrada no LocalStorage.');
    }
}


// Função para buscar o endereço via API do ViaCEP
function buscarEndereco(cep) {
    let cepFormatado = cep.replace(/\D/g, '');
    if (cepFormatado.length === 8) {
        fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    salvarDadosAluno(data);
                } else {
                    alert('CEP não encontrado!');
                }
            })
            .catch(error => console.error('Erro ao buscar CEP:', error));
    } else {
        alert('CEP inválido!');
    }
}

// Função para salvar os dados do aluno no LocalStorage
function salvarDadosAluno(endereco) {
    let aluno = {
        nome: nomeDados,
        idade: idadeDados,
        serie: serieDados,
        escola: nomeEscolaDados,
        materiaFavorita: materiaFavoritaDados,
        endereco: {
            cep: cepDados,
            rua: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.localidade,
            estado: endereco.uf
        }
    };
    
    localStorage.setItem('aluno', JSON.stringify(aluno));
    redirecionarParaHome();
}

// Função para redirecionar para a página de home
function redirecionarParaHome() {
    window.location.href = "home.html"; // Certifique-se de que o caminho para a tela de home está correto
}

// Captura os dados do aluno através de prompts
function capturarDadosAluno() {
    nomeDados = prompt("Qual o nome do aluno?");
    idadeDados = prompt("Qual a idade do aluno?");
    serieDados = prompt("Qual a série do aluno?");
    nomeEscolaDados = prompt("Qual o nome da escola?");
    materiaFavoritaDados = prompt("Qual a sua matéria favorita?");
    cepDados = prompt("Qual o CEP do aluno?");

    // Chama a função para buscar o endereço
    buscarEndereco(cepDados);
}

// Adiciona o evento ao botão "Iniciar Cadastro" quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const iniciarCadastroBtn = document.getElementById('iniciarCadastro');
    if (iniciarCadastroBtn) {
        iniciarCadastroBtn.addEventListener('click', capturarDadosAluno);
    }
});

// Chama a função para carregar os dados do aluno ao carregar a página home.html
if (window.location.pathname.endsWith('home.html')) {
    window.onload = carregarDadosAluno;
}

function novaLinha() {
    let curso = pegarMateriaEnotas();
    criarLinha(curso);

    // Atualizar o array de notas no LocalStorage
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.push(curso);
    localStorage.setItem('notas', JSON.stringify(notas));

    atualizarMedias();  // Atualiza as médias após adicionar uma nova linha
}


function fazerMedia(notas) {
    let soma = 0;
    for (let i = 0; i < notas.length; i++) {
        soma += notas[i];
    }
    return notas.length > 0 ? soma / notas.length : 0;
}



const mediasGerais = [];
const arrayMediasMaterias = [];

function pegarMateriaEnotas() {
    let nomeMateria = prompt("Qual a matéria?");
    let controlador = 1;
    let arrayNotas = [];

    while (controlador <= 4) {
        let nota = parseFloat(prompt(`Digite a nota ${controlador} para ${nomeMateria}:`));
        arrayNotas.push(nota);
        controlador++;
    }

    let media = fazerMedia(arrayNotas);
    mediasGerais.push(media);
    arrayMediasMaterias.push({ materia: nomeMateria, media: media });

    return { nomeMateria, arrayNotas, media };
}


function criarLinha(curso) {
    let tabela = document.querySelector('table tbody');
    let linha = document.createElement('tr');

    let celulaMateria = document.createElement('td');
    celulaMateria.textContent = curso.nomeMateria;
    linha.appendChild(celulaMateria);

    curso.arrayNotas.forEach(nota => {
        let celulaNota = document.createElement('td');
        celulaNota.textContent = nota;
        linha.appendChild(celulaNota);
    });

    let celulaMedia = document.createElement('td');
    celulaMedia.textContent = curso.media.toFixed(2);
    linha.appendChild(celulaMedia);

    tabela.appendChild(linha);

    atualizarMedias();
}

function atualizarMedias() {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    
    // Calcula todas as médias de cada matéria
    const medias = notas.map(nota => nota.media);
    
    // Atualiza a Média Geral do Aluno
    let mediaGeral = fazerMedia(medias);
    document.getElementById('media-geral').textContent = mediaGeral.toFixed(2);
    
    // Atualiza a Maior Média entre as Matérias
    let maiorMedia = Math.max(...medias);
    document.getElementById('maior-media').textContent = maiorMedia.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function() {
    // Carregar os dados do aluno ao carregar a página
    carregarDadosAluno();

    // Carregar a lista de alunos
    carregarListaDeAlunos();
});

function carregarListaDeAlunos() {
    fetch('http://localhost:3000/alunos')
        .then(response => response.json())
        .then(data => {
            const alunosLista = document.getElementById('alunos-lista');
            data.forEach(aluno => {
                let li = document.createElement('li');
                li.textContent = aluno.nome;
                alunosLista.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar a lista de alunos:', error));
}