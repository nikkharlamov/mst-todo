import React, { Fragment } from 'react';
import { types, getRoot, destroy } from 'mobx-state-tree';

import { observer } from 'mobx-react';
import { values } from 'mobx';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from './constants';

const App = () => {
    const randomId = () => Math.floor(Math.random() * 1000).toString(36);

    const TODO_FILTERS = {
        [SHOW_ALL]: () => true,
        [SHOW_ACTIVE]: todo => !todo.done,
        [SHOW_COMPLETED]: todo => todo.done
    };

    const Todo = types
        .model({
            id: types.identifier,
            name: types.optional(types.string, ''),
            done: types.optional(types.boolean, false),
            user: types.maybe(types.reference(types.late(() => User)))
        })
        .actions(self => {
            function setName(newName) {
                self.name = newName;
            }
            function remove() {
                getRoot(self).removeTodo(self);
            }
            function setUser(user) {
                if (user === '') {
                    self.user = null;
                } else {
                    self.user = user;
                }
            }
            function toggle() {
                self.done = !self.done;
            }

            return { setName, setUser, toggle, remove };
        });

    const User = types.model({
        id: types.identifier,
        name: types.optional(types.string, '')
    });

    const RootStore = types
        .model({
            users: types.map(User),
            todos: types.map(Todo),
            filter: types.optional(types.string, SHOW_ALL)
        })
        .views(self => ({
            get pendingCount() {
                return values(self.todos).filter(todo => !todo.done).length;
            },
            get completedCount() {
                return values(self.todos).filter(todo => todo.done).length;
            },
            get completedAllCheck() {
              console.log('object')
                return values(self.todos).every(todo => todo.done === true);
            }
            // get completedTodos(){
            //   return self.todos.filter(todo => todo.done)
            // },
            // getTodosWhereDoneIs(done) {
            //     return values(self.todos).filter(todo => todo.done === done);
            // }
        }))
        .actions(self => {
            function addTodo(id, name) {
                self.todos.set(id, Todo.create({ id, name }));
            }

            function removeTodo(todo) {
                destroy(todo);
            }
            function completeAll() {
                const areAllMarked = values(self.todos).every(todo => todo.done === true);
                console.log(areAllMarked);
                self.todos.forEach(todo => (todo.done = !areAllMarked));
            }
            function clearCompleted() {
                values(self.todos)
                    .filter(todo => todo.done === false)
                    .map(todo => console.log(todo.done));
                self.todos.replace(values(self.todos).filter(todo => todo.done === false));
            }
            function setFilter(filter) {
                self.filter = filter;
            }

            return { addTodo, removeTodo, completeAll, clearCompleted, setFilter };
        });

    const store = RootStore.create({
        users: {
            1: {
                id: '1',
                name: 'mweststrate'
            },
            2: {
                id: '2',
                name: 'mattiamanzati'
            },
            3: {
                id: '3',
                name: 'johndoe'
            }
        },
        todos: {
            1: {
                id: '1',
                name: 'Eat a cake',
                done: true
            }
        }
    });

    const UserPickerView = observer(props => (
        <select
            className="h-6 w-2/6 bg-gray-200"
            value={props.user ? props.user.id : ''}
            onChange={e => props.onChange(e.target.value)}
        >
            <option value="">-none-</option>
            {values(props.store.users).map(user => (
                <option key={user.id} value={user.id}>
                    {user.name}
                </option>
            ))}
        </select>
    ));

    const TodoView = observer(props => (
        <div className="flex items-center mb-2 mx-2  bg-gray-200">
            <div className="w-8 bg-blue-200 ">
                <input className="" type="checkbox" checked={props.todo.done} onChange={e => props.todo.toggle()} />
            </div>

            <button
                className="w-8 bg-red-600 hover:bg-red-500 focus:outline-none active:bg-red-900 rounded"
                onClick={e => props.todo.remove()}
            >
                &times;
            </button>

            <input
                className="w-4/6"
                type="text"
                value={props.todo.name}
                onChange={e => props.todo.setName(e.target.value)}
            />

            <UserPickerView
                user={props.todo.user}
                store={props.store}
                onChange={userId => props.todo.setUser(userId)}
            />
        </div>
    ));

    const TodoCounterView = observer(props => (
        <div className="flex mx-2">
            <span className="w-3/6 text-center">{props.store.pendingCount} pending</span>
            <span className="w-3/6 text-center">{props.store.completedCount} completed</span>
        </div>
    ));

    const AppView = observer(props => (
        <div className="flex flex-col w-10/12 md:w-5/12 mx-auto pt-4 bg-blue-200 rounded-md">
            <span className="text-center mb-2">TODO</span>
            {values(props.store.todos)
                .filter(TODO_FILTERS[props.store.filter])
                .map(todo => (
                    <Fragment key={todo.id}>
                        <TodoView store={props.store} todo={todo} />
                    </Fragment>
                ))}

            <button
                className="bg-green-400 w-2/6 mx-auto rounded focus:outline-none hover:bg-green-300 active:bg-green-500"
                onClick={e => props.store.addTodo(randomId(), 'New Task')}
            >
                Add Task
            </button>
            <div className="w-4/6 mx-auto mt-5">
                <button
                    className={`bg-green-400 w-3/6 rounded focus:outline-none hover:bg-green-300 active:bg-green-50`}
                    onClick={e => props.store.completeAll()}
                    disabled={props.store.completedAllCheck}
                >
                    All done
                </button>
                <button
                    className="bg-green-400 w-3/6 rounded focus:outline-none hover:bg-green-300 active:bg-green-500"
                    onClick={e => props.store.clearCompleted()}
                >
                    Clear done
                </button>
            </div>

            <div className="w-4/6 mx-auto mt-1">
                <button
                    className="bg-green-400 w-4/12  rounded focus:outline-none hover:bg-green-300 active:bg-green-500"
                    onClick={e => props.store.setFilter(SHOW_ALL)}
                >
                    All
                </button>
                <button
                    className="bg-green-400 w-4/12    justify-between  rounded focus:outline-none hover:bg-green-300 active:bg-green-500"
                    onClick={e => props.store.setFilter(SHOW_ACTIVE)}
                >
                    Active
                </button>
                <button
                    className="bg-green-400  w-4/12     rounded focus:outline-none hover:bg-green-300 active:bg-green-500"
                    onClick={e => props.store.setFilter(SHOW_COMPLETED)}
                >
                    Complet
                </button>
            </div>

            <TodoCounterView store={props.store} />
        </div>
    ));

    return <AppView store={store} />;
};

export default App;
