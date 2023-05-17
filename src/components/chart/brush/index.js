import React, { PureComponent } from 'react';

import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';

import SVGBrush from './component';

export default class Brush extends PureComponent {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startIndex: PropTypes.number,
    endIndex: PropTypes.number,
    margin: PropTypes.object,
    data: PropTypes.array,
    minimumGap: PropTypes.number,
    maximumGap: PropTypes.number,
    onBrushEnd: PropTypes.func,
  };

  static defaultProps = {
    margin: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    minimumGap: 0,
    maximumGap: 0,
  };

  state = {
    ready: false,
    animate: false,
    brushSelection: null,
  };

  componentDidMount() {
    const { margin, data, startIndex, endIndex } = this.props;
    const { width, height } = this.svg.getBoundingClientRect();
    this.scale = scaleLinear()
      .domain([0, data.length - 1])
      .rangeRound([margin.left, width - margin.right]);

    const start = startIndex || 0;
    const end = endIndex || data.length - 1;

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      ready: true,
      animate: false,
      brushSelection: [
        [this.scale(start), margin.top],
        [this.scale(end), height - margin.bottom],
      ],
    });
  }

  // eslint-disable-next-line camelcase
  componentDidUpdate(prevProps) {
    const { height, width } = this.svg.getBoundingClientRect();
    const { margin, startIndex, endIndex, data } = this.props;
    const { startIndex: prevStartIndex, endIndex: prevEndIndex } = prevProps;

    this.scale = scaleLinear()
      .domain([0, data.length - 1])
      .rangeRound([margin.left, width - margin.right]);

    if (startIndex !== prevStartIndex || endIndex !== prevEndIndex) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        brushSelection: [
          [this.scale(startIndex), margin.top],
          [this.scale(endIndex), height - margin.bottom],
        ],
      });
    }
  }

  _renderBackground() {
    const { margin } = this.props;
    const { width, height } = this.svg.getBoundingClientRect();

    return (
      <React.Fragment>
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.bottom - margin.top}
          fill="#FFF"
          fillOpacity="0"
          pointerEvents="none"
        />
      </React.Fragment>
    );
  }

  _renderBrush() {
    const { width, height } = this.svg.getBoundingClientRect();
    const { margin, maximumGap, minimumGap, onBrushEnd } = this.props;
    const { animate, brushSelection } = this.state;
    const ts = brushSelection;
    const [[x0, y0], [x1, y1]] = ts || [
      [0, 0],
      [0, 0],
    ];

    return (
      <SVGBrush
        animate={animate}
        scale={this.scale}
        minimumGap={minimumGap}
        maximumGap={maximumGap}
        extent={[
          [margin.left, margin.top],
          [width - margin.right, height - margin.bottom],
        ]}
        getEventMouse={(event) => {
          const { clientX, clientY } = event;
          const { left, top } = this.svg.getBoundingClientRect();
          return [clientX - left, clientY - top];
        }}
        brushType="x"
        selection={
          brushSelection && [
            [x0, y0],
            [x1, y1],
          ]
        }
        onBrush={({ selection }) => {
          this.setState({
            animate: false,
            brushSelection: selection,
          });
        }}
        onBrushEnd={({ selection }) => {
          if (!selection) {
            this.setState({
              animate: false,
              brushSelection: null,
            });
            return;
          }

          const [[sx0, sy0], [sx1, sy1]] = selection;
          const [rx0, rx1] = [sx0, sx1].map((d) => Math.round(this.scale.invert(d)));

          this.setState({
            animate: true,
            brushSelection: [
              [sx0, sy0],
              [sx1, sy1],
            ],
          });

          if (onBrushEnd) {
            onBrushEnd({
              startIndex: rx0,
              endIndex: rx1,
            });
          }
        }}
      />
    );
  }

  render() {
    const { width, height } = this.props;
    const { ready } = this.state;

    return (
      <div className="c-brush">
        <svg
          className="brush--svg"
          width={width}
          height={height}
          ref={(input) => {
            this.svg = input;
          }}
        >
          <defs>
            <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                stdDeviation="2"
                in="blur"
                dx="0"
                dy="0"
                floodColor="#1F3646"
                floodOpacity="0.5"
                width="100%"
                height="100%"
                result="dropShadow"
              />
            </filter>
          </defs>

          {ready && this._renderBackground()}
          {ready && this._renderBrush()}
        </svg>
      </div>
    );
  }
}
