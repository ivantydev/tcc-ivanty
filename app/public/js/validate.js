document.addEventListener('DOMContentLoaded', () => {
    // Selecionar todos os inputs e selects
    const inputs = document.querySelectorAll('input, select');

    // Função de validação genérica
    const validarCampo = (campo) => {
        const id = campo.id;
        const erro = document.getElementById(`erro${id.charAt(0).toUpperCase() + id.slice(1)}`);
        
        // Remover classes de validação
        campo.classList.remove('valid', 'invalid');
        erro.style.display = 'none';

        let isValid = true;
        let erroMsg = "";

        switch (id) {
            case 'nome':
            case 'email':
            case 'telefone':
            case 'cpf':
                if (campo.value.trim() === "") {
                    erroMsg = `${campo.previousElementSibling.textContent} é obrigatório.`;
                    isValid = false;
                }
                break;

            case 'senha':
            case 'Confirmarsenha':
                if (campo.value.trim() === "") {
                    erroMsg = `${campo.previousElementSibling.textContent} é obrigatória.`;
                    isValid = false;
                } else if (id === 'Confirmarsenha' && campo.value !== document.getElementById('senha').value) {
                    erroMsg = "As senhas não coincidem.";
                    isValid = false;
                }
                break;

            case 'user-type':
                if (campo.value === "") {
                    erroMsg = "Por favor, selecione um tipo.";
                    isValid = false;
                }
                break;

            case 'dataNascimento':
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(campo.value)) {
                    erroMsg = "Data de nascimento inválida. Use o formato DD/MM/AAAA.";
                    isValid = false;
                }
                break;

            case 'telefone':
                if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(campo.value)) {
                    erroMsg = "Telefone inválido. Use o formato (XX) XXXXX-XXXX.";
                    isValid = false;
                }
                break;

            case 'cep':
                if (!/^\d{5}-\d{3}$/.test(campo.value)) {
                    erroMsg = "CEP inválido. Use o formato XXXXX-XXX.";
                    isValid = false;
                }
                break;

            case 'numero':
                if (isNaN(campo.value) || campo.value.trim() === '') {
                    erroMsg = "Número inválido.";
                    isValid = false;
                }
                break;

            case 'tipoEndereco':
                if (campo.value.trim() === '') {
                    erroMsg = "Tipo de endereço é obrigatório.";
                    isValid = false;
                }
                break;

            case 'complemento':
                // Validação opcional para complemento
                break;
        }

        if (!isValid) {
            erro.textContent = erroMsg;
            erro.style.display = 'block';
            campo.classList.add('invalid');
        } else {
            campo.classList.add('valid');
        }

        return isValid;
    };

    // Adicionar evento de input para todos os campos
    inputs.forEach(input => {
        input.addEventListener('input', () => validarCampo(input));
    });

    // Adicionar evento de blur para validação individual ao sair do campo
    inputs.forEach(input => {
        input.addEventListener('blur', () => validarCampo(input));
    });

    // Validação ao submeter o formulário
    document.getElementById('cadastroForm').addEventListener('submit', function(event) {
        let isValid = true;

        // Validar todos os campos
        inputs.forEach(input => {
            if (!validarCampo(input)) {
                isValid = false;
            }
        });

        // Se todas as validações passarem, o formulário é enviado
        if (isValid) {
            alert("Formulário enviado com sucesso!");
            // document.getElementById('cadastroForm').submit(); // Envia o formulário
        } else {
            event.preventDefault(); // Impede o envio se houver erros
        }
    });
});
