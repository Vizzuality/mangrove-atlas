// Utils
import { format } from 'd3-format';
// import { replace } from 'layer-manager';

// Components
import WidgetTooltip from 'components/widget/tooltip';

export const CONFIG = {
  parse: ({ rows }) => {
    if (!rows.length) {
      return {
        chart: [],
        template: ''
      };
    }

    const fakeData = [
      {
        label: '1996',
        gain: 122,
        median: 40,
        loss: -120
      },
      {
        label: '2002',
        gain: 155,
        median: 30,
        loss: -40
      },
      {
        label: '2009',
        gain: 194,
        median: 72,
        loss: -182
      },
      {
        label: '2016',
        gain: 135,
        median: 110,
        loss: -194
      }
    ];

    return {
      chart: fakeData.map(l => (
        {
          x: l.label,
          median: l.median,
          gain: l.gain,
          loss: l.loss,
          color: l.color,
          name: l.label
        }
      )),
      chartConfig: {
        layout: 'vertical',
        referenceLines: [
          { x: 0, label: null, stroke: 'rgba(0,0,0,0.5)' }
        ],
        margin: { top: 20, right: 0, left: 0, bottom: 20 },
        yKeys: {
          bars: {
            gain: {
              barSize: 10,
              transform: `translate(0, ${(4 + 10) / 2})`,
              fill: '#077FAC',
              radius: [0, 10, 10, 0],
            },
            loss: {
              barSize: 10,
              transform: `translate(0, -${(4 + 10) / 2})`,
              fill: '#EB6240',
              radius: [0, 10, 10, 0],
            }
          }
        },
        xAxis: {
          type: 'number',
          tick: false,
        },
        cartesianGrid: {
          vertical: true,
          horizontal: false,
          verticalPoints: [0, 100, 200, 300, 400, 500],
          strokeDasharray: '5 20'
        }
      }
    };
  }
};


export default CONFIG;
