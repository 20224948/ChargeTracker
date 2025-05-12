// Route handler for dynamic station detail pages (e.g. /location/[id])
import { useLocalSearchParams } from "expo-router";
import ChargingLocation from "../location/chargingLocation";

export default function LocationScreen() {
  // Extract the dynamic station ID from the URL
  const { id: locationId } = useLocalSearchParams();

  // Pass-through component to display the charging station details
  return <ChargingLocation />;
}