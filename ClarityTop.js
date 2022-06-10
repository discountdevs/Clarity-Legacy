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

    request.open('GET', 'https://clarityworkshop.n3rdl0rd.repl.co/toplvls/', false); // `false` makes the request synchronous
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
        <p>Top Levels</p>
 

  
  
  
      <br></br>
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
        <a class="button-62" role="button" style= "cursor: pointer;" id="back" href="https://discountdevs.github.io/Clarity/workshop.html?page=1">
          <p>&lt; Back</p>
        </a>

      </div>
      </center>`

    }
  }
  
  
  function loadPage(page) {
    window.location.href = "https://discountdevs.github.io/Clarity/workshop.html?page=" + (page).toString();
  }
  
  
  function loadLevelById(id) {
    window.location.href = "https://discountdevs.github.io/Clarity/level.html?id=" + (id).toString();
  }

  function mylvls(){
    // get the signed in user
    var user = signedin();
    if(user){
      window.location.href="https://discountdevs.github.io/Clarity/user.html?user="+encodeURIComponent(user);
    } else {
      signin();
    }
  }