---
layout: default
title: "Newsletter de meditacion zen"
description: "Suscripcion por correo para recibir nuevas reflexiones, articulos y episodios de audio de Daizan Soriano."
permalink: /lista-correo/
---

<section class="post newsletter-page">
  <header class="section-heading">
    <p class="post-meta">Newsletter</p>
    <h1 class="post-title">Lista de correo</h1>
  </header>

  <div class="post-content">
    <form id="WebToLeadForm" action="https://caminomedio.sinergiacrm.org/index.php?entryPoint=WebToPersonCapture" method="POST" name="WebToLeadForm" target="newsletter_submit_frame" novalidate>
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
        <div class="col"><label>Correo electrónico: <span class="required">*</span></label><input name="email1" id="email1" type="email" required="" /></div>
        <div class="col">&nbsp;</div>
        <div class="clear">&nbsp;</div>
      </div>
      <div class="row center buttons">
        <input class="button" name="Submit" type="submit" value="Enviar" onclick="submit_form();" />
        <div class="clear">&nbsp;</div>
      </div>
      <input name="campaign_id" id="campaign_id" type="hidden" value="00000707-e538-14d1-d6d7-6975ddfb7dd1" />
      <input name="assigned_user_id" id="assigned_user_id" type="hidden" value="00000f0b-aea0-cbf0-db07-682dc6e0639d" />
      <input name="moduleDir" id="moduleDir" type="hidden" value="Leads" />
    </form>
    <iframe name="newsletter_submit_frame" title="Envío de suscripción" style="display:none;"></iframe>
    <p id="newsletter-feedback" class="newsletter-feedback" role="status" aria-live="polite"></p>

    <div class="notranslate" style="all: initial;">&nbsp;</div>

    <script type="text/javascript">
      // STIC-custom 20211122 - jch - Avoid multiple submission
      // STIC#489
      var formHasAlreadyBeenSent = false;
      var hasSubmittedInCurrentPage = false;
      var feedbackEl = document.getElementById("newsletter-feedback");
      var submitFrame = document.querySelector('iframe[name="newsletter_submit_frame"]');
      var submitButton = document.querySelector('#WebToLeadForm input[type="submit"]');
      /**
       * Prevent multiple form submissions
       *
       * @return void
       */
      function lockMultipleSubmissions(event) {
        var emailField = document.getElementById("email1");
        if (emailField && !emailField.checkValidity()) {
          event.preventDefault();
          if (feedbackEl) {
            feedbackEl.textContent = "Introduce un correo electrónico válido.";
            feedbackEl.classList.add("is-visible");
          }
          emailField.focus();
          return;
        }
        if (formHasAlreadyBeenSent) {
          console.log("Form is locked because it has already been sent.");
          event.preventDefault();
          if (feedbackEl) {
            feedbackEl.textContent = "Tu suscripción ya se está enviando.";
            feedbackEl.classList.add("is-visible");
          }
          return;
        }
        formHasAlreadyBeenSent = true;
        hasSubmittedInCurrentPage = true;
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.value = "Enviando...";
        }
        if (feedbackEl) {
          feedbackEl.textContent = "Enviando suscripción...";
          feedbackEl.classList.add("is-visible");
        }
      }
      // Attach function to event
      document.getElementById("WebToLeadForm").addEventListener("submit", lockMultipleSubmissions);
      if (submitFrame) {
        submitFrame.addEventListener("load", function () {
          if (!hasSubmittedInCurrentPage) {
            return;
          }
          if (feedbackEl) {
            feedbackEl.textContent = "Suscripción recibida. Gracias.";
            feedbackEl.classList.add("is-visible");
          }
          var formEl = document.getElementById("WebToLeadForm");
          if (formEl) {
            formEl.reset();
          }
          if (submitButton) {
            submitButton.value = "Suscrito";
          }
        });
      }
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
