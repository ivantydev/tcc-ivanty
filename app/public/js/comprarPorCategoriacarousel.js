let comprarPorCategoriaslideIndex = 1;
showSlidesCategoria(comprarPorCategoriaslideIndex);

function plusSlidesCategoria(n) {
  showSlidesCategoria(comprarPorCategoriaslideIndex += n);
}

function currentSlideCategoria(n) {
  showSlidesCategoria(comprarPorCategoriaslideIndex = n);
}

function showSlidesCategoria(n) {
  let i;
  let slides = document.getElementsByClassName("comprarPorCategoriamySlides");
  let dots = document.getElementsByClassName("comprarPorCategoriadot");
  if (n > slides.length) {comprarPorCategoriaslideIndex = 1}
  if (n < 1) {comprarPorCategoriaslideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[comprarPorCategoriaslideIndex-1].style.display = "block";
  dots[comprarPorCategoriaslideIndex-1].className += " active";
}
