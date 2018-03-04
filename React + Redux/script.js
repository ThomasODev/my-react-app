/*
Ok first let's bring back all that Redux code from the [Redux pen](https://codepen.io/antishow/pen/OXqdBW), just without all the tutorial comments and UI stuff.
*/

//ACTIONS!
const SET_FILTER_MODE = 'SET_FILTER_MODE';
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const setFilterMode = filter => ({type: SET_FILTER_MODE, filter});
const addTodo = text => ({type: ADD_TODO, text});
const toggleTodo = index => ({type: TOGGLE_TODO, index});

//REDUCERS!
const filterReducer = (filter = 'show-all', action) => {
    switch (action.type) {
        case SET_FILTER_MODE:
            return action.filter;
            break;

        default:
            return filter;
    }
}

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

const reducers = Redux.combineReducers({
    filter: filterReducer,
    todos: todoReducer
});
let store = Redux.createStore(reducers);

/*
Bringing back that log function so the pen has a little more going on visually
*/
function log(string) {
    string = JSON.stringify(string, null, ' ');
    let output = document.getElementById('output');
    output.innerHTML = output.innerHTML + '<div>' + string + '</div>';
    output.scrollTop = output.scrollHeight;
}

log('--------------: Init! :---------------');
log(store.getState());
let unsub = store.subscribe(() => {
    log('---------: STATE CHANGED! :----------');
    log(store.getState());
});
store.dispatch(addTodo('Add another todo'));
/*
And now I'll paste in all the React components from the [React pen](https://codepen.io/antishow/pen/XKGRoG), but we need to make a few changes to account for the fact that now we're going to be able to click on things.

Like on the TodoInput component I'm add an 'onClickAdd' property and it will be a function that gets called when I click on the add button. I've also added an id to the text input so I can reference it easier.
*/
const TodoInput = ({onClickAdd}) => {
    return (
        <div className="todo-input">
            <input type="text" id="todo-text-input" placeholder="Enter a new todo"/>
            <button onClick={onClickAdd}>Add</button>
        </div>
    )
}
/*
FilterToggle also gets an onClick property, which is also just a function that'll get called when the button is clicked, with the filter value being passed in.
*/
const FilterToggle = ({filter, onClickFilterToggle}) => {
    let ret;

    switch (filter) {
        case 'show-all':
            ret = <button onClick={() => onClickFilterToggle('hide-completed')}
                          className="filter-toggle hide-completed">Hide Completed</button>;
            break;

        case 'hide-completed':
        default:
            ret = <button onClick={() => onClickFilterToggle('show-all')} className="filter-toggle show-all">Show
                All</button>;
            break;
    }

    return ret;
}
/*
Another click handler for the items on the todo list. Note that this time I'm passing the list item's index into the function.
*/
const TodoList = ({todos = [], filter, onClickListItem}) => {
    return (
        <ul className={['todo-list', filter].join(' ')}>
            {
                todos.map((todo, index) => {
                    let classes = ['todo-list-item'];

                    if (todo.complete) {
                        classes.push('complete');
                    }

                    return <li onClick={() => {
                        onClickListItem(index)
                    }} key={index} className={classes.join(' ')}>{todo.text}</li>;
                })
            }
        </ul>
    )
}
/*
And then my App component, which is pretty much the same except I'm passing the state into TodoInput now. I’m using the `{ ...state }` as a shortcut instead of typing out each attribute; this is a little wasteful I guess. In a real-world scenario I’d probably just explicitly set the attributes like `todos={ state.todos } filter={ state.filter }` instead.
*/
const TodoApp = state => {
    return (
        <div className="todo-list-app">
            <TodoList {...state} />
            <TodoInput {...state} />
            <FilterToggle {...state} />
        </div>
    );
}
/*
Before, we just passed the state into TodoApp as a property, like so:

#  let el = document.getElementById('main');
#  ReactDOM.render(<TodoApp state={ exampleState } />, el);

Now we're going to connect the React component to the Redux store. I'll grab a couple things from react-redux using this cool new destructuring syntax from es2015...
*/
const {connect, Provider} = ReactRedux;
/*
The connect function is what creates the map from our store to our React props. We just need to supply it with a couple of simple mapping functions to do the job. We already know the app state and the store state are the same thing, so we can just do a straight map from one to the other. This is a tutorial so to keep your mental burden low I’m going to write out the function like normal, but just know I *could* have said `const mapStateToProps = state => state;`
*/
const mapStateToProps = (state) => {
    return {
        todos: state.todos,
        filter: state.filter
    }
}
/*
And then for the dispatch mapping, we just write each of our functions to dispatch an action.
*/
const mapDispatchToProps = (dispatch) => {
    return {
        onClickAdd: () => {
            let text = document.getElementById('todo-text-input').value;
            if (text) {
                dispatch(addTodo(text));
            }
        },
        onClickFilterToggle: filter => dispatch(setFilterMode(filter)),
        onClickListItem: index => dispatch(toggleTodo(index))
    }
}
/*
Now I make a "Container" by passing my Component and these two mapping functions to connect()
*/
const TodoAppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoApp);
/*
Finally, Provider is a special React component from react-redux that will automatically pass the store down to its children. Very useful! All we have to do now is pass the store to the Provider and then put the app container in it.
*/
let el = document.getElementById('main');
ReactDOM.render(<Provider store={store}><TodoAppContainer/></Provider>, el);

