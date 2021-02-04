import React, { useState } from 'react';

import { observer } from 'mobx-react';

export const TodoView = observer(props => {
    const [text, setText] = useState(props.todo.name);
    const [isMoveTodo, setIsMoveTodo] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const editTodo = (name, key) => {
        if (name.trim() && key === 'Enter') {
            props.todo.setName(name);
            setIsEdit(false);
        }
    };

    return (
        <div
            className="flex items-center text-texta bg-white h-10 border-b border-gray-300"
            onMouseOver={() => setIsMoveTodo(true)}
            onMouseOut={() => setIsMoveTodo(false)}
        >
            <div className="w-1/12 ml-4">
                <input type="checkbox" checked={props.todo.isDone} onChange={e => props.todo.toggle()} />
            </div>

            {isEdit && (
                <input
                    className={`w-11/12 h-10 focus:outline-none  bg-white ${
                        isEdit && 'border border-gray-300 shadow-inner'
                    }`}
                    type="text"
                    value={text}
                    autoFocus={isEdit}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => editTodo(e.target.value, e.key)}
                />
            )}

            {!isEdit && (
                <>
                    <span
                        className={`w-5/6  transition-all bg-white ${
                            props.todo.isDone && 'line-through text-gray-500'
                        }`}
                        onDoubleClick={() => setIsEdit(true)}
                    >
                        {props.todo.name}
                    </span>
                    <button
                        className={`w-8 text-bd hover:text-red-900 focus:outline-none text-2xl ${
                            isMoveTodo ? 'opacity-100' : 'opacity-0'
                        }`}
                        onClick={e => props.todo.remove()}
                    >
                        &times;
                    </button>{' '}
                </>
            )}
        </div>
    );
});
