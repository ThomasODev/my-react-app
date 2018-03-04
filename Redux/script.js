/**
 Imagine you need to build a To-Do List. I can't really imagine why you'd need to do that, other than to demonstrate a javascript library, but still just imagine it. Before you can really start building your app, you have to think about the data that will drive that app. Or, in the case of our Functional Program, the State.

 In another pen (https://codepen.io/antishow/pen/XKGRoG), I've built an example To-Do wireframe out of dummy React JS components that are controlled by a simple JSON blob that looks like this:

 #  const exampleState = {
#    todos: [
#      { text: 'Item 1', complete: false },
#      { text: 'Item 2', complete: false }
#    ],
#    filter: 'show-all'
#  };

 Even without looking at an interface, it's pretty easy to imagine one for a state like this. You've got a list of "todos", each of which is complete or not and has a title, a filter that can hide the completed todos, and a form to enter a new todo. React is great at taking data like this and rendering it to the DOM, but it needs another library to handle changing state. This is where Redux comes in.

 Redux boils down to three key parts:
 • The Store
 • Actions
 • Reducers

 These three core concepts from the Redux documentation put it pretty succintly:

 The STATE of your whole application is stored in an object tree within a single STORE.

 The only way to change the state is to emit an ACTION, an object describing what happened.

 To specify how the state tree is transformed by ACTIONS, you write pure REDUCERS.

 We've already seen the concept of state-driven view in the other pen. In *this* pen, I'll show you how to use Actions and Reducers to modify the Store (where the State is kept). Then, in a third pen, we will connect the two parts together with the aptly named package: react-redux.

 So first, Actions. These are simply a predetermined list of things we can do in our app. In this case we can do the following things: "Set the Filter Mode", "Add a new Todo", and "Toggle an Existing Todo". So to start, let's just define a few constants…
 */
const SET_FILTER_MODE = 'SET_FILTER_MODE';
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
/*
Like the documentation says, these are simply objects *describing* actions. As in, simple object literals, like here are examples of the actions we want:

#  { type: SET_FILTER_MODE, filter: 'show-all' }
#  { type: ADD_TODO: text: 'This is a new todo!' }
#  { type: TOGGLE_TODO: index: 0 }

The constants are simply a useful convention to use for type simply because a typo in a variable is a lot easier to catch than one in a string. You're not *required* to do it that way.

Next I'll define functions to generate these Actions:
*/
const setFilterMode = filter => ({type: SET_FILTER_MODE, filter});
const addTodo = text => ({type: ADD_TODO, text});
const toggleTodo = index => ({type: TOGGLE_TODO, index});
/*
If I were to call setFilterMode('hide-completed') it would just return:

#  { type: SET_FILTER_MODE, filter: 'hide-completed' }

Once our store is generated we can pass an action like this into store.dispatch() to get a new state, but to do that we need to define how the SET_FILTER_MODE action modifies the state. This is done with Reducers, which are functions that take a state and an action, and return a new state.

Our state had two properties, filter and todos, so we'll make a reducer for each. First I'll do the one for filter.
*/
const filterReducer = (filter = 'show-all', action) => {
    switch (action.type) {
        case SET_FILTER_MODE:
            return action.filter;
            break;

        default:
            return filter;
    }
}
/*
And then todos. Note here how I'm always returning a new array, not modifying the state array.
*/
const todoReducer = (todos = [], action) => {
    switch (action.type) {
        case ADD_TODO:
            return [...todos, {text: action.text, complete: false}]
            break;

        case TOGGLE_TODO:
            return todos.map((todo, i) => {
                if (i === action.index) {
                    return Object.assign({}, todo, {
                        complete: !todo.complete
                    })
                }
                return todo
            })
            break;

        default:
            return todos;
    }
}
/*
Now I combine my reducers together to make my store!
*/
const reducers = Redux.combineReducers({
    filter: filterReducer,
    todos: todoReducer
});
let store = Redux.createStore(reducers);

/*
Here's a function so I can log to the HTML area...
*/
function log(string) {
    string = JSON.stringify(string, null, ' ');
    let output = document.getElementById('output');
    output.innerHTML = output.innerHTML + '<div>' + string + '</div>';
    output.scrollTop = output.scrollHeight;
}

/*
First we'll show the default state, then subscribe to updates.
*/
log('--------------: Init! :---------------');
log(store.getState());

let unsub = store.subscribe(() => {
    log('---------: STATE CHANGED! :----------');
    log(store.getState());
});
/*
Now I'll dispatch an action into the store.
*/
store.dispatch(addTodo('This is a new todo'));

/*
And then here are a few more example actions that'll get dispatched when you click the buttons in the HTML area
*/
const exampleFilterToggle = () => {
    let state = store.getState();
    let filter = 'show-all';
    if (state.filter === filter) {
        filter = 'hide-completed';
    }

    store.dispatch(setFilterMode(filter));
}

const exampleToggleTodo = () => {
    store.dispatch(toggleTodo(0));
}

const exampleAddTodo = () => {
    store.dispatch(addTodo('Another new todo!'));
}

/*
Finally in the next part I'll go over how to use react-redux to make a bridge between this code and the React code. https://codepen.io/antishow/pen/WxWZak
*/