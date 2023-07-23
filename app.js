/*----------------------
Créateur de badge v3.0

Cette application permet de créer des badges pour XDock tablette au format du QR Code et barcode type Code-128.
Logiciel de code-barres par TEC-IT

v3.0 dernière mise à jour le 07 juillet 2023

Copyright 2022-2023 Hassan ABBAS
-----------------------*/

//-----------------------
// config
//-----------------------
let max = 9;
let min = 1;
let task = 0;
let codeAPI =
  "https://barcode.tec-it.com/barcode.ashx?code=qrcode&eclevel=M&imagetype=Png&data=";
let barcodeAPI =
  "https://barcode.tec-it.com/barcode.ashx?code=&translate-esc=tru&data=";
let working = false;
//  let googleAPI = "https://chart.googleapis.com/chart?cht=qr&chs=512&chl=

// selctors
app = document.getElementById("app");

//-----------------------
// sartup / set fileds
//-----------------------
for (i = 1; i < max; i++) {
  document.getElementById("rows").innerHTML += `    
  <div class="row">
  <div class="num">${i}</div>
  <div class="input"><input  type="text" class="form-control sheet name"></div>
  <div class="input"><input type="text" class="form-control sheet data"></div>
</div>`;
}

// On click print
document.getElementById("print").addEventListener("click", function () {
  // exit if btn alrdy clicked
  if (working) return false;

  // clear
  clear();

  // set working flag
  working = true;

  let rows = document.querySelectorAll(".row");
  for (let i = 0; i < rows.length; i++) {
    let name = rows[i].children[1].children[0].value;
    let data = rows[i].children[2].children[0].value;

    // check if the row is not empty
    if (name.length > 0 && data.length > 0) {
      // show wite on btn
      document.getElementById("print").innerHTML = "Patienter...";

      // load image on browser to fix loding issue
      document.getElementById("temp").innerHTML += `<img  src="${
        codeAPI + encodeURIComponent(data)
      }">`;

      if (data.includes("@xdock.de")) {
        document.getElementById("cards").innerHTML += createBadge(name, data);
      } else {
        document.getElementById("cards").innerHTML += createPassword(
          name,
          data
        );
      }

      task++;
    }
  }

  //check if ther is no data
  if (!task > 0) {
    clear();
    return alert("Veuillez entrer vos données.");
  }

  // set time ou to fix images load by broswer
  setTimeout(function () {
    // open print dilog
    window.print();
  }, 1000);

  window.addEventListener("afterprint", (event) => {
    clear();
  });
});
//-----------------------
// create Badge
//-----------------------
function createBadge(name, compte) {
  return `   
    <div class='card'>
    <span class="box up"></span>
    <div class='badge-barcode'>
      <h1 class="badge_holder_name">${name}</h1>
      <img class="barcode" src="${barcodeAPI + compte}">  
    </div>
    <div class='badge-icon'><img src="./Logo_STEF.gif"></div>
    <span class="box down"></span>
  </div>`;
}
//-----------------------
// create mot de passe
//-----------------------

function createPassword(name, password) {
  let card_uid = "AG" + Math.random().toString(16).slice(9);
  let crete_date = formatDate();
  let code_img_URL = codeAPI + encodeURIComponent(password);

  return `        
    <div id="card" class='card'>
    <div class='card-icon'><img src="./Icon_STEF.png"> </div>
    <div class='card-qrcode'><img id="qrcode" src="${code_img_URL}" fetchpriority="high" alt="QR Code"> <p class="scan">Scannez ici</p> </div>
    <div class="card-title"><p>Code d'identification</p></div>
    <div class="border-left"></div>
    <div class="card-holder">
      <p id="card-holder">${name}</p>
      <p id="card-date">Date de création ${crete_date}</p>
    </div>
    <div class="card-id"><p id="card-uid">${card_uid}</p></div>
    <div class="border-right"></div>
  </div>`;
}

//-----------------------
// formatDate
//-----------------------
function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}
//-----------------------
// clear
//-----------------------
function clear() {
  task = 0;
  document.getElementById("cards").innerHTML = "";
  document.getElementById("temp").innerHTML = "";
  document.getElementById("print").innerHTML = "Créer et Imprimer";
  working = false;
}

//-----------------------
// show password on focus
//-----------------------
let fileds = document.querySelectorAll(".data");

for (i = 0; i < fileds.length; i++) {
  fileds[i].addEventListener("focusin", function (e) {
    e.target.attributes[0].value = "text";
  });

  fileds[i].addEventListener("focusout", function (e) {
    if (this.value.includes("@xdock.de")) {
      e.target.attributes[0].value = "text";
    } else {
      e.target.attributes[0].value = "password";
    }
  });
}

//-----------------------
//autocomplete
//-----------------------
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      // extrct first name
      const arr_name = arr[i].split(" ");
      /*check if the item starts with the same letters as the text field value:*/
      if (
        arr_name[0].substr(0, val.length).toUpperCase() == val.toUpperCase() ||
        arr_name[1].substr(0, val.length).toUpperCase() == val.toUpperCase()
      ) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = arr[i].substr(0, val.length);
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

/*An array containing all the names:*/
var names_list = [
  "BENKOUSSA Hamadi",
  "BOUAKHRI YOUNES",
  "BOUGAA ABDERRAHIM",
  "CHRISTINE Kevin",
  "DE SOUSA Leandro",
  "DIETRICH Kévin",
  "DIALLO Boubacar Sidy",
  "EISENBEIS Chris",
  "FERRANDEZ Daniel",
  "GAUTHIER Ryan",
  "GREBIL Maxime",
  "HEILIG Patrice",
  "HENRIOT Christophe",
  "HENRIOT Eric",
  "HENRIOT Julian",
  "IMBS Sebastien",
  "KUNTZ Sebastien",
  "KUREKCI Gokhan",
  "MASSON Romain",
  "MOR Taner",
  "MURER Stephan",
  "NICEVIC Kenan",
  "REHM Thierry",
  "RISTORTO Vincent",
  "ROSSE Arnaud",
  "SCHAAL Benoit",
  "SCHOETTEL Georges",
  "SOULAIMANA Bounouvamini",
  "STRUB Mike",
  "THOMAE David",
  "TOMEI Suzie",
  "URBAN Matthieu",
  "VESPERINI Gregory",
  "WALTER Alban",
  "WILLER Marc",
  "ABBAS Hassan",
  "ELKADIKI Saleh",
  "ZAGGAY Mohammed",
  "Pierre ",
  "Lucas ",
  "Henri ",
  "Karim ",
  "Jeason ",
  "Houcine ",
  "Julien ",
];

/*initiate the autocomplete function */
let names = document.querySelectorAll(".name");

for (i = 0; i < names.length; i++) {
  autocomplete(names[i], names_list);
}
