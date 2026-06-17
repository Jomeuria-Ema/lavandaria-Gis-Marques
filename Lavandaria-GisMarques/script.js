


//animação sidebar
document.querySelectorAll("#Close-menu").forEach(function(element) {
    element.addEventListener("click", () =>{
        document.querySelector(".container").classList.toggle("show-menu")
    })
})

// Função para expandir/retrair cards da seção "Saber Mais"
function toggleAbout(cardIndex) {
    const expandedContent = document.getElementById(`about-${cardIndex}`);
    const expandBtn = event.target.closest('.expand-btn');
    
    if (expandedContent) {
        expandedContent.classList.toggle('show');
        expandBtn.classList.toggle('active');
        
        // Animar o ícone
        const icon = expandBtn.querySelector('i');
        if (icon) {
            icon.style.transform = expandedContent.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        
        // Atualizar texto do botão
        const spanText = expandBtn.querySelector('span');
        if (spanText) {
            if (expandedContent.classList.contains('show')) {
                spanText.textContent = cardIndex === 0 ? 'Ler menos' : cardIndex === 1 ? 'Ver menos' : 'Fechar';
            } else {
                spanText.textContent = cardIndex === 0 ? 'Ler mais' : cardIndex === 1 ? 'Ver mais' : 'Explorar';
            }
        }
    }
}

// Fechar cards ao clicar fora deles
document.addEventListener('click', function(event) {
    const isClickedOnCard = event.target.closest('.about-card');
    if (!isClickedOnCard) {
        document.querySelectorAll('.expanded-content').forEach(content => {
            content.classList.remove('show');
        });
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
});

// orçamento
const qtdeInput = document.querySelector("#qtde")
const jsCheckbox = document.querySelector("#js")
const layoutSimInput = document.querySelector("#layout-sim")
const layoutNaoInput = document.querySelector("#layout-nao")
const prazoInput = document.querySelector("#prazo")
const precoLabel = document.querySelector("#preco")

if (qtdeInput) qtdeInput.addEventListener("input", atualizarPreco)
if (jsCheckbox) jsCheckbox.addEventListener("input", atualizarPreco)
if (layoutSimInput) layoutSimInput.addEventListener("input", atualizarPreco)
if (layoutNaoInput) layoutNaoInput.addEventListener("input", atualizarPreco)

if (prazoInput) {
    prazoInput.addEventListener("input", function () {
        const prazo = prazoInput.value
        document.querySelector("label[for=prazo]").innerHTML = `Urgência: ${prazo} horas`
        atualizarPreco()
    })
}

function atualizarPreco(){
    const preco = calcularPreco()
    if (precoLabel) {
        precoLabel.innerHTML = `kzs ${preco.toFixed(2)}`
    }
}

// Atualiza valor inicial ao carregar a página
atualizarPreco()

function calcularPreco(){
    const qtde = Number(document.querySelector("#qtde").value) || 0
    const temJS = document.querySelector("#js").checked
    const incluiLayout = document.querySelector("#layout-sim").checked
    const prazo = Number(document.querySelector("#prazo").value) || 0

    let preco = qtde * 100;
    if (temJS) preco *= 1.1
    if (incluiLayout) preco += 500
    const MAX_PRAZO = 10;
    // Quanto menor o prazo (horas), maior a taxa de urgência.
    // Ex: prazo=1 -> taxa = 0.9 (aumenta 90%), prazo=10 -> taxa = 0 (sem acréscimo)
    let taxaUrgencia = ((MAX_PRAZO - prazo) / MAX_PRAZO);
    preco *= 1 + taxaUrgencia;

    return preco
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        const nome = document.querySelector('#nome');
        const email = document.querySelector('#contact-email');
        const mensagem = document.querySelector('#mensagem');
        const errorName = document.querySelector('#error-name');
        const errorEmail = document.querySelector('#error-email');
        const errorMessage = document.querySelector('#error-message');

        let formIsValid = true;

        errorName.textContent = '';
        errorEmail.textContent = '';
        errorMessage.textContent = '';

        if (!nome.value.trim()) {
            errorName.textContent = 'Por favor, insira seu nome.';
            formIsValid = false;
        }

        if (!email.value.trim()) {
            errorEmail.textContent = 'Por favor, insira um e-mail.';
            formIsValid = false;
        } else if (!validateEmail(email.value)) {
            errorEmail.textContent = 'Por favor, insira um e-mail válido.';
            formIsValid = false;
        }

        if (!mensagem.value.trim()) {
            errorMessage.textContent = 'Por favor, escreva sua mensagem.';
            formIsValid = false;
        }

        if (!formIsValid) {
            event.preventDefault();
        }
    });
}

// Handler do envio do formulário de orçamento
const formOrc = document.querySelector('#form-orcamento');
if (formOrc) {
    formOrc.addEventListener('submit', function(event){
        event.preventDefault();

        const qtde = Number(document.querySelector("#qtde").value) || 1
        const temJS = document.querySelector("#js").checked
        const incluiLayout = document.querySelector("#layout-sim").checked
        const expresso = document.querySelector("#layout-nao").checked
        const prazo = Number(document.querySelector("#prazo").value) || 1
        const preco = calcularPreco()

        const tipoPrazo = expresso ? 'Expresso (24h)' : 'Normal (2-3 dias)'
        const body = `Solicitação de Orçamento
Quantidade: ${qtde}
Serviços adicionais: ${temJS ? 'Sim' : 'Não'}
Inclui layout: ${incluiLayout ? 'Sim' : 'Não'}
Prazo de urgência: ${prazo} horas
Tipo de prazo: ${tipoPrazo}
Preço estimado: kzs ${preco.toFixed(2)}`

        const mail = 'gismarques25@gmail.com'
        const subject = encodeURIComponent('Orçamento Lavandaria')
        const mailto = `mailto:${mail}?subject=${subject}&body=` + encodeURIComponent(body)
        window.location.href = mailto
    })
}

const downloadDocButton = document.querySelector('#download-doc');
if (downloadDocButton) {
    downloadDocButton.addEventListener('click', function() {
        const docContent = gerarConteudoDoc();
        const blob = new Blob([docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'orcamento.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}

function gerarConteudoDoc() {
    const qtde = Number(document.querySelector("#qtde").value) || 1
    const temJS = document.querySelector("#js").checked
    const incluiLayout = document.querySelector("#layout-sim").checked
    const expresso = document.querySelector("#layout-nao").checked
    const prazo = Number(document.querySelector("#prazo").value) || 1
    const preco = calcularPreco()
    const tipoPrazo = expresso ? 'Expresso (24h)' : 'Normal (2-3 dias)'

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Orçamento Lavandaria</title>
</head>
<body>
    <h1>Orçamento de Serviço</h1>
    <p><strong>Quantidade:</strong> ${qtde}</p>
    <p><strong>Serviços adicionais:</strong> ${temJS ? 'Sim' : 'Não'}</p>
    <p><strong>Inclui layout:</strong> ${incluiLayout ? 'Sim' : 'Não'}</p>
    <p><strong>Prazo de urgência:</strong> ${prazo} horas</p>
    <p><strong>Tipo de prazo:</strong> ${tipoPrazo}</p>
    <p><strong>Preço estimado:</strong> kzs ${preco.toFixed(2)}</p>
</body>
</html>`;
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


//debounce
function debounce(func, wait, immediate) {
	let timeout
	return function(...args) {
		const context = this
		const later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		const callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}



// animação scrool =============================
const target = document.querySelectorAll("[data-anime]")

const animationClass = "animate"

function animeScroll() {
    const windowTop = window.pageYOffset + ((window.innerHeight * 3) / 4)
    target.forEach(function(element) {
        if((windowTop) > element.offsetTop){
            element.classList.add(animationClass)
        } else {
            element.classList.remove(animationClass)
        }
        
    })
}

if(target.length) {
    window.addEventListener('scroll', debounce(function() {
        animeScroll()
    },10))
}






