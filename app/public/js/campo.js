const form = document.getElementById("form");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const cpf = document.getElementById("cpf");
const senha = document.getElementById("senha");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeValue = nome.value.trim();
    const emailValue = email.value.trim();
    const cpfValue = cpf.value.trim();
    const senhaValue = senha.value.trim();

    if (nomeValue === "" || emailValue === "" || cpfValue === "" || senhaValue === "") {
        alert("Por favor, preencha todos os campos.");
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
                senha_cliente: senhaValue
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
