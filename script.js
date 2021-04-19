const addForm = document.querySelector(".addTodo")
const todoList = document.querySelector(".todoList")
const controlItems = document.querySelectorAll(".controlsItem")

var filtering = "all"

var todos = JSON.parse(localStorage.getItem('todos')) || []

var sortable = Sortable.create(todoList, {
    animation: 100,
    onSort: function(e) {
        var items = e.to.children;
        var newTodoList = []
        for (var i= 0; i<items.length; i++){
            newTodoList.push({
                text: items[i].innerText,
                done: items[i].children[0].checked 
             }
            )
        }
        localStorage.setItem('todos', JSON.stringify(newTodoList))
        todos = JSON.parse(localStorage.getItem('todos'))
        }}
)

function remove(index){
    todos.splice(index, 1)
    localStorage.setItem("todos", JSON.stringify(todos))
    populateList(todos, todoList, filtering)
}

function clearCompleted(){
    const newArr = todos.filter(e=>!e.done)
    localStorage.setItem("todos", JSON.stringify(newArr))
    todos = JSON.parse(localStorage.getItem('todos'))
    populateList(newArr, todoList, 'all')
}

function addTodo(event){
    event.preventDefault();
    const text = (this.querySelector('[name=todo]')).value;
    const item = {
        text,
        done: false
    }
    this.reset();
    todos.push(item);
    localStorage.setItem("todos", JSON.stringify(todos))

    populateList(todos, todoList, filtering)
    
}

function populateList(todos, element, filter){
    var listToShow = []
    const counter = document.querySelector('span')
    
    switch (filter) {
        case 'active':
            { listToShow=todos.filter(e=>!e.done)} 
        break;
        case 'completed':
            { listToShow=todos.filter(e=>e.done)}
        break;
        case 'all':
            { listToShow=todos }

    }
    
    counter.innerHTML = listToShow.length.toString() + " "
    element.innerHTML = listToShow.map((e, i) => {
            return `
            <li class="todoListItem" draggable="true"> 
             <div class="itemLabel">
            <input type="checkbox" data-index=${i} id="item${i}" ${ e.done? 'checked' : ''}>
            <label for="item${i}" class=${e.done ? 'selected' : ''}>${e.text}</label>
            </div>
            <div class="cross" onclick="remove(${i})">
            <img src="images/icon-cross.svg">
            </div>
            </li>
            `
        }).join('');
        
        
}

function handleControls(e){
    filtering = e.target.id;
    e.target.style.color = "hsl(220, 98%, 61%)";
    
    controlItems.forEach(el => {
        if(el.id!==e.target.id){
            el.style.color="hsl(234, 11%, 52%)"}
        } 
        )
    todos = JSON.parse(localStorage.getItem('todos'))     
   populateList(todos, todoList, filtering)
   
  }

function toggleDone(e){
    if (!e.target.matches('input')) return;
    const element = e.target
    const index = element.dataset.index
    todos[index].done = !todos[index].done
    localStorage.setItem('todos', JSON.stringify(todos))
    const items = document.querySelectorAll('.todoListItem')
    
    todos.forEach((todo, index) => {
        if(todo.done){
            items[index].children[0].classList.add("selected")    
        } else{
        items[index].children[0].classList.remove("selected")
    }}) 
    
    
}
function toggleTheme(){
    const styleLink = document.querySelector("#styleLink")
    if (styleLink.getAttribute("href") == "light.css") {
         styleLink.href = "styles.css";
       } else {        
        styleLink.href = "light.css";
      }
}

addForm.addEventListener('submit', addTodo)
controlItems.forEach(e => e.addEventListener("click", handleControls))
todoList.addEventListener('click', toggleDone)
populateList(todos, todoList, "all")

