const swiper = new Swiper('.slider-wrapper', {

    loop: true,
    grabCursor:true,
    spaceBetween:30,

  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickabel: true,
      dynamicBullets: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        650: {
            slidesPerView: 2
        },
        901: {
            slidesPerView: 3
        },
        1220: {
          slidesPerView: 4
        }
    }
  });