import React from 'react';
import { Wrapper } from './styled';

export interface Props {}

interface State {}

class ComponentName extends React.PureComponent<Props, State> {
    static defaultProps = {};

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentReceiveProps() {

    }

    shouldComponentUpdate() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <Wrapper>
                <h1>ComponentName</h1>
            </Wrapper>
        );
    }
}

export default ComponentName;
