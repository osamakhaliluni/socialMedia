var container = document.getElementById("container");
const baseUrl = "https://tarmeezacademy.com/api/v1";

getReq();

function getHeader(element) {
  var header = document.createElement("div");
  header.classList.add("header");
  var pic = document.createElement("div");
  pic.classList.add("pic");
  var img = document.createElement("img");
  img.setAttribute("src", element.author.profile_image);
  var h3 = document.createElement("h3");
  h3.textContent = element.author.username;
  pic.appendChild(img);
  header.appendChild(pic);
  header.appendChild(h3);
  return header;
}

function getImage(element) {
  var image = document.createElement("div");
  image.classList.add("image");
  var img2 = document.createElement("img");
  img2.setAttribute("src", element.image);
  var p = document.createElement("p");
  p.classList.add("time");
  p.innerHTML = element.created_at;
  image.appendChild(img2);
  image.appendChild(p);
  return image;
}

function getComm(element) {
  var comm = document.createElement("div");
  comm.classList.add("comments");
  var img3 = document.createElement("img");
  img3.setAttribute("src", "images/pen-solid.svg");
  comm.appendChild(img3);
  var p1 = document.createElement("p");
  p1.innerHTML = element.comments_count + " comments";
  comm.appendChild(p1);
  element.tags.forEach((e) => {
    comm.innerHTML += `
      <div class="tag">
          ${e}
      </div>
    `;
  });
  return comm;
}

function getReq() {
  var request = new XMLHttpRequest();
  request.open("GET", `${baseUrl}/posts`);
  request.send();
  container.innerHTML = "Loading...";
  request.onload = function () {
    if (request.status >= 200 && request.status < 300) {
      var data = JSON.parse(this.response);
      container.innerHTML = "";
      data.data.forEach((element) => {
        var card = document.createElement("div");
        card.classList.add("card");
        card.appendChild(getHeader(element));

        container.appendChild(card);

        card.appendChild(getImage(element));
        var text = document.createElement("div");
        text.classList.add("text");
        text.innerHTML = element.body;
        var hr = document.createElement("hr");
        card.appendChild(text);
        card.appendChild(hr);

        card.appendChild(getComm(element));
      });
    }
    if (localStorage.getItem("token") != null) {
      handleLogin();
    }
  };
}

function loginClick() {
  document.getElementsByTagName("body")[0].style.height = "100vh";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  document.getElementsByTagName("body")[0].innerHTML += `
    <div class="modalCont" id="modalCont">
        <div id="modal">
            <div id="header">login</div>
                <div class="input">
                    <input type="text" name="userName" id="userName" placeholder="User Name">
                </div>
                <div class="input">
                    <input type="password" name="pass" id="pass" placeholder="Password">
                </div>
                <div class="btn">
                    <button class="button" onclick="login()">login</button>
                    <button class="button" style="background-color: gray;" onclick="handleBack()">back</button>
                </div>
            </div>
        </div>
    `;
  requestAnimationFrame(() => {
    document.getElementById("modal").classList.add("modal");
  });
}

function handleBack() {
  document.getElementsByTagName("body")[0].style.height = "auto";
  document.getElementsByTagName("body")[0].style.overflow = "scroll";
  document.getElementById("modalCont").classList.add("hide");
  document.getElementById("modalCont").addEventListener("transitionend", () => {
    document.getElementById("modalCont").remove();
  });
}

function regClick() {
  document.getElementsByTagName("body")[0].style.height = "100vh";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  document.getElementsByTagName("body")[0].innerHTML += `
    <div class="modalCont" id="modalCont">
        <div id="modal">
            <div id="header">Register</div>
                <div class="input">
                    <input type="text" name="userName" id="regUserName" placeholder="User Name">
                </div>
                <div class="input">
                    <input type="password" name="pass" id="regPass" placeholder="Password">
                </div>
                <div class="input">
                    <input type="text" name="name" id="name" placeholder="Name">
                </div>
                <div class="input">
                    <input type="text" id="email" placeholder="Email">
                </div>
                <div class="input">
                    <input type="file" src="" alt="" id="userImage"> 
                </div>
                <div class="btn">
                    <button class="button" onclick="register()">register</button>
                    <button class="button" style="background-color: gray;" onClick="handleBack()">back</button>
                </div>
            </div>
        </div>
    `;
  requestAnimationFrame(() => {
    document.getElementById("modal").classList.add("modal");
  });
}

function register() {
  var userName = document.getElementById("regUserName").value;
  var pass = document.getElementById("regPass").value;
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  if (userName != "" && pass.length >= 6 && name != "" && email != "") {
    var request = new XMLHttpRequest();
    request.open("POST", `${baseUrl}/register`);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Accept", "application/json");
    request.responseType = "json";
    let body = {
      username: userName,
      password: pass,
      name: name,
      email: email,
    };
    request.send(JSON.stringify(body));
    request.onload = async function () {
      console.log(request.response);
      if (request.status >= 200 && request.status < 300) {
        localStorage.setItem("token", request.response.token);
        console.log(request.response);
        var modal = document.getElementById("modal");
        modal.style.minHeight = "100px";
        modal.innerHTML = `
                  <div id="header">register success</div>
                  `;
        await delay(2000);
        handleBack();
        handleLogin();
      } else {
        alert(request.response.message);
      }
    };
  } else {
    alert("missing data");
  }
}
function login() {
  var userName = document.getElementById("userName").value;
  var pass = document.getElementById("pass").value;
  if (userName != "" && pass.length > 6) {
    var request = new XMLHttpRequest();
    request.open("POST", `${baseUrl}/login`);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Accept", "application/json");
    request.responseType = "json";
    let body = {
      username: userName,
      password: pass,
    };
    request.send(JSON.stringify(body));
    request.onload = async function () {
      if (request.status >= 200 && request.status < 300) {
        localStorage.setItem("token", request.response.token);
        console.log(request.response.token);
        var modal = document.getElementById("modal");
        modal.style.minHeight = "100px";
        modal.innerHTML = `
                  <div id="header">login success</div>
                  `;
        await delay(2000);
        handleBack();
        handleLogin();
      }
    };
  } else {
    alert("missing username or password");
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleLogin() {
  var btn = document.getElementById("nav-btn");
  btn.innerHTML = `
        <button id="logout" onclick="logout()" class="button">logout</button>
        `;
  document.getElementsByTagName("body")[0].innerHTML += `
    <div onclick="addPost()" class="add">
      <img src="images/plus-solid.svg" alt="">
    </div>
    `;
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

function addPost() {
  document.getElementsByTagName("body")[0].style.height = "100vh";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  document.getElementsByTagName("body")[0].innerHTML += `
    <div class="modalCont" id="modalCont">
        <div id="modal">
            <div id="header">Add Post</div>
                <div class="input">
                    <input type="text" id="title" placeholder="Title">
                </div>
                <div class="input">
                    <textarea id="body" placeholder="Body"></textarea>
                </div>
                <div class="input">
                    <input type="file" id="postImage" placeholder="Image">
                </div>
                <div class="btn">
                    <button class="button" onclick="createPost()">Create</button>
                    <button class="button" style="background-color: gray;" onClick="handleBack()">back</button>
                </div>
            </div>
        </div>
    `;
  requestAnimationFrame(() => {
    document.getElementById("modal").classList.add("modal");
  });
}

function createPost() {
  var title = document.getElementById("title").value;
  var body = document.getElementById("body").value;
  var image = document.getElementById("postImage").files[0];

  if (title != "" && body != "") {
    var request = new XMLHttpRequest();
    request.open("POST", `${baseUrl}/posts`);
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader(
      "authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    request.responseType = "json";

    let formData = new FormData();
    formData.append("body", body);
    if (image) {
      formData.append("image", image);
    }

    request.send(formData);
    request.onload = async function () {
      console.log(request.response);
      console.log(request.status);
      if (request.status >= 200 && request.status < 300) {
        var modal = document.getElementById("modal");
        modal.style.minHeight = "100px";
        modal.innerHTML = `
                  <div id="header">Created Post</div>
                  `;
        await delay(2000);
        handleBack();
        location.reload();
      } else {
        alert(request.response.message);
      }
    };
  } else {
    alert("missing fields");
  }
}
