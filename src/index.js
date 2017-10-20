import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import mitt from 'mitt';


function makeBusKey(eventName) {
  return 'redioBus' + eventName;
}


function emitter(eventName, emitterProp) {
  return function decorateEmitter(PlainComponent) {
    class Emitter extends Component {
      constructor(p, c) {
        super(p, c);
        this.bus = this.context[makeBusKey(eventName)] || mitt();
        this.emit = payload => this.bus.emit(eventName, payload);
      }

      getChildContext() {
        return { [makeBusKey(eventName)]: this.bus };
      }

      render() {
        const props = Object.assign({}, this.props);
        props[emitterProp] = this.emit;
        return createElement(PlainComponent, propsWithEmit);
      }
    }

    Emitter.contextTypes = {
      [makeBusKey(eventName)]: PropTypes.any,
    };

    return Emitter;
  };
}

function receiver(eventName, handle) {
  return function decorateReceiver(PlainComponent) {
    class Receiver extends Component {
      constructor(p, c) {
        super(p, c);
        this.handle = payload => handle(payload, this.props);
      }

      componentWillMount() {
        const bus = this.context[makeBusKey(eventName)];
        if (!bus) return;
        bus.on(eventName, this.handle);
      }

      componentWillUnmount() {
        const bus = this.context[makeBusKey(eventName)];
        if (!bus) return;
        bus.off(eventName, this.handle);
      }

      render() {
        return createElement(PlainComponent, this.props);
      }
    }

    Receiver.contextTypes = {
      [makeBusKey(eventName)]: PropTypes.any,
    };

    return Receiver;
  };
}


export default { emitter,  receiver };
export { emitter, receiver };
