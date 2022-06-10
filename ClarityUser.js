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
    if (urlParams.has('user')) {
      var user = urlParams.get('user');
    } else {
      var user = "N3rdL0rd";
    }
    request.open('GET', 'https://clarityworkshop.n3rdl0rd.repl.co/getuser/' + user, false); // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
      var currentLvls = request.responseText;
      var lvlJson = JSON.parse(currentLvls);
      console.log(lvlJson);
      var splitLvlJson = splitIntoChunk(lvlJson, 3);
      console.log(splitLvlJson);
      document.getElementById("container").innerHTML = "";
      const container = document.getElementById("container");
      document.getElementById("title").innerText = user+"'s Clarity Workshop";
      container.innerHTML = `
      <div id="pinnedcontainer">

  
  
  
        </div>
        <p>Created Levels</p>
      </div>`
  
  
  
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
          <p>By {author}</p>
        </div>
      </div>`.replace("{level}", level["name"]).replace("{author}", level["author"]).replace("{levelId}", level["id"])
          newRow.innerHTML = newRow.innerHTML + newelem;
        })
        newRow.innerHTML = newRow.innerHTML + "</br>";
        container.appendChild(newRow);
      })
  
  
  
  
      // append pagination buttons (back, fwd, etc)
      container.innerHTML = container.innerHTML + `
      <center>
      <div id="pagination" class="w3-row-padding">
        <div class="button-62" style= "cursor: pointer;" id="back" onclick="window.location.href='https://discountdevs.github.io/Clarity/workshop.html'">
          <p>&lt; Back</p>
        </div>
      </div>
      </center>`
    }
  }
  
  
  
  
  function loadLevelById(id) {
    window.location.href = "https://discountdevs.github.io/Clarity/level.html?id=" + (id).toString();
  }