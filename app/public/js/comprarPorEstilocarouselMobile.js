let comprarPorEstiloslideIndexMobile = 1;
showSlidesEstiloMobile(comprarPorEstiloslideIndexMobile);

function plusSlidesEstilosMobile(n) {
  showSlidesEstiloMobile(comprarPorEstiloslideIndexMobile += n);
}

function currentSlideMobile(n) {
  showSlidesEstiloMobile(comprarPorEstiloslideIndexMobile = n);
}

function showSlidesEstiloMobile(n) {
  let i;
  let slides = document.getElementsByClassName("comprarPorEstilomySlidesMobile");
  let dots = document.getElementsByClassName("comprarPorEstilodotMobile");
  if (n > slides.length) {comprarPorEstiloslideIndexMobile = 1}    
  if (n < 1) {comprarPorEstiloslideIndexMobile = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[comprarPorEstiloslideIndexMobile-1].style.display = "block";  
  dots[comprarPorEstiloslideIndexMobile-1].className += " active";
}
