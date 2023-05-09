import { create } from "react-test-renderer";
import LoginScreen from "../src/screens/LoginScreen";

const tree = create(<LoginScreen navigation={null} />)

describe('snapshot', () => {
    it('matches snapshot', () => {
        expect(tree).toMatchSnapshot()
    })
});