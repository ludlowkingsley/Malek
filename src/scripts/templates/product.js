import {load} from '@shopify/theme-sections';
import '../sections/product';

load('*');



var productSwiper = new Swiper('.swiper-container-product', {
  direction: 'horizontal',
  loop: false,
  observer: true,
  observeParents: true,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  }
});


$(document).on('click', '.product_care--title', function() {
  $(this).toggleClass('active');
  $('.product_care--desc').slideToggle();
});
