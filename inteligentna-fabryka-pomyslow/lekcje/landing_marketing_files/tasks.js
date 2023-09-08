document.addEventListener("DOMContentLoaded", () => {
    // Initialize local storage based on the current page URL
    const currentPage = window.location.href;
    
    // Fetch all checkboxes inside the 'tasksList' block
    const checkboxes = document.querySelectorAll("#tasksList .form-check-input");
  
    // Load existing checkbox states from LocalStorage when the page loads
    loadCheckboxStates();
  
    checkboxes.forEach((checkbox) => {
      // Listen for changes on each checkbox
      checkbox.addEventListener("change", function() {
        // Save the state of checkboxes into LocalStorage
        saveCheckboxStates();
      });
    });
  
    function saveCheckboxStates() {
      let checkboxStates = {};
      
      checkboxes.forEach((checkbox) => {
        checkboxStates[checkbox.id] = checkbox.checked;
      });
  
      // Store it in LocalStorage
      localStorage.setItem(currentPage, JSON.stringify(checkboxStates));
    }
  
    function loadCheckboxStates() {
      let storedCheckboxStates = localStorage.getItem(currentPage);
      
      if (storedCheckboxStates) {
        storedCheckboxStates = JSON.parse(storedCheckboxStates);
        
        // Set the state of checkboxes based on LocalStorage
        Object.keys(storedCheckboxStates).forEach((id) => {
          const checkbox = document.getElementById(id);
          if (checkbox) {
            checkbox.checked = storedCheckboxStates[id];
          }
        });
      }
    }
  });
  