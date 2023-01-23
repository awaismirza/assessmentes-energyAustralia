import {Band, Festival, ParsedBand, RecordLabel} from "./interfaces/festivals.interface.js";
import {EndPoints} from "./constants/EndPoints.js";
import axios from "axios";

let mockData: Festival[] = [
    {
        "name": "LOL-palooza",
        "bands": [
            {
                "name": "Winter Primates",
                "recordLabel": ""
            },
            {
                "name": "Frank Jupiter",
                "recordLabel": "Pacific Records"
            },
            {
                "name": "Jill Black",
                "recordLabel": "Fourth Woman Records"
            },
            {
                "name": "Werewolf Weekday",
                "recordLabel": "XS Recordings"
            }
        ]
    },
    {
        "name": "Small Night In",
        "bands": [
            {
                "name": "Squint-281",
                "recordLabel": "Outerscope"
            },
            {
                "name": "The Black Dashes",
                "recordLabel": "Fourth Woman Records"
            },
            {
                "name": "Green Mild Cold Capsicum",
                "recordLabel": "Marner Sis. Recording"
            },
            {
                "name": "Yanke East",
                "recordLabel": "MEDIOCRE Music"
            },
            {
                "name": "Wild Antelope",
                "recordLabel": "Marner Sis. Recording"
            }
        ]
    },
    {
        "name": "Trainerella",
        "bands": [
            {
                "name": "Wild Antelope",
                "recordLabel": "Still Bottom Records"
            },
            {
                "name": "Manish Ditch",
                "recordLabel": "ACR"
            },
            {
                "name": "Adrian Venti",
                "recordLabel": "Monocracy Records"
            },
            {
                "name": "YOUKRANE",
                "recordLabel": "Anti Records"
            }
        ]
    },
    {
        "name": "Twisted Tour",
        "bands": [
            {
                "name": "Squint-281"
            },
            {
                "name": "Summon",
                "recordLabel": "Outerscope"
            },
            {
                "name": "Auditones",
                "recordLabel": "Marner Sis. Recording"
            }
        ]
    },
    {
        "bands": [
            {
                "name": "Critter Girls",
                "recordLabel": "ACR"
            },
            {
                "name": "Propeller",
                "recordLabel": "Pacific Records"
            }
        ]
    }
];

export async function fetchData(): Promise<Festival[]> {
    try {
        const response = await axios.get(EndPoints.GET_FESTIVALS);
        return response.data;
    } catch (e: any) {
        throw new Error('API reqest failed');
    }
}

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

const parseRecordLabel: (data: Festival[], recordLabel) => RecordLabel = (data: Festival[], recordLabel): RecordLabel => {
    const bands: ParsedBand[] = [];
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
                bands.push(val);
            }
        })
    })
    return {recordLabel, bands};
}

const printRecordLabel: (labels: RecordLabel[]) => void = (labels: RecordLabel[]): void => {
    labels.forEach((label: RecordLabel) => {
        console.log(label.recordLabel);
        label.bands.forEach((band: ParsedBand) => {
            console.log(`  ${band.name}`);
            if (band.festivals.length > 0) {
                band.festivals.forEach((festival: string) => {
                    console.log(`    ${festival}`);
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
        return recordLabel;

    })
    .then((labels: RecordLabel[]) => {
        printRecordLabel(labels);
    })
    .catch(error => {
        console.log(error);
    });
