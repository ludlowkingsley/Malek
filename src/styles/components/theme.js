import $ from 'jquery';


import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';


// import Swiper JS
 import Swiper from 'swiper';
 // import Swiper styles
 import 'swiper/swiper-bundle.css';

import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';
import {cookiesEnabled} from '@shopify/theme-cart';

// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}


/* ---------------------------------------------
Sticky Nav on Scroll
------------------------------------------------ */
$(window).on('scroll', function (e) {
  e.preventDefault();
  stickyNav();
});

stickyNav();

function stickyNav () {

  if ($(window).scrollTop() > 100) {
    $('body').addClass('scrolled');
  } else {
    $('body').removeClass('scrolled');
  }
}



// @start Accordion

  $(document).on('click', '.accordion--title', function() {
    $(this).toggleClass('active');
    if($(this).hasClass('active')) {
      $(this).next().slideDown('fast');

    } else {
      $(this).next().slideUp('fast');

    }
  });

// @end Accordion





/* ---------------------------------------------
PRODUCT QUICK ADD
------------------------------------------------ */
var quickAdd = (function() {

  var variantArr = [];

  return {

    collectSelections: function(id) {

      variantArr = [];

      // Collect Size, Material, etc Variant Selection
      this.collectVariants(id);

      // Collect Color Selection
      this.collectColors(id);

      return this.findVariantID(id);

    },

    collectVariants: function(id) {
      // Collect Size, Material, etc Variant Selection
      var variantsInputs = $('#variants-'+id).find('input[checked]');

      var variant;

      for(var i = 0; i < variantsInputs.length; i++) {
        variant = variantsInputs[i].value;
        variantArr.push(variant);
      }

    },

    collectColors: function(id) {
      // Collect Color Selection
      var swatchContainer = $('.swatch-container-'+id);
      var selectedSwatch;
      var swatch;
      var swatchPosition;

      if($(swatchContainer).length > 0) {
        selectedSwatch = $(swatchContainer).find('input[checked]');
        swatch = $(swatchContainer).find('.swatch');
        // find position so it's in the right position in the variant list
        swatchPosition = swatch[0].dataset.optionIndex;
        selectedSwatch = selectedSwatch[0].value;
        variantArr.splice(swatchPosition, 0, selectedSwatch);
      }
    },

    findVariantID: function(id) {

      var variantObj = $('#variants-'+id).attr('data-obj');
      variantObj = decodeURIComponent(variantObj);
      variantObj = JSON.parse(variantObj); // parse object
      variantObj = variantObj.variants;

      // these will hold the values when checking your selections
      var variantValue1;
      var variantValue2;
      var variantValue3;
      var variantID;

      var selectetVariant;

      variantObj.forEach((variant, i) => {

        variantValue1 = variant.option1;
        variantValue1 = variantValue1 ? variantValue1.toLowerCase() : '';

        variantValue2 = variant.option2;
        variantValue2 = variantValue2 ? variantValue2.toLowerCase() : '';


        variantValue3 = variant.option3;
        variantValue3 = variantValue3 ? variantValue3.toLowerCase() : '';

        if(variantArr[0] && variantArr[1] && variantArr[2]) {
          if(variantArr[0] == variantValue1 && variantArr[1] == variantValue2 && variantArr[2] == variantValue3) {
            variantID = variant.id;
            selectetVariant = variant;
          }
        } else if (variantArr[0] && variantArr[1]) {

          if(variantArr[0] == variantValue1 && variantArr[1] == variantValue2) {

            variantID = variant.id;
            selectetVariant = variant;

          }
        } else {
          if(variantArr[0] == variantValue1) {
            variantID = variant.id;
            selectetVariant = variant;
          }
        }
      });

      return this.addToCart(variantID, 1);
    },

    addToCart: function(id, qty) {



      CartJS.addItem(id, qty, {}, {

            // Define a success callback to display a success message.
            "success": function(data, textStatus, jqXHR) {
              console.log(data);
              console.log(textStatus);
              console.log(jqXHR);
              $.get('/cart.js', '', function(data) {
                  $('.cart-count').html(data.item_count);
                 CartJS.getCart();
               }, 'json');
            },

            // Define an error callback to display an error message.
            "error": function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            }

        });
    },

    value: function() {

      return variantArr;
    }

  }

})();


$(document).on('change', '.input-radio', function(e) {
  e.preventDefault();

  var productID = $(this).attr('data-product-id');
  $('.input-radio-'+productID).attr('checked', false);
  $(this).attr('checked', 'checked');
});





$(".product_content--image").on({
    mouseenter: function () {
      var productID = $(this).attr('data-product-id');

      $('.quick-add-'+productID).show();

    },
    mouseleave: function () {
        var productID = $(this).attr('data-product-id');

        //stuff to do on mouse leave
        $('.quick-add-'+productID).hide();
        $('.variant-select-container-1-'+productID).hide();

    }
});

$(".quick-add-btn").on({
    mouseenter: function () {
      var productID = $(this).attr('data-product-id');
      var variantID = $(this).attr('data-variant-id');
      console.log(productID);
        //stuff to do on mouse enter
        $('.variant-select-container-1-'+productID).fadeIn();

    },
    mouseleave: function () {
        //stuff to do on mouse leave
    }
});


$(document).on('click', '.quick-add-btn', function(e) {
  e.preventDefault();
  var productID = $(this).attr('data-product-id');
  var variantID = $(this).attr('data-variant-id');
  if($(this).hasClass('has-variants')) {
    quickAdd.collectSelections(productID);
  } else {
    quickAdd.addToCart(variantID, 1);
  }
});

$(document).on('click', '.remove-item', function(){
  var value = $(this).attr('data-value');

});



$(document).on('click', '.size-guide-trigger', function() {
  $('.size_guide').fadeIn();
});

$(document).on('click', '.size_guide--close-container', function() {
  $('.size_guide').fadeOut();
});
