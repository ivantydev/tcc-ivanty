let currentPage = 1;
const itemsPerPage = 4; // Quantidade de pinturas a mostrar por página
const paintings = document.querySelectorAll('.painting');
const totalPages = Math.ceil(paintings.length / itemsPerPage);

function updateGallery() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    paintings.forEach((painting, index) => {
        painting.style.display = (index >= start && index < end) ? 'inline-block' : 'none';
    });

    document.getElementById('page-info').textContent = `${currentPage}/${totalPages}`;
}

function changePage(direction) {
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    updateGallery();
}

// Inicializar a galeria ao carregar a página
updateGallery();