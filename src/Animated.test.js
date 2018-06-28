import Animated, { Easing } from './Animated';
import AnimatedAlways from './core/AnimatedAlways';
import ReanimatedModule from './ReanimatedModule';
const { getNumberOfNodes } = ReanimatedModule;

jest.mock('./ReanimatedEventEmitter');
jest.mock('./ReanimatedModule');

const { Value, timing, spring, decay } = Animated;
expect.extend({
  toAttachNodesProperly(animation) {
    const transX = new Value(0);

    const v = new AnimatedAlways(transX);
    const initial = getNumberOfNodes();
    v.__addChild(v);
    const before = getNumberOfNodes();
    const anim = animation.node(transX, animation.config);
    anim.start();
    const during = getNumberOfNodes();
    anim.stop();
    const after = getNumberOfNodes();
    v.__removeChild(v);
    const final = getNumberOfNodes();

    const pass =
      initial === final &&
      after === before &&
      during > after &&
      initial === 0 &&
      before === 2;
    if (pass) {
      return {
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${
            animation.name
          }'s nodes not to be attached and detached correctly`,
        pass: false,
      };
    }
  },
});
it('fails if timing does not attach nodes correctly', () => {
  expect({
    node: timing,
    name: 'timing',
    config: {
      duration: 5000,
      toValue: 120,
      easing: Easing.inOut(Easing.ease),
    },
  }).toAttachNodesProperly();
});

it('fails if decay does not attach nodes correctly', () => {
  expect({
    node: decay,
    name: 'decay',
    config: {
      deceleration: 0.997,
    },
  }).toAttachNodesProperly();
});

it('fails if spring does not attach nodes correctly', () => {
  expect({
    node: spring,
    name: 'spring',
    config: {
      toValue: 0,
      damping: 7,
      mass: 1,
      stiffness: 121.6,
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
    },
  }).toAttachNodesProperly();
});

it('fails if clock while animation does not behave correctly', () => {
  expect({
    node: spring,
    name: 'spring',
    config: {
      toValue: 0,
      damping: 7,
      mass: 1,
      stiffness: 121.6,
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
    },
  }).toAttachNodesProperly();
});
