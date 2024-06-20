let obrasMaisVendidasMobileslideIndex = 1;
showSlidesEstilo(obrasMaisVendidasMobileslideIndex);

function plusSlidesEstilos(n) {
  showSlidesEstilo(obrasMaisVendidasMobileslideIndex += n);
}

function currentSlide(n) {
  showSlidesEstilo(obrasMaisVendidasMobileslideIndex = n);
}

function showSlidesEstilo(n) {
  let i;
  let slides = document.getElementsByClassName("obrasMaisVendidasMobilemySlides");
  let dots = document.getElementsByClassName("obrasMaisVendidasMobiledot");
  if (n > slides.length) {obrasMaisVendidasMobileslideIndex = 1}    
  if (n < 1) {obrasMaisVendidasMobileslideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[obrasMaisVendidasMobileslideIndex-1].style.display = "block";  
  dots[obrasMaisVendidasMobileslideIndex-1].className += " active";
}