import React from 'react';
import { observer } from 'mobx-react';

export const TodoCounterView = observer(props => (
    <div className="flex ml-2 w-3/12 md:w-3/12 items-center">
        <span className="text-center">{props.store.pendingCount} item left</span>
    </div>
));
