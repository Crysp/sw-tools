import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import ComponentName from '../index';

describe('Верстка компонента <ComponentName>', () => {
    it('Дефолтная', () => {
        const tree = renderer.create(<ComponentName />).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
