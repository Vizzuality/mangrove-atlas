import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withProvider } from 'utils/storybookProvider';
import LegendComponent from 'components/widget-legend/component';
import ConservationHotspots from 'widget-components/conservation-hotspots/component';
import MangroveActivity from 'widget-components/mangrove-activity/component';
import MangroveCoverage from 'widget-components/mangrove-coverage/component';
import MangroveNetChange from 'widget-components/mangrove-net-change/component';

import Widget from './component';

import TEMPLATES from 'components/widgets';
import CONSERVATION_HOTSPOTS_CONFIG from 'widget-components/conservation-hotspots/config';

// ** Widget Data ** //
//  <-- Legend  --> //
const groupsVertical = JSON.parse('{"Mangroves in 1996":[{"type":"rect","value":"Mangroves in 1996","color":"#00857F","payload":{"percent":0.2175502366896479,"name":"Mangroves in 1996","tooltipPayload":[{"name":"Mangroves in 1996","value":21.75502366896479,"payload":{"payload":{"x":1996,"y":100,"color":"#00857F","percentage":21.75502366896479,"unit":"%","value":"65167.28","label":"Mangroves in 1996"},"stroke":"#00857F","fill":"#00857F","x":1996,"y":100,"color":"#00857F","percentage":21.75502366896479,"unit":"%","value":"65167.28","label":"Mangroves in 1996"},"dataKey":"percentage"}],"midAngle":39.15904260413662,"middleRadius":80.5,"tooltipPosition":{"x":322.41938535661285,"y":84.16624810519424},"payload":{"payload":{"x":1996,"y":100,"color":"#00857F","percentage":21.75502366896479,"unit":"%","value":"65167.28","label":"Mangroves in 1996"},"stroke":"#00857F","fill":"#00857F","x":1996,"y":100,"color":"#00857F","percentage":21.75502366896479,"unit":"%","value":"65167.28","label":"Mangroves in 1996"},"stroke":"#00857F","fill":"#00857F","x":1996,"y":100,"color":"#00857F","percentage":21.75502366896479,"unit":"%","value":21.75502366896479,"label":"Mangroves in 1996","cx":260,"cy":135,"innerRadius":69,"outerRadius":92,"maxRadius":284.29737951659,"startAngle":0,"endAngle":78.31808520827325,"paddingAngle":0}}],"Non mangroves":[{"type":"rect","value":"Non mangroves","color":"#ECECEF","payload":{"percent":0.782449763310352,"name":"Non mangroves","tooltipPayload":[{"name":"Non mangroves","value":78.2449763310352,"payload":{"payload":{"x":0,"y":234383.21,"color":"#ECECEF","percentage":78.2449763310352,"unit":"%","value":234383.21,"label":"Non mangroves"},"stroke":"#ECECEF","fill":"#ECECEF","x":0,"y":234383.21,"color":"#ECECEF","percentage":78.2449763310352,"unit":"%","value":234383.21,"label":"Non mangroves"},"dataKey":"percentage"}],"midAngle":219.15904260413663,"middleRadius":80.5,"tooltipPosition":{"x":197.58061464338718,"y":185.83375189480574},"payload":{"payload":{"x":0,"y":234383.21,"color":"#ECECEF","percentage":78.2449763310352,"unit":"%","value":234383.21,"label":"Non mangroves"},"stroke":"#ECECEF","fill":"#ECECEF","x":0,"y":234383.21,"color":"#ECECEF","percentage":78.2449763310352,"unit":"%","value":234383.21,"label":"Non mangroves"},"stroke":"#ECECEF","fill":"#ECECEF","x":0,"y":234383.21,"color":"#ECECEF","percentage":78.2449763310352,"unit":"%","value":78.2449763310352,"label":"Non mangroves","cx":260,"cy":135,"innerRadius":69,"outerRadius":92,"maxRadius":284.29737951659,"startAngle":78.31808520827325,"endAngle":360,"paddingAngle":0}}]}');
const groupsHorizontal = JSON.parse('{"groups":[{"inactive":false,"dataKey":"Gain","type":"rect","color":"#EB6240","value":"Gain","payload":{"dataKey":"Gain","dot":false,"barSize":10,"transform":"translate(7, 0)","fill":"#EB6240","radius":[10,10,0,0],"children":[false,null],"xAxisId":0,"yAxisId":0,"legendType":"rect","minPointSize":0,"hide":false,"data":[],"layout":"vertical","isAnimationActive":true,"animationBegin":0,"animationDuration":400,"animationEasing":"ease"}},{"inactive":false,"dataKey":"Loss","type":"rect","color":"#A6CB10","value":"Loss","payload":{"dataKey":"Loss","dot":false,"barSize":10,"transform":"translate(-7, 0)","fill":"#A6CB10","radius":[10,10,0,0],"children":[false,null],"xAxisId":0,"yAxisId":0,"legendType":"rect","minPointSize":0,"hide":false,"data":[],"layout":"vertical","isAnimationActive":true,"animationBegin":0,"animationDuration":400,"animationEasing":"ease"}},{"inactive":false,"dataKey":"Net change","type":"line","color":"rgba(0,0,0,0.7)","value":"Net change","payload":{"dataKey":"Net change","dot":false,"strokeWidth":2,"stroke":"rgba(0,0,0,0.7)","xAxisId":0,"yAxisId":0,"connectNulls":false,"activeDot":true,"legendType":"line","fill":"#fff","points":[],"isAnimationActive":true,"animateNewValues":true,"animationBegin":0,"animationDuration":1500,"animationEasing":"ease","hide":false}}]}');
//  <-- Conservation Hotspots  --> //
const widgetData = JSON.parse('{"widgetData":[{"length_mangrove_m":{"1996":"65167.28","2007":"64694.98","2008":"64148.45","2009":"63901.10","2010":"64280.28","2015":"65776.31","2016":"65467.70"},"VERIF":"State Verified","SUB_LOC":"Not Reported","REP_M_AREA":0,"MARINE":"1","NO_TAKE":"Not Reported","iso":"TZA","STATUS_YR":2004,"DESIG_TYPE":"International","ORIG_NAME":"Rufiji-Mafia-Kilwa","INT_CRIT":"(i) (ii) (iii) (iv) (v) (vi) (vii) (viii)","METADATAID":845,"WDPA_PID":"902412","hmax_mangrove_m":{"2000":"19.92"},"GOV_TYPE":"Not Reported","length_coast_m":"299550.49","NAME":"Rufiji-Mafia-Kilwa","name":"Rufiji","GIS_M_AREA":3775.294242,"ISO3":"TZA","IUCN_CAT":"Not Reported","DESIG_ENG":"Ramsar Site, Wetland of International Importance","dashboardId":"","REP_AREA":5969.08,"DESIG":"Ramsar Site, Wetland of International Importance","PARENT_ISO":"TZA","STATUS":"Designated","OWN_TYPE":"Not Reported","PA_DEF":"1","NO_TK_AREA":0,"area_mangrove_m2":{"1996":"507526714.59","2007":"499472322.07","2008":"500133963.16","2009":"499028037.34","2010":"497595539.59","2015":"499397495.31","2016":"498772150.91"},"WDPAID":902412,"MANG_AUTH":"Not Reported","agb_mangrove_mgha-1":{"2000":"260.21"},"type":"aoi","GIS_AREA":5191.75974325,"MANG_PLAN":"Not Reported","mangrove_loss_m2":{"1996":0,"2007":"14044759.27","2008":"4469148.10","2009":"4309604.71","2010":"5751923.47","2015":"11323918.22","2016":"11044400.42"},"mangrove_gain_m2":{"1996":0,"2007":"5985084.87","2008":"5131843.71","2009":"3208664.06","2010":"4316179.84","2015":"13130376.17","2016":"10411299.78"},"hba_mangrove_m":{"2000":"12.62"},"id":"094e62605d725612c642cb1eb5451ded","geometry":{"coordinates":[[[39.17952,-8.161711],[39.263721,-8.41979],[39.256091,-8.549413],[39.34855,-8.598605],[39.432168,-8.647169],[39.551064,-8.628228],[39.59689,-8.603857],[39.60645,-8.55453],[39.607168,-8.366648],[39.635759,-8.257043],[39.669107,-8.160679],[39.791728,-8.046451],[39.826288,-7.975042],[39.856899,-7.899189],[39.870768,-7.860634],[39.881495,-7.834108],[39.895364,-7.804351],[39.901513,-7.778184],[39.924134,-7.642008],[39.92162,-7.603229],[39.883021,-7.603318],[39.831719,-7.653588],[39.783514,-7.699952],[39.745005,-7.648695],[39.693119,-7.578229],[39.643613,-7.577466],[39.61583,-7.749189],[39.539933,-7.784467],[39.475211,-7.777241],[39.305014,-7.65067],[39.275121,-7.650715],[39.188811,-7.861891],[39.288227,-7.94874],[39.329924,-7.947573],[39.329161,-8.034871],[39.22741,-8.124862],[39.17952,-8.161711]],[[39.677365,-7.970509],[39.72382,-7.961083],[39.734906,-7.96032],[39.735669,-7.952196],[39.714439,-7.948022],[39.7218,-7.923516],[39.728712,-7.906685],[39.743299,-7.900356],[39.763272,-7.886981],[39.772877,-7.876882],[39.782886,-7.882492],[39.787823,-7.869431],[39.803173,-7.866738],[39.819062,-7.898471],[39.842042,-7.854575],[39.83154,-7.8355],[39.853084,-7.825311],[39.890741,-7.724324],[39.900211,-7.646317],[39.897069,-7.628812],[39.87961,-7.659692],[39.861701,-7.67181],[39.843299,-7.713238],[39.85636,-7.720194],[39.833829,-7.779081],[39.790651,-7.792771],[39.783155,-7.79129],[39.733335,-7.808749],[39.733155,-7.841559],[39.709592,-7.855832],[39.684906,-7.866604],[39.643164,-7.907762],[39.635714,-7.922843],[39.61978,-7.924144],[39.607258,-7.940392],[39.614798,-7.951209],[39.607168,-7.961263],[39.621845,-7.974907],[39.677365,-7.970509]]],"type":"Polygon"}},{"length_mangrove_m":{"1996":"74792.05","2007":"71837.04","2008":"73079.09","2009":"72635.92","2010":"71238.50","2015":"70392.02","2016":"69175.04"},"PERIM":2.3524444444441,"iso":"SEN","MINX":-16.842888888889,"WIDTH":0.489555555555068,"MINY":13.4842222222227,"HEIGHT":0.686666666666978,"hmax_mangrove_m":{"2000":"5.96"},"length_coast_m":"383940.15","name":"Saloum","AREA":0.336161481481299,"CNTX":-16.5981111111115,"dashboardId":"","CNTY":13.8275555555562,"MAXX":-16.353333333334,"MAXY":14.1708888888897,"area_mangrove_m2":{"1996":"577750530.17","2007":"578957477.00","2008":"581012703.92","2009":"581427181.67","2010":"580371693.31","2015":"572327107.06","2016":"558928782.03"},"agb_mangrove_mgha-1":{"2000":"28.10"},"type":"aoi","mangrove_loss_m2":{"1996":0,"2007":"25952999.02","2008":"13130497.62","2009":"4984807.31","2010":"19011474.51","2015":"17385326.64","2016":"25668937.56"},"mangrove_gain_m2":{"1996":0,"2007":"28375901.87","2008":"15187528.68","2009":"5398480.40","2010":"14170865.76","2015":"11838965.71","2016":"12270815.35"},"hba_mangrove_m":{"2000":"3.78"},"id":"4d4f31ae3061763b34c9c10da11082b0","geometry":{"coordinates":[[[-16.842902,13.484241],[-16.598109,13.484241],[-16.353316,13.484241],[-16.353316,14.170911],[-16.598109,14.170911],[-16.842902,14.170911],[-16.842902,13.484241]]],"type":"Polygon"}}]}');
const location = JSON.parse('{"length_mangrove_m":{"1996":"65167.28","2007":"64694.98","2008":"64148.45","2009":"63901.10","2010":"64280.28","2015":"65776.31","2016":"65467.70"},"VERIF":"State Verified","SUB_LOC":"Not Reported","REP_M_AREA":0,"MARINE":"1","NO_TAKE":"Not Reported","iso":"TZA","STATUS_YR":2004,"DESIG_TYPE":"International","ORIG_NAME":"Rufiji-Mafia-Kilwa","INT_CRIT":"(i) (ii) (iii) (iv) (v) (vi) (vii) (viii)","METADATAID":845,"WDPA_PID":"902412","hmax_mangrove_m":{"2000":"19.92"},"GOV_TYPE":"Not Reported","length_coast_m":"299550.49","NAME":"Rufiji-Mafia-Kilwa","name":"Rufiji","GIS_M_AREA":3775.294242,"ISO3":"TZA","IUCN_CAT":"Not Reported","DESIG_ENG":"Ramsar Site, Wetland of International Importance","dashboardId":"4357e92064c36bda3310b8160eee630a","REP_AREA":5969.08,"DESIG":"Ramsar Site, Wetland of International Importance","PARENT_ISO":"TZA","STATUS":"Designated","OWN_TYPE":"Not Reported","PA_DEF":"1","NO_TK_AREA":0,"area_mangrove_m2":{"1996":"507526714.59","2007":"499472322.07","2008":"500133963.16","2009":"499028037.34","2010":"497595539.59","2015":"499397495.31","2016":"498772150.91"},"WDPAID":902412,"MANG_AUTH":"Not Reported","agb_mangrove_mgha-1":{"2000":"260.21"},"type":"aoi","GIS_AREA":5191.75974325,"MANG_PLAN":"Not Reported","mangrove_loss_m2":{"1996":0,"2007":"14044759.27","2008":"4469148.10","2009":"4309604.71","2010":"5751923.47","2015":"11323918.22","2016":"11044400.42"},"mangrove_gain_m2":{"1996":0,"2007":"5985084.87","2008":"5131843.71","2009":"3208664.06","2010":"4316179.84","2015":"13130376.17","2016":"10411299.78"},"hba_mangrove_m":{"2000":"12.62"},"id":"094e62605d725612c642cb1eb5451ded","geometry":{"coordinates":[[[39.17952,-8.161711],[39.263721,-8.41979],[39.256091,-8.549413],[39.34855,-8.598605],[39.432168,-8.647169],[39.551064,-8.628228],[39.59689,-8.603857],[39.60645,-8.55453],[39.607168,-8.366648],[39.635759,-8.257043],[39.669107,-8.160679],[39.791728,-8.046451],[39.826288,-7.975042],[39.856899,-7.899189],[39.870768,-7.860634],[39.881495,-7.834108],[39.895364,-7.804351],[39.901513,-7.778184],[39.924134,-7.642008],[39.92162,-7.603229],[39.883021,-7.603318],[39.831719,-7.653588],[39.783514,-7.699952],[39.745005,-7.648695],[39.693119,-7.578229],[39.643613,-7.577466],[39.61583,-7.749189],[39.539933,-7.784467],[39.475211,-7.777241],[39.305014,-7.65067],[39.275121,-7.650715],[39.188811,-7.861891],[39.288227,-7.94874],[39.329924,-7.947573],[39.329161,-8.034871],[39.22741,-8.124862],[39.17952,-8.161711]],[[39.677365,-7.970509],[39.72382,-7.961083],[39.734906,-7.96032],[39.735669,-7.952196],[39.714439,-7.948022],[39.7218,-7.923516],[39.728712,-7.906685],[39.743299,-7.900356],[39.763272,-7.886981],[39.772877,-7.876882],[39.782886,-7.882492],[39.787823,-7.869431],[39.803173,-7.866738],[39.819062,-7.898471],[39.842042,-7.854575],[39.83154,-7.8355],[39.853084,-7.825311],[39.890741,-7.724324],[39.900211,-7.646317],[39.897069,-7.628812],[39.87961,-7.659692],[39.861701,-7.67181],[39.843299,-7.713238],[39.85636,-7.720194],[39.833829,-7.779081],[39.790651,-7.792771],[39.783155,-7.79129],[39.733335,-7.808749],[39.733155,-7.841559],[39.709592,-7.855832],[39.684906,-7.866604],[39.643164,-7.907762],[39.635714,-7.922843],[39.61978,-7.924144],[39.607258,-7.940392],[39.614798,-7.951209],[39.607168,-7.961263],[39.621845,-7.974907],[39.677365,-7.970509]]],"type":"Polygon"}}');
//  <-- Mangrove Activity/Coverge/Net  --> //
const chart = '';
const chartConfig = '';
const widgetConfig = {
  chart,
  chartConfig
};

storiesOf('Widget components/Legend', module)
  .add('Vertical legend', () => (
    <LegendComponent
      groups={groupsVertical}
    />
  ))
  .add('Horizontal legend', () => (
    <LegendComponent
      groups={groupsHorizontal}
    />
  ));

storiesOf('Widget components/Templates', module)
  .addDecorator(withProvider)
  .add('Conservation hotspots', () => (
    <ConservationHotspots
      conservationHotspots={widgetData}
      currentLocation={location}
    />
  ))
  .add('Mangrove activity', () => (
    <MangroveActivity
      chart={chart}
      charConfig={chartConfig}
    />
  ))
  .add('Mangrove coverage', () => (
    <MangroveCoverage charConfig={chartConfig} />
  ))
  .add('Mangrove net change', () => (
    <MangroveNetChange charConfig={chartConfig} />
  ));

storiesOf('Widget', module)
  .addDecorator(withProvider)
  .add('Active', () => (
    <Widget
      id={'b106888c6fba8011d889ceb85a09a64d '}
      name={'Conservation hotspots'}
      slug={'highlighted-areas'}
      widgetConfig={CONSERVATION_HOTSPOTS_CONFIG}
      layerId={'96a44216d358984de1428ff77ead270b'}
      layersIds={["96a44216d358984de1428ff77ead270b", "f4fe8d1517f4c66a497beccc3407715b"]}
      isActive
    >
      {({ slug, data, ...props }) => (
        <Fragment>
          {/* Template */}
          {!!TEMPLATES['highlighted-areas'] && React.createElement(TEMPLATES['highlighted-areas'], {
            slug,
            data: widgetData,
            currentLocation: location,
            ...props
          })}
        </Fragment>
      )}

    </Widget>
  ));
  // .add('No Active', () => (
  //   <Widget
  //     id={'b106888c6fba8011d889ceb85a09a64d '}
  //     name={'Mangrove net chage'}
  //     slug={'Mangrove net chage'}
  //     layerId={'96a44216d358984de1428ff77ead270b'}
  //     layersIds={["96a44216d358984de1428ff77ead270b", "f4fe8d1517f4c66a497beccc3407715b"]}
  //   />
  // ))
  // .add('Collapsed', () => (
  //   <Widget
  //     id={'b106888c6fba8011d889ceb85a09a64d '}
  //     name={'Mangrove net chage'}
  //     slug={'Mangrove net chage'}
  //     layerId={'96a44216d358984de1428ff77ead270b'}
  //     layersIds={["96a44216d358984de1428ff77ead270b", "f4fe8d1517f4c66a497beccc3407715b"]}
  //     isCollapsed
  //     children
  //   />
  // ))
  // .add('Colapsed', () => (
  //   <Widgets />
  // ));
