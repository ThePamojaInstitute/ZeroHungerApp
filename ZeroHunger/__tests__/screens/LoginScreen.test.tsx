import LoginScreen from "../../src/screens/LoginScreen";
import { render, screen } from '@testing-library/react-native';
import React from "react";


test('matches snapshot', () => {
    const rendered = render(<LoginScreen navigation={null} />).toJSON();

    expect(rendered).toMatchSnapshot();
});