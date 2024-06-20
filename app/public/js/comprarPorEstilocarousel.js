let comprarPorEstiloslideIndex = 1;
showSlidesEstilo(comprarPorEstiloslideIndex);

function plusSlidesEstilos(n) {
  showSlidesEstilo(comprarPorEstiloslideIndex += n);
}

function currentSlide(n) {
  showSlidesEstilo(comprarPorEstiloslideIndex = n);
}

function showSlidesEstilo(n) {
  let i;
  let slides = document.getElementsByClassName("comprarPorEstilomySlides");
  let dots = document.getElementsByClassName("comprarPorEstilodot");
  if (n > slides.length) {comprarPorEstiloslideIndex = 1}    
  if (n < 1) {comprarPorEstiloslideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[comprarPorEstiloslideIndex-1].style.display = "block";  
  dots[comprarPorEstiloslideIndex-1].className += " active";
}