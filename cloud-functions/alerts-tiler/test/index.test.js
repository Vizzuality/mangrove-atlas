/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use strict';

describe('functions_fetchAlertsTiler_http', () => {
  // [START functions_http_unit_test]

  const sinon = require('sinon');
  const assert = require('assert');
  const VectorTile = require('@mapbox/vector-tile').VectorTile;
  const fetchAlertsTiler = require('../index').fetchAlertsTiler;

  const getMocks = () => {
    const req = { body: {}, query: {} };

    return {
      req: req,
      res: {
        send: sinon.stub().returnsThis(),
      },
    };
  };

  it('fetchAlertsTiler: should print a vtile', () => {
    const mocks = getMocks();
    mocks.req.query = {
      x: '2121',
      y: '1996',
      z: '12',
      start_date: '2020-01-01',
      end_date: '2023-01-02',
    };

    fetchAlertsTiler(mocks.req, mocks.res);
    assert.strictEqual(mocks.res.status.calledOnceWith(200), true);

    const tileResult = new VectorTile(mocks.res.send.getCall(0).args[0]);

    console.log(mocks.res.send.getCall(0).args[0]);
    // assert.strictEqual(mocks.res.send.calledOnceWith('Hello World!'), true);
  });
});
