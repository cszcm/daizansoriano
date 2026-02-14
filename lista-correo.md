---
layout: default
title: "Lista de correo"
permalink: /lista-correo/
---

<section class="post newsletter-page">
  <header class="section-heading">
    <p class="post-meta">Contacto</p>
    <h1 class="post-title">Lista de correo</h1>
  </header>

  <div class="post-content">
    <form id="WebToLeadForm" action="https://caminomedio.sinergiacrm.org/index.php?entryPoint=WebToPersonCapture" method="POST" name="WebToLeadForm">
      <h2></h2>
      <p>Esta lista de correo es un espacio sencillo para compartir reflexiones, entradas de blog y episodios del podcast que voy publicando como parte de mi práctica y enseñanza del budismo Soto Zen. Los envíos son ocasionales y puedes darte de baja cuando lo desees.</p>
      <div class="row">
        <div class="col"><label>Nombre: </label><input name="first_name" id="first_name" type="text" /></div>
        <div class="col">&nbsp;</div>
        <div class="clear">&nbsp;</div>
      </div>
      <div class="row">
        <div class="col"><label>Apellidos: <span class="required">*</span></label><input name="last_name" id="last_name" type="text" required="" /></div>
        <div class="col">&nbsp;</div>
        <div class="clear">&nbsp;</div>
      </div>
      <div class="row">
        <div class="col"><label>Correo electrónico: </label><input name="email1" id="email1" type="email" /></div>
        <div class="col">&nbsp;</div>
        <div class="clear">&nbsp;</div>
      </div>
      <div class="row center buttons">
        <input class="button" name="Submit" type="submit" value="Enviar" onclick="submit_form();" />
        <div class="clear">&nbsp;</div>
      </div>
      <input name="campaign_id" id="campaign_id" type="hidden" value="00000707-e538-14d1-d6d7-6975ddfb7dd1" />
      <input name="redirect_url" id="redirect_url" type="hidden" value="https://www.daizansoriano.com" />
      <input name="assigned_user_id" id="assigned_user_id" type="hidden" value="00000f0b-aea0-cbf0-db07-682dc6e0639d" />
      <input name="moduleDir" id="moduleDir" type="hidden" value="Leads" />
    </form>

    <div class="notranslate" style="all: initial;">&nbsp;</div>

    <script type="text/javascript">
      // STIC-custom 20211122 - jch - Avoid multiple submission
      // STIC#489
      var formHasAlreadyBeenSent = false;
      /**
       * Prevent multiple form submissions
       *
       * @return void
       */
      function lockMultipleSubmissions() {
        if (formHasAlreadyBeenSent) {
          console.log("Form is locked because it has already been sent.");
          event.preventDefault();
        }
        formHasAlreadyBeenSent = true;
      }
      // Attach function to event
      document.getElementById("WebToLeadForm").addEventListener("submit", lockMultipleSubmissions);
      // END STIC-custom
      function submit_form() {
        check_webtolead_fields();
        //document.WebToLeadForm.submit();
      }

      function check_webtolead_fields() {
        if (document.getElementById("bool_id") != null) {
          var reqs = document.getElementById("bool_id").value;
          bools = reqs.substring(0, reqs.lastIndexOf(";"));
          var bool_fields = new Array();
          var bool_fields = bools.split(";");
          nbr_fields = bool_fields.length;
          for (var i = 0; i < nbr_fields; i++) {
            if (document.getElementById(bool_fields[i]).value == "on") {
              document.getElementById(bool_fields[i]).value = 1;
            } else {
              document.getElementById(bool_fields[i]).value = 0;
            }
          }
        }
      }
    </script>
  </div>
</section>
