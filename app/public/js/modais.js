var editProfileModal = document.getElementById("editProfileModal");
var btnOpenEditModal = document.getElementById("openEditModal");
var spanCloseEditModal = document.getElementById("closeEditModal");
var uploadFotoModal = document.getElementById("uploadFotoModal");
var btnOpenUploadModal = document.getElementById("openUploadModal");
var spanCloseUploadModal = document.getElementById("closeUploadModal");
var addObraModal = document.getElementById("addObraModal");
var btnOpenAddObraModal = document.getElementById("openAddObraModal");
var spanCloseAddObraModal = document.getElementById("closeAddObraModal");
var editProfileModalMobile = document.getElementById("editProfileModalMobile");
var btnOpenEditModalMobile = document.getElementById("openEditModalMobile");
var spanCloseEditModalMobile = document.getElementById("closeEditModalMobile");
var uploadFotoModalMobile = document.getElementById("uploadFotoModalMobile");
var btnOpenUploadModalMobile = document.getElementById("openUploadModalMobile");
var spanCloseUploadModalMobile = document.getElementById("closeUploadModalMobile");
var addObraModalMobile = document.getElementById("addObraModalMobile");
var btnOpenAddObraModalMobile = document.getElementById("openAddObraModalMobile");
var spanCloseAddObraModalMobile = document.getElementById("closeAddObraModalMobile");

// Ação para abrir o modal de editar perfil (desktop)
btnOpenEditModal.onclick = function() {
    editProfileModal.style.display = "block";
}
// Ação para fechar o modal de editar perfil (desktop)
spanCloseEditModal.onclick = function() {
    editProfileModal.style.display = "none";
}
// Ação para abrir o modal de upload de foto (desktop)
btnOpenUploadModal.onclick = function() {
    uploadFotoModal.style.display = "block";
}
// Ação para fechar o modal de upload de foto (desktop)
spanCloseUploadModal.onclick = function() {
    uploadFotoModal.style.display = "none";
}
// Ação para abrir o modal de adicionar obra (desktop)
btnOpenAddObraModal.onclick = function() {
    addObraModal.style.display = "block";
}
// Ação para fechar o modal de adicionar obra (desktop)
spanCloseAddObraModal.onclick = function() {
    addObraModal.style.display = "none";
}
// Ação para abrir o modal de editar perfil (mobile)
btnOpenEditModalMobile.onclick = function() {
    editProfileModalMobile.style.display = "block";
}
// Ação para fechar o modal de editar perfil (mobile)
spanCloseEditModalMobile.onclick = function() {
    editProfileModalMobile.style.display = "none";
}
// Ação para abrir o modal de upload de foto (mobile)
btnOpenUploadModalMobile.onclick = function() {
    uploadFotoModalMobile.style.display = "block";
}
// Ação para fechar o modal de upload de foto (mobile)
spanCloseUploadModalMobile.onclick = function() {
    uploadFotoModalMobile.style.display = "none";
}
// Ação para abrir o modal de adicionar obra (mobile)
btnOpenAddObraModalMobile.onclick = function() {
    addObraModalMobile.style.display = "block";
}
// Ação para fechar o modal de adicionar obra (mobile)
spanCloseAddObraModalMobile.onclick = function() {
    addObraModalMobile.style.display = "none";
}

// Fechar os modais clicando fora da área dos modais

window.onclick = function(event) {
    if (event.target == editProfileModal) {
        editProfileModal.style.display = "none";
    }
    if (event.target == uploadFotoModal) {
        uploadFotoModal.style.display = "none";
    }
    if (event.target == addObraModal) {
        addObraModal.style.display = "none";
    }
    if (event.target == editProfileModalMobile) {
        editProfileModalMobile.style.display = "none";
    }
    if (event.target == uploadFotoModalMobile) {
        uploadFotoModalMobile.style.display = "none";
    }
    if (event.target == addObraModalMobile) {
        addObraModalMobile.style.display = "none";
    }
}