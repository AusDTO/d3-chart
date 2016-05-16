import { expect as expect } from 'chai';
import hasNegativeValue from '../../../lib/javascripts/Helpers/hasNegativeValue';

describe('Check if array has value below zero', () => {
    it ('should be false if no value is below zero', () => {
        let series = [
          {'x': '2016-01', 'y': 29.39},
          {'x': '2016-02', 'y': null},
          {'x': '2016-03', 'y': 0}
        ];
        expect(hasNegativeValue([series, series])).to.be.false;
    });

    it ('should be true if no value is below zero', () => {
        let series = [
          {'x': '2016-01', 'y': 29.39},
          {'x': '2016-02', 'y': -1},
          {'x': '2016-03', 'y': 25.09}
        ];
        expect(hasNegativeValue([series, series])).to.be.true;
    });
});