export interface FeatureCollection {
    type: string;
    features: {
        type: string;
        properties: {
            name: string;
        };
        geometry: {
            type: string;
            coordinates: number[];
        };
    }[];
}
