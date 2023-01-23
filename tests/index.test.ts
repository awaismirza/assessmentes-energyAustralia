import {fetchData} from "../src/index.js";
import {Festival} from "../src/interfaces/festivals.interface.js";

describe('main', () => {
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
            expect(firstFestival).toHaveProperty('bands');

            expect(Array.isArray(firstFestival.bands)).toBe(true);
            expect(firstFestival.bands.length).toBeGreaterThan(0);
            firstFestival.bands.forEach( band => {
                expect(band).toHaveProperty('name');
                expect(band).toHaveProperty('recordLabel');
            });

        })

        it('should throw an error if the API request fails', async () => {
            const mockFetch = jest.fn().mockRejectedValue(new Error('API request failed'));
            global.fetch = mockFetch;
            expect(fetchData()).rejects.toThrow('API request failed');
        });
    });
    // it('should return true', async () => {
    //     expect(await index()).toBe(true);
    // });
});
