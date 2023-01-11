let wndAlert = 0;
var mdlCookies = undefined;

function noCookies() {
  window.location.href = "http://sgarcia-resume.herokuapp.com";
}

function acceptCookies() {
  mdlCookies.hide();
  localStorage.setItem("docut-cookies", "accepted");
}



window.addEventListener("load", (event) => {
  // var ln = navigator.language || navigator.userLanguage;
  // /*Validar que no se encuentre en la pagina correspondiente a su idioma*/
  // let pagActual = window.location.pathname;
  
  // if (ln == 'en-EN' && !pagActual.includes("indexEn")) {
  //     window.location.href = 'indexEn.html';  
  // } else if (ln == 'es-ES' && !pagActual.includes("indexEs")) {
  //     window.location.href = 'indexEs.html';
  // }

  if (localStorage.getItem("docut-cookies") !== "accepted") {
    mdlCookies = new bootstrap.Modal(document.getElementById("askCookies"), {
      keyboard: false,
      backdrop: "static",
    });
    mdlCookies.show();
  }
  document.querySelector("#longUrl").focus();
});

document.querySelector("#longUrl").addEventListener(
  "keyup",
  function (evt) {
    var real_val = document.querySelector("#longUrl").value;
    document.querySelector("#btnLongUrl").disabled = real_val.trim().length <= 0;
  },
  false
);
document.querySelector("#shortenUrl").addEventListener(
  "keyup",
  function (evt) {
    var real_val = document.querySelector("#shortenUrl").value;
    document.querySelector("#btnGo").disabled = real_val.trim().length <= 0;
  },
  false
);

document.querySelector("#infoUrl").addEventListener("hidden.bs.modal", function (event) {
  document.querySelector("#longUrl").focus();
});

document.querySelector("#btnLongUrl").addEventListener("click", (e) => {
  const eLongUrl = document.querySelector("#longUrl");
  
  fetch("/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longUrl: eLongUrl.value, reuse: document.querySelector("#kmsd").value }),
  })
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      with (JSON.parse(data)) {
        switch (res.state) {
          case 0:
            var mdlLongUrl = new bootstrap.Modal(document.getElementById("infoUrl"), {
              keyboard: false,
              backdrop: "static",
            });
            mdlLongUrl.show();
            with (JSON.parse(res.data)) {
              document.querySelector("#infoUrl #mdlUrl").value = decodeURI(shortUrl);
            }
            break;

          case 5:
            restoreText( res.aviso );
            wndAlert = new bootstrap.Modal(document.getElementById("avExceed"), {
              keyboard: false,
              backdrop: "static",
            });
            wndAlert.show();
            document.querySelector("#avExceed p.hidden").innerHTML = decodeURI(longUrl);
            break;
            case 6:
            restoreText( res.aviso );
            wndAlert = new bootstrap.Modal(document.getElementById("avExceed"), {
              keyboard: false,
              backdrop: "static",
            });
            document.querySelector("#avExceed #btnDelete").classList.add("hidden");
            document.querySelector("#avExceed .modal-body").innerHTML = "<p>" + res.msg + "</p>";
            document.querySelector("#avExceed #dismiss").innerHTML = "Ok";
            wndAlert.show();
            break;

          default:
            document.querySelector("#shortenMsg").innerHTML = res.msg;
            clearMsg(document.querySelector("#shortenMsg"), document.querySelector("#longUrl"));
            break;
        }
      }
    })
    .catch(function (error) {
      document.querySelector("#shortenMsg").innerHTML = "Problemas con la invocación... intente más tarde.";
      clearMsg(document.querySelector("#shortenMsg"), document.querySelector("#longUrl"), 6000);
    })
    .finally(function () {
      document.querySelector("#kmsd").value = "No";
    });
});

function restoreText( aviso ){
  document.getElementById("btnDelete").classList.remove("hidden");
  document.querySelector("#avExceed .modal-body").innerHTML =aviso+' <p class="hidden"></p>';
  document.querySelector("#avExceed #dismiss").innerHTML = "No";
}

document.querySelector("#btnGo").addEventListener("click", (e) => {
  const eUrl = document.querySelector("#shortenUrl");
  fetch("/goUrl", {
    method: "POST",
    //mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shortenUrl: eUrl.value }),
  })
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      with (JSON.parse(data)) {
        if (res.state === 0) {
          window.open(res.data.data.longUrl, "_blank");
        } else {
          document.querySelector("#goMsg").innerHTML = res.msg;
          clearMsg(document.querySelector("#goMsg"), document.querySelector("#shortenUrl"));
        }
      }
    });
});

document.querySelector("#btnClearInputLU").addEventListener("click", (e) => {
  document.querySelector("#btnLongUrl").disabled = true;
  clearMsg(document.querySelector("#shortenMsg"), document.querySelector("#longUrl"), 0);
});

document.querySelector("#btnClearInputGo").addEventListener("click", (e) => {
  document.querySelector("#btnGo").disabled = true;
  clearMsg(document.querySelector("#goMsg"), document.querySelector("#shortenUrl"), 0);
});

document.querySelector("#btnCopy").addEventListener("click", (e) => {
  const elem = document.querySelector("#mdlUrl");
  elem.select();
  elem.setSelectionRange(0, 99999);

  document.execCommand("copy");
});

document.querySelector("#btnDelete").addEventListener("click", (e) => {
  // const longURL = document.querySelector("#avExceed p.hidden").innerHTML;kmsd
  wndAlert.hide();
  //wndAlert.dispose();
  document.querySelector("#kmsd").value = "Yes";
  document.querySelector("#btnLongUrl").click();
});

const clearMsg = (elemMsg, elemInput, time = 4000) => {
  setTimeout(() => {
    elemMsg.innerHTML = "";
    elemInput.value = "";
  }, time);
};


