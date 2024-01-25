import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getFirestore,
  onSnapshot,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCXe1Xbm6amKNwBEC0EUOQYfrnqfHmGXVk",
    authDomain: "huzaifa-todo-app.firebaseapp.com",
    projectId: "huzaifa-todo-app",
    storageBucket: "huzaifa-todo-app.appspot.com",
    messagingSenderId: "468451743408",
    appId: "1:468451743408:web:014a2775f76c316b3b4d75",
    measurementId: "G-21DT4JBH7Y"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addData = document.getElementById("addData");
const deleteAll = document.getElementById("deleteAll");
const todoInput = document.getElementById("newTodo");
const blogList = document.getElementById("blogList");

const addDataInFirestore = async () => {
  const inputVal = todoInput.value.trim(); // Trim leading and trailing whitespaces

  // Check if the todo is not blank
  if (inputVal !== "") {
    const id = new Date().getTime();
    const payload = {
      id,
      todo: inputVal,
      timestamp: id,
    };

    // Assuming db and setDoc are defined appropriately
    await setDoc(doc(db, "todos", `${id}`), payload);

    // Clear the input after adding data to Firestore
    todoInput.value = "";
  } else {
    // Handle the case where the todo is blank, e.g., show an error message
    // console.error("Cannot add a blank todo.");
    alert("Todo Input is Empty");
    // You may also display an error message to the user or take other appropriate actions.
  }
};

const updateDataInFirestore = async (id, newValue) => {
  await updateDoc(doc(db, "todos", id), { todo: newValue });
};

const deleteDataInFirestore = async (id) => {
  await deleteDoc(doc(db, "todos", id));
};

const deleteAllDataInFirestore = async () => {
  const confirmDeleteAll = confirm(
    "Are you sure you want to delete all todos?"
  );
  if (confirmDeleteAll) {
    const q = query(collection(db, "todos"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
};

const renderList = (data) => {
  return data
    .map(
      (todoObj) => `

        <li>
        <div class="List-container">
        <span class="list-item">${todoObj.todo}</span>
        <button class="edit" data-id="${todoObj.id}">Edit</button>
        <button class="deleteBtn red" data-id="${todoObj.id}">Delete</button>
        </div>
        </li>
      <hr>
      `
    )
    .join("");
};

const getDataInRealTime = async () => {
  let item = "";
  const q = query(collection(db, "todos"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    item = renderList(todos);
    blogList.innerHTML = item;

    // Add event listeners after rendering the list
    addEventListeners();
  });
};

function addEventListeners() {
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".deleteBtn");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      const currentTodo = prompt("Edit the todo:", "");
      if (currentTodo !== null) {
        updateDataInFirestore(id, currentTodo);
      }
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      const confirmDelete = confirm(
        "Are you sure you want to delete this todo?"
      );
      if (confirmDelete) {
        deleteDataInFirestore(id);
      }
    });
  });
}

getDataInRealTime();

addData.addEventListener("click", addDataInFirestore);
deleteAll.addEventListener("click", deleteAllDataInFirestore);
