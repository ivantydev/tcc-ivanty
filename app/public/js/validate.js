document.addEventListener('DOMContentLoaded', () => {
    // Selecionar todos os inputs e selects
    const inputs = document.querySelectorAll('input, select');

    // Função para validar um campo
    const validarCampo = (campo) => {
        const id = campo.id;
        const erro = document.getElementById(`erro${id.charAt(0).toUpperCase() + id.slice(1)}`);
        
        // Remover classes de validação
        campo.classList.remove('valid', 'invalid');
        erro.style.display = 'none';

        // Validar o campo de acordo com o tipo
        let isValid = true;

        switch (id) {
            case 'nome':
            case 'email':
            case 'telefone':
            case 'cpf':
                if (campo.value.trim() === "") {
                    erro.textContent = `${campo.previousElementSibling.textContent} é obrigatório.`;
                    erro.style.display = 'block';
                    campo.classList.add('invalid');
                    isValid = false;
                } else {
                    campo.classList.add('valid');
                }
                break;

            case 'senha':
            case 'Confirmarsenha':
                if (campo.value.trim() === "") {
                    erro.textContent = `${campo.previousElementSibling.textContent} é obrigatória.`;
                    erro.style.display = 'block';
                    campo.classList.add('invalid');
                    isValid = false;
                } else if (id === 'Confirmarsenha' && campo.value !== document.getElementById('senha').value) {
                    erro.textContent = "As senhas não coincidem.";
                    erro.style.display = 'block';
                    campo.classList.add('invalid');
                    isValid = false;
                } else {
                    campo.classList.add('valid');
                }
                break;

            case 'user-type':
                if (campo.value === "") {
                    erro.textContent = "Por favor, selecione um tipo.";
                    erro.style.display = 'block';
                    campo.classList.add('invalid');
                    isValid = false;
                } else {
                    campo.classList.add('valid');
                }
                break;
        }

        return isValid;
    };

    // Adicionar evento de input para todos os campos
    inputs.forEach(input => {
        input.addEventListener('input', () => validarCampo(input));
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
