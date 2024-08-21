function verificaCPF(cpf) {
    // Função para validar CPF
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g,'');
    
    if(cpf === '') return false;
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        alert("CPF inválido! O CPF deve conter 11 dígitos.");
        return false;
    }

    // Elimina CPFs inválidos conhecidos
    if (
        cpf === "00000000000" || 
        cpf === "11111111111" || 
        cpf === "22222222222" || 
        cpf === "33333333333" || 
        cpf === "44444444444" || 
        cpf === "55555555555" || 
        cpf === "66666666666" || 
        cpf === "77777777777" || 
        cpf === "88888888888" || 
        cpf === "99999999999"
    ) {
        alert("CPF inválido!");
        return false;
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        alert("CPF inválido!");
        return false;
    }
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
        alert("CPF inválido!");
        return false;
    }

    // Se passou por todas as verificações, o CPF é válido
    return true;
}

// Função para verificar qual CPF deve ser validado
function validarFormulario(event) {
    event.preventDefault();

    let cpfMobile = document.getElementById('strCPF_mobile');
    let cpfDesktop = document.getElementById('strCPF_desktop');

    let cpfValido = true;

    if (cpfMobile && cpfMobile.offsetParent !== null) { // Checa se o campo está visível
        cpfValido = verificaCPF(cpfMobile.value);
    } else if (cpfDesktop && cpfDesktop.offsetParent !== null) {
        cpfValido = verificaCPF(cpfDesktop.value);
    }

    if (cpfValido) {
        document.getElementById('cadastroFormMobile').submit();
        document.getElementById('cadastroFormDesktop').submit();
    }
}
