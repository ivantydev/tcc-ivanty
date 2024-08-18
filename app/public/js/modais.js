// ============================
// Modal de Editar Perfil (Desktop)
// ============================
var editProfileModal = document.getElementById("editProfileModal");
var btnOpenEditModal = document.getElementById("openEditModal");
var spanCloseEditModal = document.getElementById("closeEditModal");

// Ação para abrir o modal de editar perfil (desktop)
btnOpenEditModal.onclick = function() {
    editProfileModal.style.display = "block";
}
// Ação para fechar o modal de editar perfil (desktop)
spanCloseEditModal.onclick = function() {
    editProfileModal.style.display = "none";
}

// ============================
// Modal de Editar Perfil (Mobile)
// ============================
var editProfileModalMobile = document.getElementById("editProfileModalMobile");
var btnOpenEditModalMobile = document.getElementById("openEditModalMobile");
var spanCloseEditModalMobile = document.getElementById("closeEditModalMobile");

// Ação para abrir o modal de editar perfil (mobile)
btnOpenEditModalMobile.onclick = function() {
    editProfileModalMobile.style.display = "block";
}
// Ação para fechar o modal de editar perfil (mobile)
spanCloseEditModalMobile.onclick = function() {
    editProfileModalMobile.style.display = "none";
}

// ============================
// Modal de Upload de Foto (Desktop)
// ============================
var uploadFotoModal = document.getElementById("uploadFotoModal");
var btnOpenUploadModal = document.getElementById("openUploadModal");
var spanCloseUploadModal = document.getElementById("closeUploadModal");

// Ação para abrir o modal de upload de foto (desktop)
btnOpenUploadModal.onclick = function() {
    uploadFotoModal.style.display = "block";
}
// Ação para fechar o modal de upload de foto (desktop)
spanCloseUploadModal.onclick = function() {
    uploadFotoModal.style.display = "none";
}

// ============================
// Modal de Upload de Foto (Mobile)
// ============================
var uploadFotoModalMobile = document.getElementById("uploadFotoModalMobile");
var btnOpenUploadModalMobile = document.getElementById("openUploadModalMobile");
var spanCloseUploadModalMobile = document.getElementById("closeUploadModalMobile");

// Ação para abrir o modal de upload de foto (mobile)
btnOpenUploadModalMobile.onclick = function() {
    uploadFotoModalMobile.style.display = "block";
}
// Ação para fechar o modal de upload de foto (mobile)
spanCloseUploadModalMobile.onclick = function() {
    uploadFotoModalMobile.style.display = "none";
}

// ============================
// Modal de Adicionar Obra (Desktop)
// ============================
var addObraModal = document.getElementById("addObraModal");
var btnOpenAddObraModal = document.getElementById("openAddObraModal");
var spanCloseAddObraModal = document.getElementById("closeAddObraModal");

// Ação para abrir o modal de adicionar obra (desktop)
btnOpenAddObraModal.onclick = function() {
    addObraModal.style.display = "block";
}
// Ação para fechar o modal de adicionar obra (desktop)
spanCloseAddObraModal.onclick = function() {
    addObraModal.style.display = "none";
}

// ============================
// Modal de Adicionar Obra (Mobile)
// ============================
var addObraModalMobile = document.getElementById("addObraModalMobile");
var btnOpenAddObraModalMobile = document.getElementById("openAddObraModalMobile");
var spanCloseAddObraModalMobile = document.getElementById("closeAddObraModalMobile");

// Ação para abrir o modal de adicionar obra (mobile)
btnOpenAddObraModalMobile.onclick = function() {
    addObraModalMobile.style.display = "block";
}
// Ação para fechar o modal de adicionar obra (mobile)
spanCloseAddObraModalMobile.onclick = function() {
    addObraModalMobile.style.display = "none";
}

// ============================
// Fechar os modais clicando fora da área dos modais
// ============================
window.onclick = function(event) {
    // Fechar modais de editar perfil
    if (event.target == editProfileModal) {
        editProfileModal.style.display = "none";
    }
    if (event.target == editProfileModalMobile) {
        editProfileModalMobile.style.display = "none";
    }
    
    // Fechar modais de upload de foto
    if (event.target == uploadFotoModal) {
        uploadFotoModal.style.display = "none";
    }
    if (event.target == uploadFotoModalMobile) {
        uploadFotoModalMobile.style.display = "none";
    }

    // Fechar modais de adicionar obra
    if (event.target == addObraModal) {
        addObraModal.style.display = "none";
    }
    if (event.target == addObraModalMobile) {
        addObraModalMobile.style.display = "none";
    }
}
