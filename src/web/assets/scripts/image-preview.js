const $input = document.querySelector('.js-image-input');
const $preview = document.querySelector('.js-image-preview');

function updateImageDisplay(e) {
  const source = window.URL.createObjectURL($input.files[0]);
  $preview.style.backgroundImage = `url('${source}')`
  $preview.style.backgroundColor = 'inherit';
}


if ($input && $preview) {
  $input.addEventListener('change', updateImageDisplay);
}
