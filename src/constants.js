export const SHOW_ALL = 'show_all';
export const SHOW_COMPLETED = 'show_completed';
export const SHOW_ACTIVE = 'show_active';

export const TODO_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_ACTIVE]: todo => !todo.isDone,
    [SHOW_COMPLETED]: todo => todo.isDone
};

export const TITLE_FILTERS = [
    { id: 1, type: SHOW_ALL, title: 'All' },
    { id: 2, type: SHOW_ACTIVE, title: 'Active' },
    { id: 3, type: SHOW_COMPLETED, title: 'Completed' }
];
