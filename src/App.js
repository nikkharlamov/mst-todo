import React from 'react';

import { types, getRoot, destroy } from 'mobx-state-tree';
import { values } from 'mobx';
import { SHOW_ALL } from './constants';

import { AppView } from './components/AppView';

const App = () => {
    const Todo = types
        .model({
            id: types.identifier,
            name: types.optional(types.string, ''),
            isDone: types.optional(types.boolean, false),
            user: types.maybe(types.reference(types.late(() => User)))
        })
        .actions(self => ({
            setName(newName) {
                self.name = newName;
            },
            remove() {
                getRoot(self).removeTodo(self);
            },
            setUser(user) {
                if (user === '') {
                    self.user = null;
                } else {
                    self.user = user;
                }
            },
            toggle() {
                self.isDone = !self.isDone;
            }
        }));

    const User = types.model({
        id: types.identifier,
        name: types.optional(types.string, '')
    });

    const RootStore = types
        .model({
            users: types.map(User),
            todos: types.array(Todo),
            filter: types.optional(types.string, SHOW_ALL)
        })
        .views(self => ({
            get pendingCount() {
                return values(self.todos).filter(todo => !todo.isDone).length;
            },
            get completedCount() {
                return values(self.todos).filter(todo => todo.isDone).length;
            },
            get completedAllCheck() {
                return values(self.todos).every(todo => todo.isDone === true);
            }
        }))
        .actions(self => ({
            addTodo(name) {
                const id = Math.floor(Math.random() * 1000).toString(36);

                self.todos.unshift({ id, name });
            },

            removeTodo(todo) {
                destroy(todo);
            },
            completeAll() {
                const areAllMarked = values(self.todos).every(todo => todo.isDone === true);
                console.log(areAllMarked);
                self.todos.forEach(todo => (todo.isDone = !areAllMarked));
            },
            clearCompleted() {
                self.todos.replace(self.todos.filter(todo => !todo.isDone));
            },
            setFilter(filter) {
                self.filter = filter;
            }
        }));

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
        todos: [
            {
                id: '1',
                name: 'Eat a cake',
                isDone: true
            }
        ]
    });

    return <AppView store={store} />;
};

export default App;
