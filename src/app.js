document.getElementById("myForm").addEventListener("submit", saveBookmark);

document.querySelector(".col-lg-12").addEventListener("click", function(e) {
  const ui = new UI();
  ui.deleteItem(e.target);
  Store.deleteBookmarkFromStorage(
    e.target.previousElementSibling.previousElementSibling.textContent
  );
  ui.showAlert("You deleted a bookmark", "alert alert-success");
  e.preventDefault();
});

class Bookmark {
  constructor(siteName, siteUrl) {
    this.siteName = siteName;
    this.siteUrl = siteUrl;
  }
}

class UI {
  constructor() {
    this.siteName = document.getElementById("siteName");
    this.siteUrl = document.getElementById("siteUrl");
    this.bookmarksResults = document.getElementById("bookmarksResults");
  }

  showAlert(message, className) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(message));
    div.className = className;
    const container = document.querySelector(".container");
    const bookmarkCard = document.getElementById("bookmarkCard");
    container.insertBefore(div, bookmarkCard);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  showBookmark(bookmark) {
    const div = document.createElement("div");
    div.className = "card-body";
    div.innerHTML = `
    <h3 class="inline-block">${bookmark.siteName}</h3>
    <a class="btn btn-primary" target="_blank" 
    href=${bookmark.siteUrl}>Visit</a>
    <a class="btn btn-danger" href="#">Delete</a>
    
     `;
    const results = this.bookmarksResults;
    results.appendChild(div);
  }

  clearInput() {
    this.siteName.value = "";
    this.siteUrl.value = "";
  }

  deleteItem(target) {
    if (target.className === "btn btn-danger") {
      target.parentElement.remove();
    }
  }
}

class Store {
  static getBookmarks() {
    let bookmarks;
    if (localStorage.getItem("bookmarks") === null) {
      bookmarks = [];
    } else {
      bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    }
    return bookmarks;
  }

  //Show bookmarks in UI
  static displayBookmarks() {
    const bookmarks = Store.getBookmarks();
    bookmarks.forEach(function(bookmark) {
      const ui = new UI();

      ui.showBookmark(bookmark);
    });
  }

  //Add bookmark to storage
  static addBookmarkToStorage(bookmark) {
    const bookmarks = Store.getBookmarks();

    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  //Delete bookmark from storage
  static deleteBookmarkFromStorage(siteName) {
    const bookmarks = Store.getBookmarks();

    bookmarks.forEach(function(bookmark, index) {
      if (bookmark.siteName === siteName) {
        bookmarks.splice(index, 1);
      }
    });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
}

document.addEventListener("DOMContentLoaded", Store.displayBookmarks);

function saveBookmark(e) {
  const siteName = document.getElementById("siteName").value;
  const siteUrl = document.getElementById("siteUrl").value;

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  const bookmark = new Bookmark(siteName, siteUrl);
  const ui = new UI();

  if (siteName === "" || siteUrl === "") {
    ui.showAlert("Please fill in all the fields", "alert alert-danger");
  } else if (!siteUrl.match(regex)) {
    ui.showAlert("Please type in valid url form", "alert alert-danger");
  } else {
    ui.showBookmark(bookmark);
    Store.addBookmarkToStorage(bookmark);
    ui.showAlert("You added a new bookmark", "alert alert-success");
    ui.clearInput();
  }
  e.preventDefault();
}
