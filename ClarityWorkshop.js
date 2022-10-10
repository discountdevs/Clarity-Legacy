function splitIntoChunk(inputArray, perChunk) {
  var result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
  return result
}


window.onload = function () {
  var request = new XMLHttpRequest();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has('page')) {
    var page = urlParams.get('page');
  } else {
    var page = 1;
  }
  request.open('GET', 'https://clarityworkshop.n3rdl0rd.repl.co/getpage/' + page.toString(), false); // `false` makes the request synchronous
  request.send(null);
  if (request.status === 200) {
    var currentLvls = request.responseText;
    var lvlJson = JSON.parse(currentLvls);
    console.log(lvlJson);
    var splitLvlJson = splitIntoChunk(lvlJson, 3);
    console.log(splitLvlJson);
    document.getElementById("container").innerHTML = "";
    const container = document.getElementById("container");
    container.innerHTML = `
    <div id="pinnedcontainer">
      <p>Featured</p>
      <div class="w3-row-padding">

        <div class="w3-third w3-container w3-margin-bottom">
      <div class="w3-container level w3-hover-opacity" style= "cursor: pointer;" onclick="loadLevelById(36);">
        <p><b>Official Clarity Tutorial</b></p>
        <p>By <i><a href="user.html?user=N3rdL0rd">N3rdL0rd</a></i>, the creator of Clarity</p>
      </div>
  
    </div>

        <div class="w3-third w3-container w3-margin-bottom">
      <div class="w3-container level w3-hover-opacity" style= "cursor: pointer;" onclick="loadLevelById(122);">
        <p><b>S.S.S.S (Single Screen Suffering Squared)</b></p>
        <p>By <i><a href="user.html?user=@TdubMorris">@TdubMorris</a></i>, the co-creator of Clarity</p>
      </div>
    </div>




    <br></br>
      </div>
      <p>Other Levels</p>
    </div>`

  //   <div class="w3-third w3-container w3-margin-bottom">
  //   <div class="w3-container level w3-hover-opacity" style= "cursor: pointer;" onclick="alert('haha u thought')">
  //     <p><b>Campaign Mode</b></p>
  //     <p>The official story campaign for Clarity</p>
  //   </div>
  // </div>


    splitLvlJson.forEach(levels => {
      console.log(levels);
      const container = document.getElementById("container");
      var newRow = document.createElement("div");
      newRow.class = "w3-row-padding";

      levels.forEach(level => {
        console.log(level);
        var newelem = `
    <div class="w3-third w3-container w3-margin-bottom w3-hover-opacity" style= "cursor: pointer;" onclick="loadLevelById({levelId});">
      <div class="w3-container level">
        <p><b>{level}</b></p>
        <p>By <a href="user.html?user={author}">{author}</a> - Likes: {likes}</p>
      </div>
    </div>`.replace("{level}", level["name"]).replace("{author}", level["author"]).replace("{author}", level["author"]).replace("{levelId}", level["id"]).replace("{likes}", level["likes"]);
        newRow.innerHTML = newRow.innerHTML + newelem;
      })
      newRow.innerHTML = newRow.innerHTML + "</br>";
      container.appendChild(newRow);
    })




    // append pagination buttons (back, fwd, etc)
    container.innerHTML = container.innerHTML + `
    <center>
    <div id="pagination" class="w3-row-padding">
      <div class="button-62" role="button" style= "cursor: pointer;" id="back" onclick="loadPage(` + (parseInt(page) - 1).toString() + `);">
        <p>&lt;</p>
      </div>
      <div class="button-62" role="button" style= "cursor: pointer;" id="fwd" onclick="loadPage(` + (parseInt(page) + 1).toString() + `);">
        <p>Next Page &gt;</p>
      </div>
    </div>
    </center>`
    if (parseInt(page) === 1){
      document.getElementById("back").style.display = "none";
    }
    if (lvlJson.length === 0){
      document.getElementById("fwd").style.display = "none";
    }
  }
}


function loadPage(page) {
  window.location.href = "https://discountdevs.github.io/Clarity-Legacy/workshop.html?page=" + (page).toString();
}


function loadLevelById(id) {
  window.location.href = "https://discountdevs.github.io/Clarity-Legacy/level.html?id=" + (id).toString();
}



      function signin(){
        Swal.fire({
      title: 'Login to Clarity',
      html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
      <input type="password" id="password" class="swal2-input" placeholder="Password"><br><a href="account.html">No account? Sign up instead!</a>`,
      confirmButtonText: 'Login',
      focusConfirm: true,
      preConfirm: () => {
        const login = Swal.getPopup().querySelector('#login').value
        const password = Swal.getPopup().querySelector('#password').value
        if (!login || !password) {
          Swal.showValidationMessage(`Please enter login and password`)
        }
        return { login: login, password: password }
      }
    }).then((result) => {
        var res = httpGet("https://clarityworkshop.n3rdl0rd.repl.co/login/"+encodeURIComponent(result.value.login)+"/"+encodeURIComponent(result.value.password));
        if(res == "ok"){
          localStorage.setItem('user', result.value.login);
                 window.location.reload();
    
        } else {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Incorrect login or password!'
          })
        }
    
    
    
    
          
      })
            }
    
    
      function signout(){
        localStorage.setItem("user", null);
    
    
        document.getElementById("signinbutton").innerText = "Sign In";
        document.getElementById("signinbutton").onclick = signin;
        
       window.location.href=window.location.href;
      }
    
      function signedin(){
        return localStorage.getItem("user");
      }

function mylvls(){
  // get the signed in user
  var user = signedin();
  if(user){
    window.location.href="https://discountdevs.github.io/Clarity-Legacy/user.html?user="+encodeURIComponent(user);
  } else {
    signin();
  }
}