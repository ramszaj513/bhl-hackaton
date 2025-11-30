import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

export interface LocationPickerProps {
    onLocationSelect?: (value: any) => void;
    className?: string;
}

export const LocationPicker = ({ onLocationSelect, className }: LocationPickerProps) => (
    <div className={className}>
        <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_KEY || process.env.GEOAPIFY_KEY}>
            <GeoapifyGeocoderAutocomplete
                placeholder="Enter address here"
                placeSelect={onLocationSelect}
            />
        </GeoapifyContext>
    </div>
);