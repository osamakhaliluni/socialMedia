var container = document.getElementById("container");
var postContainer = document.getElementById("post-container");
const baseUrl = "https://tarmeezacademy.com/api/v1";

function getHeader(element) {
  var header = document.createElement("div");
  header.classList.add("header");
  var pic = document.createElement("div");
  pic.classList.add("pic");
  var img = document.createElement("img");
  img.setAttribute("src", "images/pic.png");
  if (Object.keys(element.author.profile_image).length > 0) {
    img.setAttribute("src", element.author.profile_image);
  }
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
  if (Object.keys(element.image).length > 0) {
    img2.setAttribute("src", element.image);
  }
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
          ${e.name}
      </div>
    `;
  });
  return comm;
}

let currentPage = 1;
let lastPage = 1;
let postId;

window.addEventListener("load", ()=>{
  if (!window.location.toString().includes("post.html")) {
    container.innerHTML = "";
    getReq(currentPage);
  }
  else{
    postId = window.location.search.split("=")[1];
    getPost(1);
  }
})

window.addEventListener("scroll", async() => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight -2;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    getReq(currentPage);
    await delay(2000);
  }
});

function getPost(id){
  var request = new XMLHttpRequest();
  console.log(`${baseUrl}/posts/${id}`);
  request.open("GET", `${baseUrl}/posts/${id}`);
  request.send();
  request.onload = function () {
    if (request.status >= 200 && request.status < 300) {
      postContainer.innerHTML = "";
      var data = JSON.parse(this.response);
        var card = document.createElement("div");
        card.classList.add("card");
        card.appendChild(getHeader(data.data));

        card.appendChild(getImage(data.data));
        var text = document.createElement("div");
        text.classList.add("text");
        text.innerHTML = data.data.body;
        var hr = document.createElement("hr");
        card.appendChild(text);
        card.appendChild(hr);

        card.appendChild(getComm(data.data));
        postContainer.appendChild(card);
        console.log(data.data.comments);

        var commContainer = document.createElement("div");
        commContainer.id = "comm-container";
        data.data.comments.forEach((element)=>{
          commContainer.innerHTML += `
          <div class="comm">
            <div class="comm-header">
              <img src="images/pic.png" alt="" />
              <h2>${element.author.name}</h2>
            </div>
            <p>
              ${element.body}
            </p>
          </div>
          `;
        });
        postContainer.appendChild(commContainer);
    } else {
      console.log(request.response.message);
    }
    if (localStorage.getItem("token") != null) {
      handleLogin(localStorage.getItem("user"));
    }
  };
}

function showPost(id) {
  window.location = `post.html?post=${id}`;
}

function getReq(currentPage) {
  var request = new XMLHttpRequest();
  console.log(`${baseUrl}/posts?limit=10&page=${currentPage}`);
  request.open("GET", `${baseUrl}/posts?limit=10&page=${currentPage}`);
  request.send();
  request.onload = function () {
    if (request.status >= 200 && request.status < 300) {
      var data = JSON.parse(this.response);
      lastPage = data.meta.last_page;
      data.data.forEach((element) => {
        var card = document.createElement("div");
        card.id = element.id;
        postId = element.id;
        card.style.cursor = "pointer";
        card.classList.add("card");
        card.addEventListener("click", () => showPost(postId));
        card.appendChild(getHeader(element));

        card.appendChild(getImage(element));
        var text = document.createElement("div");
        text.classList.add("text");
        text.innerHTML = element.body;
        var hr = document.createElement("hr");
        card.appendChild(text);
        card.appendChild(hr);

        card.appendChild(getComm(element));
        container.appendChild(card);
      });
    } else {
      console.log(request.response.message);
    }
    if (localStorage.getItem("token") != null) {
      handleLogin(localStorage.getItem("user"));
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
  var image = document.getElementById("userImage").files[0];
  if (userName != "" && pass.length >= 6 && name != "" && email != "") {
    var request = new XMLHttpRequest();
    request.open("POST", `${baseUrl}/register`);
    request.setRequestHeader("Accept", "application/json");
    request.responseType = "json";
    let formData = new FormData();
    formData.append("username", userName);
    formData.append("password", pass);
    formData.append("name", name);
    formData.append("email", email);
    if (image) {
      formData.append("image", image);
    }
    request.send(formData);
    request.onload = async function () {
      console.log(request.response);
      if (request.status >= 200 && request.status < 300) {
        localStorage.setItem("token", request.response.token);
        localStorage.setItem("user", JSON.stringify(request.response.user));
        console.log(request.response);
        var modal = document.getElementById("modal");
        modal.style.minHeight = "100px";
        modal.innerHTML = `
                  <div id="header">register success</div>
                  `;
        await delay(2000);
        handleBack();
        handleLogin(localStorage.getItem("user"));
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
  if (userName != "" && pass.length >= 6) {
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
        localStorage.setItem("user", JSON.stringify(request.response.user));
        var modal = document.getElementById("modal");
        modal.style.minHeight = "100px";
        modal.innerHTML = `
                  <div id="header">login success</div>
                  `;
        await delay(2000);
        handleBack();
        handleLogin(localStorage.getItem("user"));
      } else {
        alert(request.response.message);
      }
    };
  } else {
    alert("missing username or password");
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleLogin(element) {
  var item = JSON.parse(element);
  var btn = document.getElementById("nav-btn");
  btn.innerHTML = `
        <button id="logout" onclick="logout()" class="button">logout</button>
        <img src="images/pic.png" alt="" id="user-pic">
        <h5>@${item.username}</h5>
        `;
  if (Object.keys(item.profile_image).length > 0) {
    document.getElementById("user-pic").src = item.profile_image;
  }
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
    formData.append("title", title);
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
