let comprarPorCategoriaslideIndexMobile = 1;
showSlidesCategoriaMobile(comprarPorCategoriaslideIndexMobile);

function plusSlidesCategoriasMobile(n) {
  showSlidesCategoriaMobile(comprarPorCategoriaslideIndexMobile += n);
}

function currentSlideMobile(n) {
  showSlidesCategoriaMobile(comprarPorCategoriaslideIndexMobile = n);
}

function showSlidesCategoriaMobile(n) {
  let i;
  let slides = document.getElementsByClassName("comprarPorCategoriamySlidesMobile");
  let dots = document.getElementsByClassName("comprarPorCategoriadotMobile");
  if (n > slides.length) {comprarPorCategoriaslideIndexMobile = 1}    
  if (n < 1) {comprarPorCategoriaslideIndexMobile = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[comprarPorCategoriaslideIndexMobile-1].style.display = "block";  
  dots[comprarPorCategoriaslideIndexMobile-1].className += " active";
}
