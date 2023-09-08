// Initialize the current page index
let currentPageIndex = 1;

// Number of total pages in the preview
const totalPages = 5;

// Reference to the eBook preview image and buttons
const ebookPreviewImage = document.getElementById('ebookPreviewImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// Function to update the preview image and button states
function updatePreview() {
  ebookPreviewImage.src = `./landing_marketing_files/demo/${currentPageIndex}.jpg`;

  // Disable or enable 'prev' button
  if (currentPageIndex === 1) {
    prevButton.classList.add('disabled');
    prevButton.setAttribute('aria-disabled', 'true');
  } else {
    prevButton.classList.remove('disabled');
    prevButton.setAttribute('aria-disabled', 'false');
  }

  // Disable or enable 'next' button
  if (currentPageIndex === totalPages) {
    nextButton.classList.add('disabled');
    nextButton.setAttribute('aria-disabled', 'true');
  } else {
    nextButton.classList.remove('disabled');
    nextButton.setAttribute('aria-disabled', 'false');
  }
}

// Add event listener for 'prev' button
prevButton.addEventListener('click', (e) => {
  e.preventDefault();

  // Only navigate back if we're not at the first page
  if (currentPageIndex > 1) {
    currentPageIndex -= 1;
    updatePreview();
  }
});

// Add event listener for 'next' button
nextButton.addEventListener('click', (e) => {
  e.preventDefault();

  // Only navigate forward if we're not at the last page
  if (currentPageIndex < totalPages) {
    currentPageIndex += 1;
    updatePreview();
  }
});

// Initial preview update
updatePreview();
