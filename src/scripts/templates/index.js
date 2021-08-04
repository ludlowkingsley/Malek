import {load} from '@shopify/theme-sections';
import '../sections/product';

load('*');


/* ---------------------------------------------
TICKER
------------------------------------------------ */
if ($('.ticker').length > 0) {
  $('.ticker').grouploop({
    // animation speed
    velocity: .5,

    // false = from left to right
    forward: false,

    // default selectors
    childNode: '.item',
    childWrapper: '.item-wrap',

    // enable pause on hover
    pauseOnHover: false,

    // stick the first item
    stickFirstItem: false,

    // callback
    complete: null
  });
}
