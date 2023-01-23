export interface Band {
    name?: string;
    recordLabel?: string;
}

export interface Festival {
    name?: string;
    bands?: Band[];
}

export interface ParsedBand {
 name: string;
 festivals: string[]
}

export interface RecordLabel {
    recordLabel: string;
    bands: ParsedBand[];
}
