function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map( function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });  
}

function at_remove() {
    document.querySelector(".waiting").remove();
}

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed without CSS & images");
});
  
window.addEventListener("load", (event) => {
    console.log("When all page its ready...");
  
    /**** Controlling waiting effect
     ****************************************************/
    //animateCSS( '#waiting', 'fadeOut', at_remove);
    if (document.querySelector(".hidden") !== null){
      document.querySelector(".hidden").classList.add("hidden");
      document.querySelector(".hidden").classList.remove("hidden");
    
      at_remove();
    }

    setTimeout(() => {
        initializeTooltips();
      }, 2000
    );
     
});

