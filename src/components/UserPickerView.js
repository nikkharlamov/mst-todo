import React from 'react';
import { observer } from 'mobx-react';
import { values } from 'mobx';

export const UserPickerView = observer(props => (
    <select
        className="h-6 w-2/6 bg-gray-200 rounded"
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
