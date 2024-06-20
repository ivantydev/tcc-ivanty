let obrasMaisVendidasslideIndex = 1;
showSlidesEstilo(obrasMaisVendidasslideIndex);

function plusSlidesEstilos(n) {
  showSlidesEstilo(obrasMaisVendidasslideIndex += n);
}

function currentSlide(n) {
  showSlidesEstilo(obrasMaisVendidasslideIndex = n);
}

function showSlidesEstilo(n) {
  let i;
  let slides = document.getElementsByClassName("obrasMaisVendidasmySlides");
  let dots = document.getElementsByClassName("obrasMaisVendidasdot");
  if (n > slides.length) {obrasMaisVendidasslideIndex = 1}    
  if (n < 1) {obrasMaisVendidasslideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[obrasMaisVendidasslideIndex-1].style.display = "block";  
  dots[obrasMaisVendidasslideIndex-1].className += " active";
}