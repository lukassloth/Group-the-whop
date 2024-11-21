document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popUp');
    const overlay = document.getElementById('popUpOverlay');
    const closeButton = document.getElementById('closePopUp');

    popup.style.display = 'block';
    overlay.style.display = 'block';

    closeButton.addEventListener('click', () => {
      popup.style.display = 'none';
      overlay.style.display = 'none';
    });

    overlay.addEventListener('click', () => {
      popup.style.display = 'none';
      overlay.style.display = 'none';
    });
  });