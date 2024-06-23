const form = document.getElementById("form");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const cpf = document.getElementById("cpf");
const senha = document.getElementById("senha");
const datanasc = document.getElementById("datanasc");
const perfil = document.getElementById("perfil");
const telefone = document.getElementById("telefone");
const cep = document.getElementById("cep");
const numero = document.getElementById("numero");
const complemento = document.getElementById("complemento");
const tipo_endereco = document.getElementById("tipo_endereco");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeValue = nome.value.trim();
    const emailValue = email.value.trim();
    const cpfValue = cpf.value.trim();
    const senhaValue = senha.value.trim();
    const datanascValue = datanasc.value.trim();
    const perfilValue = perfil.value.trim();
    const telefoneValue = telefone.value.trim();
    const cepValue = cep.value.trim();
    const numeroValue = numero.value.trim();
    const complementoValue = complemento.value.trim();
    const tipoEnderecoValue = tipo_endereco.value.trim();

    if (
        nomeValue === "" ||
        emailValue === "" ||
        cpfValue === "" ||
        senhaValue === "" ||
        datanascValue === "" ||
        telefoneValue === "" ||
        cepValue === "" ||
        numeroValue === "" ||
        complementoValue === "" ||
        tipoEnderecoValue === ""
    ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (!validateEmail(emailValue)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    if (!validateCPF(cpfValue)) {
        alert("Por favor, insira um CPF válido.");
        return;
    }

    if (!validatePhone(telefoneValue)) {
        alert("Por favor, insira um telefone válido.");
        return;
    }

    if (!validateCEP(cepValue)) {
        alert("Por favor, insira um CEP válido.");
        return;
    }

    try {
        const response = await fetch("/api/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome_cliente: nomeValue,
                email_cliente: emailValue,
                cpf_cliente: cpfValue,
                senha_cliente: senhaValue,
                datanasc_cliente: datanascValue,
                perfil_cliente: perfilValue,
                telefone_cliente: telefoneValue,
                cep_endereco: cepValue,
                numero_endereco: numeroValue,
                complemento_endereco: complementoValue,
                tipo_endereco: tipoEnderecoValue
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar cliente.");
        }

        const data = await response.json();
        console.log("Cliente cadastrado com sucesso:", data);
        alert("Cliente cadastrado com sucesso!");
        form.reset(); // Limpa o formulário após o envio bem-sucedido

    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error.message);
        alert("Ocorreu um erro ao cadastrar o cliente. Por favor, tente novamente.");
    }
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validateCPF(cpf) {
    const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return re.test(cpf);
}

function validatePhone(phone) {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return re.test(phone);
}

function validateCEP(cep) {
    const re = /^\d{5}-\d{3}$/;
    return re.test(cep);
}
