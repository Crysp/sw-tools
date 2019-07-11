import React from 'react';
import { shallow } from 'enzyme';
import ComponentName from '../index';

describe('Поведение <ComponentName>', () => {
    it('Нормально', () => {
        const component = shallow<ComponentName>(<ComponentName />);

        expect(component).toBeDefined();
    });
});
