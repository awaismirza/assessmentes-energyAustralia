import {Festival, RecordLabel} from "../src/interfaces/festivals.interface";
import {fetchData, parseRecordLabel, printRecordLabel, uniqueBands} from "../src";

describe('index.ts', () => {
    describe('fetchData', () => {
        it('should fetch data from the API', async () => {
            const data = await fetchData();
            expect(data).toBeDefined();
        });

        it('should return an array', async () => {
            const data: Festival[] = await fetchData();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);
        });

        it('should return valid data according to FestivalsListInterface', async () => {
            const data: Festival[] = await fetchData();
            expect(data).toBeDefined();
            const firstFestival: Festival = data[0];
            expect(Array.isArray(firstFestival.bands)).toBe(true);
            expect(firstFestival?.bands?.length).toBeGreaterThan(0);
        })

        it('should throw an error if the API request fails', async () => {
            const mockFetch = jest.fn().mockRejectedValue(new Error('API request failed - Please rerun npm run start in terminal'));
            global.fetch = mockFetch;
            expect(fetchData()).rejects.toThrow('API request failed - Please rerun npm run start in terminal');
        });
    });
    describe('getUniqueBands', () => {
        it('should return a set of unique record labels', () => {
            const data: Festival[] = [
                {
                    name: 'Festival 1',
                    bands: [
                        {name: 'Band 1', recordLabel: 'Label 1'},
                        {name: 'Band 2', recordLabel: 'Label 2'},
                    ],
                },
                {
                    name: 'Festival 2',
                    bands: [
                        {name: 'Band 3', recordLabel: 'Label 1'},
                        {name: 'Band 4', recordLabel: 'Label 3'},
                    ],
                },
            ];
            const expected = new Set(['Label 1', 'Label 2', 'Label 3']);
            const actual = uniqueBands(data);
            expect(actual).toEqual(expected);
        });

        it('should return an empty set if bands are not provided', () => {
            const data: Festival[] = [
                {
                    name: 'Festival 1',
                    bands: undefined,
                },
            ];
            expect(uniqueBands(data)).toEqual(new Set());
        });
    });

    describe('parseRecordLabel', () => {
        const data: Festival[] = [
            {
                name: 'Festival 1',
                bands: [
                    {name: 'Band 1', recordLabel: 'Label 1'},
                    {name: 'Band 2', recordLabel: 'Label 2'},
                    {name: 'Band 3', recordLabel: 'Label 1'},
                    {name: 'Band 4', recordLabel: 'Label 3'},
                ],
            },
            {
                name: 'Festival 2',
                bands: [
                    {name: 'Band 3', recordLabel: 'Label 1'},
                    {name: 'Band 4', recordLabel: 'Label 3'},
                ],
            },
        ];
        it('should return a record label object with bands, recordLabel', () => {
            const expected = {
                bands: [
                    {
                        festivals: [
                            "Festival 1"
                        ],
                        name: "Band 1"
                    },
                    {
                        festivals: [
                            "Festival 1"
                        ],
                        name: "Band 3"
                    },
                    {
                        festivals: [
                            "Festival 2"
                        ],
                        name: "Band 3"
                    }
                ],
                recordLabel: "Label 1"
            }
            expect(parseRecordLabel(data, 'Label 1')).toEqual(expected);
        });

        it('should return empty bands if recordLabel not found', () => {
            expect(parseRecordLabel(data, 'Label Not Found')).toEqual({recordLabel: 'Label Not Found', bands: []});
        });
    });
    describe('printRecordLabel', () => {
        const labels: RecordLabel[] = [
            {
                recordLabel: 'Label 1',
                bands: [
                    { name: 'Band 1', festivals: ['Festival 1'] },
                    { name: 'Band 3', festivals: ['Festival 1', 'Festival 2'] },
                ],
            },
            {
                recordLabel: 'Label 2',
                bands: [
                    { name: 'Band 2', festivals: ['Festival 1'] },
                    { name: 'Band 4', festivals: ['Festival 2'] },
                ],
            },
        ];
        it('should print the record labels and bands with festivals', () => {
            const log = jest.spyOn(console, 'log').mockImplementation();
            printRecordLabel(labels);
            expect(log).toHaveBeenCalledWith('Record Label Label 1');
            expect(log).toHaveBeenCalledWith('  Brand Band 1');
            expect(log).toHaveBeenCalledWith('     Festival 1');
            expect(log).toHaveBeenCalledWith('  Brand Band 3');
            expect(log).toHaveBeenCalledWith('     Festival 1');
            expect(log).toHaveBeenCalledWith('     Festival 2');
            expect(log).toHaveBeenCalledWith('Record Label Label 2');
            expect(log).toHaveBeenCalledWith('  Brand Band 2');
            expect(log).toHaveBeenCalledWith('     Festival 1');
            expect(log).toHaveBeenCalledWith('  Brand Band 4');
            expect(log).toHaveBeenCalledWith('     Festival 2');
        });
    });
});
