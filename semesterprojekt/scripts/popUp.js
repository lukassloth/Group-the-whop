document.addEventListener('DOMContentLoaded', () => { //Tilføjer eventlistener til når HTML og DOM er loaded helt ind
    const popUp = document.getElementById('popUp'); //Konst, der refererer til popUp div i index
    const overlay = document.getElementById('popUpOverlay'); //Konst, der refererer til popUpOverlay div i index
    const closeButton = document.getElementById('closePopUp'); //Konst, der refererer til knappen på popUp i index

    popUp.style.display = 'block'; //Her gives popUp konstanten style som 'block', så den vises på skærmen
    overlay.style.display = 'block'; //Her gives overlay konstanten style som 'block', så den dækker hele skærmen

    closeButton.addEventListener('click', () => { //Her tilføjes der en eventlistener til knappen når der trykkes på den
      popUp.style.display = 'none'; //Når man trykker på knappen, så skjules popUp
      overlay.style.display = 'none'; //Når man trykker på knappen, så skjules overlay
    });

    overlay.addEventListener('click', () => { //Her tilføjes der en eventlistener til overlay når man trykker på det
      popUp.style.display = 'none'; //Når man trykker på overlay, så skjules popUp
      overlay.style.display = 'none'; //Når man trykker på overlay, så skjules overlay
    });
  });