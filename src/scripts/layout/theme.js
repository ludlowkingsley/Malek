import $ from 'jquery';


import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import {
  getUrlWithVariant,
  ProductForm
} from '@shopify/theme-product-form';

// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/swiper-bundle.css';

import {
  focusHash,
  bindInPageLinks
} from '@shopify/theme-a11y';
import {
  cookiesEnabled
} from '@shopify/theme-cart';

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
$(window).on('scroll', function(e) {
  e.preventDefault();
  stickyNav();
});

stickyNav();

function stickyNav() {

  if ($(window).scrollTop() > 100) {
    $('body').addClass('scrolled');
  } else {
    $('body').removeClass('scrolled');
  }
}



// @start Accordion

$(document).on('click', '.accordion--title', function() {
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
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

      console.log('ID');
      console.log(id);

      console.log(variantArr);

      // Collect Size, Material, etc Variant Selection
      this.collectVariants(id);

      console.log(variantArr);


      // Collect Color Selection
      this.collectColors(id);

      // return;

      return this.findVariantID(id);

    },

    collectVariants: function(id) {
      // Collect Size, Material, etc Variant Selection
      var variantsInputs = $('#variants-' + id).find('input[checked]');

      var variant;

      for (var i = 0; i < variantsInputs.length; i++) {
        variant = variantsInputs[i].value;
        variantArr.push(variant);
      }

    },

    collectColors: function(id) {
      // Collect Color Selection
      var swatchContainer = $('.swatch-container-' + id);
      swatchContainer = $(swatchContainer).find('.swatch-element.active');
      console.log(swatchContainer);
      var swatch;
      var swatchPosition;
      var selectedSwatch;


      if ($(swatchContainer).length > 0) {
        // selectedSwatch = $(swatchContainer).find('active');
        //
        // selectedSwatch = $(selectedSwatch).find('input');
        //
        // swatch = $(swatchContainer).find('.swatch');

        swatchPosition = $(swatchContainer).attr('data-position');
        selectedSwatch = $(swatchContainer).attr('data-value');

        // return;

        // find position so it's in the right position in the variant list
        // swatchPosition = swatch[0].dataset.optionIndex;
        // selectedSwatch = selectedSwatch[0].value;
        variantArr.splice(swatchPosition, 0, selectedSwatch);
      }
    },

    findVariantID: function(id) {

      var variantObj = $('#variants-' + id).attr('data-obj');
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

        if (variantArr[0] && variantArr[1] && variantArr[2]) {
          if (variantArr[0] == variantValue1 && variantArr[1] == variantValue2 && variantArr[2] == variantValue3) {
            variantID = variant.id;
            selectetVariant = variant;
          }
        } else if (variantArr[0] && variantArr[1]) {

          if (variantArr[0] == variantValue1 && variantArr[1] == variantValue2) {

            variantID = variant.id;
            selectetVariant = variant;

          }
        } else {
          if (variantArr[0] == variantValue1) {
            variantID = variant.id;
            selectetVariant = variant;
          }
        }
      });

      return selectetVariant;
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
  var btn = $('button[data-product-id=' + productID + ']');
  $('.input-radio-' + productID).attr('checked', false);
  $(this).attr('checked', 'checked');
  var activeVariant = quickAdd.collectSelections(productID);

  if (activeVariant.available) {
    $(btn).html('QUICK ADD');
    $(btn).prop("disabled", false);
  } else {
    $(btn).html('SOLD OUT');
    $(btn).prop("disabled", true);
  }

});



$('.swatch :radio').change(function() {
  var optionIndex = $(this).closest('.swatch').attr('data-option-index');
  var optionID = $(this).attr('data-option-id');
  var optionValue = $(this).val();
  var optionTitle = $(this).attr('data-title');
  var position = $(this).attr('data-position');
  var activeVariant;
  var btn;
  // productSwiper.slideTo(position);
  optionIndex = parseInt(optionIndex) + 1;
  var optionIndexOG = parseInt(optionIndex) - 1;

  $('.swatch-el-' + optionID).removeClass('active');
  $('.swatch-element-' + optionIndexOG + '-' + optionValue + '-' + optionID).addClass('active');
  $('#Option' + optionIndex + '-' + optionValue + '-' + optionID).trigger('click');
  $('.swatch-' + optionIndexOG + '-readout').html(optionTitle);
  $('.swatch-' + optionIndexOG + '-' + optionValue + '-' + optionID + '-readout').html(optionTitle);
  if (!$(this).hasClass('is-product-page')) {
    btn = $('button[data-product-id=' + optionID + ']');
    activeVariant = quickAdd.collectSelections(optionID);
    if (activeVariant.available) {
      $(btn).html('QUICK ADD');
      $(btn).prop("disabled", false);

    } else {
      $(btn).html('SOLD OUT');
      $(btn).prop("disabled", true);

    }
  }


});




$(".product_content--img-hover").on({

  mouseenter: function() {
    var productID = $(this).attr('data-product-id');
    $('.quick-add-' + productID).show();

  },
  mouseleave: function() {
    var productID = $(this).attr('data-product-id');

    //stuff to do on mouse leave
    $('.quick-add-' + productID).hide();
    $('.variant-select-container-' + productID).hide();

  }
});

$(".quick-add-btn").on({
  mouseenter: function() {
    var productID = $(this).attr('data-product-id');
    var variantID = $(this).attr('data-variant-id');

    //stuff to do on mouse enter
    $('.variant-select-container-' + productID).fadeIn();

  },
  mouseleave: function() {
    //stuff to do on mouse leave
  }
});


$(document).on('click', '.quick-add-btn', function(e) {
  e.preventDefault();
  var productID = $(this).attr('data-product-id');
  var variantID = $(this).attr('data-variant-id');
  var activeID;
  var activeVariant;
  if ($(this).hasClass('has-variants')) {
    activeVariant = quickAdd.collectSelections(productID);
    quickAdd.addToCart(activeVariant.id, 1);
  } else {
    quickAdd.addToCart(variantID, 1);
  }
});

$(document).on('click', '.size_guide--toggle', function(e) {
  e.preventDefault();
  var index = $(this).attr('data-index');
  $('.size_guide--toggle').removeClass('active');
  $(this).addClass('active');

  $('.size_guide--t').addClass('hide');
  $('.table-' + index).removeClass('hide');

});

$(document).on('click', '.remove-item', function() {
  var value = $(this).attr('data-value');

});



$(document).on('click', '.size-guide-trigger', function() {
  $('.size_guide').fadeIn();
});

$(document).on('click', '.size_guide--close-container', function() {
  $('.size_guide').fadeOut();
});

$(document).on('click', '.burger', function(e) {
  $('body').addClass('nav-opened');
  $('.nav-drawer-container').fadeIn('fast');
  $('.nav-drawer').animate({
    left: "0",
  }, 200, function() {
    // Animation complete.
  });
});

$(document).on('click', '.nav-drawer-container', function(e) {

  if ($(e.target).hasClass('nav-drawer-container')) {
    $('body').removeClass('nav-opened');
    $('.nav-drawer').animate({
      left: "-80%",
    }, 200, function() {
      $('.nav-drawer-container').fadeOut('fast');
    });
  }
});

$(document).on('click', '.nav-drawer__close-nav', function(e) {
  $('body').removeClass('nav-opened');
  $('.nav-drawer').animate({
    left: "-80%",
  }, 200, function() {
    $('.nav-drawer-container').fadeOut('fast');
  });
});



/* ---------------------------------------------
COLLECTION FILTER
------------------------------------------------ */


var filter = (function() {
  // array with tag handles
  var tagArr;
  // array with tag titles so it can print to page all pretty
  var readOutArr;

  // removes spaces and dashes
  function replace(value) {
    value = value.toLowerCase();
    value = value.replaceAll(' ', '-');
    value = value.replaceAll('-&-', '-');
    return value;
  }

  return {
    // creates initial array
    createArray: function() {
      var value;
      tagArr = [];
      readOutArr = [];
      // loops through current tags and adds them to array that will print / filter
      for (var i = 0; i < currentTags.length; i++) {
        value = replace(currentTags[i]);
        tagArr.push(value);
        var readout;
        readout = currentTags[i].replaceAll('type-', '');
        readout = readout.replaceAll('feel-', '');
        readout = readout.replaceAll('size-', '');
        readout = readout.replaceAll('color-', '');
        readOutArr.push(readout);
      }
      return this.createReadOut();
    },

    // add a tag to the array
    add: function(value) {
      value = replace(value);
      tagArr.push(value);
      return this.buildUrl();
    },

    // remove tag from array
    remove: function(value) {
      value = replace(value);
      var index = tagArr.indexOf(value);
      if (index > -1) {
        tagArr.splice(index, 1);
      }
      return this.buildUrl();
    },

    // clears array
    viewAllProducts: function() {
      tagArr = [];
      return this.buildUrl();
    },

    // builds tagged url
    buildUrl: function() {
      var value = this.value();


      var url = '/collections/' + collectionHandle.handle;
      for (var i = 0; i < value.length; i++) {
        if (i == 0) {
          url += '/' + value[i];
        } else {
          url += '+' + value[i];
        }
      }
      return this.changeUrl(url);
    },

    // redirects to new filtered link
    changeUrl: function(url) {
      window.location = url; // redirect
    },

    // creates readout
    createReadOut: function() {
      var html = '';

      for (var i = 0; i < readOutArr.length; i++) {
        html += '<li class="remove-item remove-' + tagArr[i] + '" data-value=" ' + tagArr[i] + ' ">' + readOutArr[i] + ' - </li>';
      }

      $('.filter_readout--selected').html('<ul class="readout-ul">' + html + '</ul>');

    },

    // returns tag array
    value: function() {
      return tagArr;
    }
  };
})();



$(document).on('click', '.collection_filter--filter-input-container', function() {
  var input = $(this).find('.collection_filter--filter-input');
  var value = $(input).val();
  var operation = $(input).attr('data-operation');
  if (operation == 'add') {
    filter.add(value);
  } else if (operation == 'remove') {
    filter.remove(value);
  }
});

$(document).on('click', '.collection_filter--trigger', function() {
  var parent = $(this).parent();
  var dropDown = $(parent).find('.collection_filter--dropdown-container');
  $(dropDown).slideToggle();
});

// init
// console.log($(window.location.pathname).contains('/collections/'))
var path = window.location.pathname;
if (path.indexOf("collections") >= 0) {
  filter.createArray();

} else {

}




$(document).on('click', '.sort_by--trigger', function() {
  $('.sort_by--ul').slideToggle();
});

$(document).on('click', '.show-filters', function(e) {
  e.preventDefault();
  $(this).toggleClass('active');
  $('.mobile-filter').slideToggle();
});
