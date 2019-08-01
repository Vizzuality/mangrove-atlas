Transifex.live.onFetchLanguages(function(languages) {

  //set the language selector to the source language (default)
  $('#language-current').html(
      Transifex.live.getSourceLanguage().name
  );

  //empty our language list
  $('#language-selector').empty();

  //add translation languages to the list
  for (var i = 0; i < languages.length; ++i) {
      $('#language-selector').append(
          '<li data-code="' + languages[i].code +
          '" data-name="' + languages[i].name +
          '">' + languages[i].name + '</li>'
      );
  }

  //handle user selecting a language
  $('#language-selector').find('li').click(function(e) {
      e && e.preventDefault();
      var code = $(this).closest('[data-code]').data('code');
      var name = $(this).closest('[data-code]').data('name');

      //tell transifex live to translate the page
      //based on user selection
      Transifex.live.translateTo(code, true);
  });

  //called when Transifex Live successfully translates the
  //page to a language. In that case lets update the
  //selected language of the widget
  Transifex.live.onTranslatePage(function(language_code) {
      $('#language-current').html(
          Transifex.live.getLanguageName(language_code)
      );
  });
});
<select> element

/*
Custom picker example with <select> type language dropdown, e.g.
<select id="language-select">

  <!-- This is populated by the snippet below -->
  <option value="en">English</option>
  <option value="fr">French</option>
  <option value="de">German</option>

</select>
*/

//This is called each time the languages list is retrieved
//from Transifex Live. This may happen more than once so we should
//be able to handle this case.
Transifex.live.onFetchLanguages(function(languages) {

  //empty our language <select> list
  $('#language-select').empty();

  //add translation languages to the list
  for (var i = 0; i < languages.length; ++i) {
      $('#language-select').append(
          '<option value="' + languages[i].code +
          '">' + languages[i].name + '</option>'
      );
  }

  //set the language selector to the source language (default)
  $('#language-select').val(
    Transifex.live.getSourceLanguage().code
  );

  //handle user selecting a language
  $('#language-select').change(function() {
      //tell transifex live to translate the page
      //based on user selection
      Transifex.live.translateTo($(this).val());
  });

  //called when Transifex Live successfully translates the
  //page to a language. In that case lets update the
  //selected language of the widget
  Transifex.live.onTranslatePage(function(language_code) {
      $('#language-select').val(language_code);
  });
});
