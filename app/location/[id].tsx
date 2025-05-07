import { useLocalSearchParams } from "expo-router";
import ChargingLocation from "../location/chargingLocation";

export default function LocationScreen() {
    const { id: locationId } = useLocalSearchParams();
    return <ChargingLocation />;
}