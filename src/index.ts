import {Band, Festival, ParsedBand, RecordLabel} from "./interfaces/festivals.interface.js";
import {EndPoints} from "./constants/EndPoints.js";
import orderBy from "lodash.orderby"
import axios from "axios";

/**
 * Load Festival data from API
 */
export async function fetchData(): Promise<Festival[]> {
    try {
        const response = await axios.get(EndPoints.GET_FESTIVALS);
        return response.data;
    } catch (e: any) {
        throw new Error('API reqest failed');
    }
}

/**
 * Return Uniq bands
 * @param data
 */
const getUniqueBands = (data: Festival[]): Set<string> => {
    const bands = new Set<string>();
    data.forEach(festival => {
        festival.bands.forEach(band => {
            if (band?.recordLabel?.length > 0) {
                bands.add(band.recordLabel);
            }
        });
    });
    return bands;
};
/**
 * parsed Record Label
 * @param data
 * @param recordLabel
 */
const parseRecordLabel: (data: Festival[], recordLabel) => RecordLabel = (data: Festival[], recordLabel): RecordLabel => {
    let bands: ParsedBand[] = [];
    data.forEach((festival: Festival) => {
        festival?.bands.forEach((band: Band) => {
            if (band.recordLabel === recordLabel) {
                const val: ParsedBand = {name: '', festivals: []} as ParsedBand;
                if (band.name !== undefined) {
                    val.name = band?.name;
                }
                if (festival.name !== undefined) {
                    val.festivals.push(festival?.name);
                }

                val.festivals = orderBy(val.festivals, 'name', 'asc')
                bands.push(val);
            }
        })
    })
    bands = orderBy(bands, 'name', 'asc');
    return {recordLabel, bands};
}

/*
 * print Pased Record Label to the console
 */
const printRecordLabel: (labels: RecordLabel[]) => void = (labels: RecordLabel[]): void => {
    labels.forEach((label: RecordLabel) => {
        console.log(`Record Label ${label.recordLabel}`);
        label.bands.forEach((band: ParsedBand) => {
            console.log(`  Brand ${band.name}`);
            if (band.festivals.length > 0) {
                band.festivals.forEach((festival: string) => {
                    console.log(`     ${festival}`);
                })
            }
        })
    })
}


// Gather data from API and store it in the desired format
fetchData()
    .then((data: Festival[]): RecordLabel[] => {
        if (!data) {
            throw Error('No Data Found')
        }
        const recordLabel: RecordLabel[] = [];
        const uniqBands = getUniqueBands(data);
        uniqBands.forEach((val: string) => {
            let label: RecordLabel = parseRecordLabel(data, val);
            recordLabel.push(label);
        });
        return orderBy(recordLabel, 'recordLabel', 'asc');

    })
    .then((labels: RecordLabel[]) => {
        printRecordLabel(labels);
    })
    .catch(error => {
        console.log(error);
    });
