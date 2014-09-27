/**
 * ====================================================================
 * Author: Harrison Zhao
 * ====================================================================
 */
'use strict';

$(function() {
  var SHOW_MILLISECONDS = 2000;
  var FADE_MILLISECONDS = 200;
  var signupUrl = '/signup';
  var redirectUrl = '/login';

  function showErrorMessage(message) {
    $('#error-message-span')
      .text(message)
      .fadeIn(FADE_MILLISECONDS)
      .delay(SHOW_MILLISECONDS)
      .fadeOut(FADE_MILLISECONDS);
  }

  $('#signup-form').submit(function(event) {
    event.preventDefault();
    var $inputs = $('#signup-form input');
    var formData = {};
    for (var i = 0; i !== $inputs.length; ++i) {
      formData[$inputs[i].id] = $inputs[i].value;
    }
    console.log(formData);
    $.ajax({
        url: signupUrl,
        type: 'POST',
        data: formData,
        success: function(data) {
          if (!data.message) {
            window.location.href = redirectUrl;
          }
          else {
            console.log(data.message);
          }
        },
        error: function(xhr, status, err) {
          console.error(xhr, status, err);
        }
      });
  });

  //bind enter button to submit button
  $(document).keypress(function(event){
    if (event.which === 13){
      $("#submit-signup").click();
    }
  });
});