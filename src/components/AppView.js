import React, { Fragment, useState } from 'react';

import { observer } from 'mobx-react';
import { values } from 'mobx';

import { TODO_FILTERS, TITLE_FILTERS } from '../constants';
import { TodoView } from './TodoView';
import { TodoCounterView } from './TodoCounterView';

export const AppView = observer(props => {
    const [valueTodo, setValueTodo] = useState('');
    const allDone = props.store.completedAllCheck;

    const addTask = e => {
        if (valueTodo.trim() && e.key === 'Enter') {
            props.store.addTodo(valueTodo);
            setValueTodo('');
        }
    };
    const isClear = Boolean(props.store.completedCount);
    return (
        <div>
            <div className="flex flex-col w-full md:w-3/12 mx-auto pt-4 bg-body z-50 ">
                <span className="text-center mb-2 text-bd text-8xl opacity-50">todos</span>
                <div className="border border-gray-200 shadow-xl border-t-0">
                    <div className="flex w-full h-10  border-b-2 border-border-todo">
                        <button
                            className="w-1/12 focus:outline-none bg-white border-none pl-2 hover:text-red-800 "
                            onClick={e => props.store.completeAll()}
                            style={{ color: !allDone && '#b6b8bb' }}
                        >
                            &#10004;
                        </button>
                        <input
                            className="w-11/12 focus:outline-none text-texta"
                            type="text"
                            value={valueTodo}
                            onKeyDown={addTask}
                            onChange={e => setValueTodo(e.target.value)}
                        />
                    </div>
                    {values(props.store.todos)
                        .filter(TODO_FILTERS[props.store.filter])
                        .map(todo => (
                            <Fragment key={todo.id}>
                                <TodoView store={props.store} todo={todo} />
                            </Fragment>
                        ))}
                    <div className="flex w-full py-1 text-texta bg-white text-xs md:text-sm">
                        <TodoCounterView store={props.store} />
                        <div className="flex w-5/12  md:w-5/12 justify-around box-content">
                            {TITLE_FILTERS.map(item => {
                                return (
                                    <button
                                        key={item.id}
                                        className={`w-12 md:w-24 m-1 rounded border-border hover:border hover:rounded focus:outline-none ${
                                            item.type === props.store.filter && 'border'
                                        }`}
                                        onClick={e => props.store.setFilter(item.type)}
                                    >
                                        {item.title}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className={`w-4/12 hover:underline focus:outline-none ${
                                isClear ? 'opacity-100' : 'opacity-0'
                            }`}
                            onClick={e => props.store.clearCompleted()}
                        >
                            Clear completed
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex w-3/7 md:w-1/7 flex-col z-40  mx-auto h-2 bg-white  border border-gray-200"></div>
            <div className="flex w-4/7 md:w-2/7 flex-col z-30 mx-auto h-2 bg-white border border-gray-200"></div>
        </div>
    );
});
