import { barangayOfficialsService } from "@/services/officials/barangayOfficials.service";
import type { Resident } from "@/services/residents/residents.types"
import { useState } from "react"

export const useIsAlreadyRegisteredAsOfficial = () => {
    const [isChecking, setIsChecking] = useState(false);
    

    const isAlreadyRegisteredAsOfficial = async (residentId: string) => {
        setIsChecking(true);
        try {
            // toString() muna para di magloko 😭
            const result = await barangayOfficialsService.isAlreadyOfficial(residentId);
            return result;
        } catch (error) {
            console.error('Failed to check if resident is already a registered official', error);
            return -1;
        } finally {
            setIsChecking(false);
        }
    }

    return {
        isAlreadyRegisteredAsOfficial,
        isChecking,
    };
};