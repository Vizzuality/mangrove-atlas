import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transifex from 'modules/transifex/translate';

/**
 * Use this component in order to translate a string manually.
 * https://docs.transifex.com/live/api#translatetext
 */

class Translate extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props);
    this.ttRef = React.createRef();
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && window.Transifex) {
      Transifex.live.onReady(() => this.translateString());
    }
  }

  translateString = () => {
    const node = this.ttRef.current;
    node.innerHTML = Transifex.live.translateText(node.innerHTML);
  }

  render() {
    const { children } = this.props;
    return <span ref={this.ttRef}>{children}</span>;
  }
}

export default Translate;
