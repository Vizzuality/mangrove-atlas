import { takeLatest } from 'redux-saga/effects';

function* someAction() {
  console.log('Hola mundo!');//eslint-disable-line
  yield;
}

export default function* app() {
  yield takeLatest('APP/setSearchActive', someAction);
}
