// JavaScript code to handle the special offer
document.addEventListener('DOMContentLoaded', function() {
    // 1. Save the page load time in localStorage if not saved previously
    if (!localStorage.getItem('pageLoadTime')) {
      localStorage.setItem('pageLoadTime', new Date().getTime());
    }
  
    const pageLoadTime = Number(localStorage.getItem('pageLoadTime'));
    const currentTime = new Date().getTime();
    const timeDifferenceMinutes = (currentTime - pageLoadTime) / 1000 / 60;
  
    // 2. Remove the specialOffer section if more than 60 minutes have passed
    if (timeDifferenceMinutes >= 30) {
      const specialOfferSection = document.getElementById('specialOffer');
      if (specialOfferSection) {
        specialOfferSection.remove();
      }
      return;
    }
  
    // 3. Update the countdown timer in the specialOffer section
    const specialOfferCounterMinutes = document.getElementById('specialOfferCounterMinutes');
    const specialOfferCounterSeconds = document.getElementById('specialOfferCounterSeconds');
  
    function updateCounter() {
      const currentTime = new Date().getTime();
      const timeLeftSeconds = 60 * 30 - (currentTime - pageLoadTime) / 1000;
      
      if (timeLeftSeconds <= 0) {
        // 4. Remove the specialOffer section after 60 minutes
        const specialOfferSection = document.getElementById('specialOffer');
        if (specialOfferSection) {
          specialOfferSection.remove();
        }
        clearInterval(interval);
        return;
      }
      
      const minutes = Math.floor(timeLeftSeconds / 60);
      const seconds = Math.floor(timeLeftSeconds % 60);
      
      if (specialOfferCounterMinutes && specialOfferCounterSeconds) {
        specialOfferCounterMinutes.textContent = minutes;
        specialOfferCounterSeconds.textContent = seconds;
      }
    }
  
    const interval = setInterval(updateCounter, 1000);
    updateCounter();
  });
  