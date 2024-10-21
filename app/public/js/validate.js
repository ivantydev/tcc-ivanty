function verificaCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf === '') return { valid: false, message: "CPF não pode ser vazio." };
    if (cpf.length !== 11) {
        return { valid: false, message: "CPF inválido! O CPF deve conter 11 dígitos." };
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return { valid: false, message: "CPF inválido! Não pode ser uma sequência repetida." };
    }

    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) {
        return { valid: false, message: "CPF inválido!" };
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) {
        return { valid: false, message: "CPF inválido!" };
    }

    return { valid: true };
}

function validarSenha(senha, confirmarSenha) {
    if (senha.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (senha !== confirmarSenha) {
        return 'As senhas não coincidem.';
    }
    return true; // Senha válida
}

function validarCampo(campo) {
    const erro = document.getElementById(`erro${campo.id.charAt(0).toUpperCase() + campo.id.slice(1)}`);
    campo.classList.remove('valid', 'invalid');
    erro.style.display = 'none';

    let isValid = true;

    if (campo.value.trim() === "") {
        erro.textContent = `${campo.previousElementSibling.textContent} é obrigatório.`;
        erro.style.display = 'block';
        campo.classList.add('invalid');
        isValid = false;
    } else {
        campo.classList.add('valid');
    }

    return isValid;
}

function validarFormulario(event) {
    // Impede o envio padrão do formulário
    event.preventDefault();

    // Limpar mensagens de erro
    const erros = document.querySelectorAll('.erro');
    erros.forEach(erro => erro.textContent = '');

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('Confirmarsenha').value;
    const cpf = document.getElementById('strCPF').value;

    // Validação da senha
    const resultadoSenha = validarSenha(senha, confirmarSenha);
    if (resultadoSenha !== true) {
        const erroSenha = document.getElementById('erroSenha');
        erroSenha.textContent = resultadoSenha;
        return false; // Impede o envio do formulário
    }

    // Validação do CPF
    const resultadoCPF = verificaCPF(cpf);
    if (!resultadoCPF.valid) {
        alert(resultadoCPF.message); // Exibe alerta com a mensagem de erro
        return false; // Impede o envio do formulário
    }

    // Valida todos os campos
    const inputs = document.querySelectorAll('input, select');
    let allValid = true;

    inputs.forEach(input => {
        if (!validarCampo(input)) {
            allValid = false;
        }
    });

    // Se todos os campos são válidos, o formulário será enviado
    if (allValid) {
        document.getElementById('cadastroForm').submit();
    }
}

// Adiciona os eventos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('strCPF');

    // Validação em tempo real para CPF
    cpfInput.addEventListener('input', () => {
        const resultadoCPF = verificaCPF(cpfInput.value);
        const erroStrCPF = document.getElementById('erroStrCPF');
        
        if (!resultadoCPF.valid) {
            erroStrCPF.textContent = resultadoCPF.message;
        } else {
            erroStrCPF.textContent = ''; // Limpa a mensagem de erro se o CPF for válido
        }
    });

    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => validarCampo(input));
    });

    document.getElementById('cadastroForm').addEventListener('submit', validarFormulario);
});
