import { apiClient } from "@/lib/api";
import { CreateTimerSessionData } from "@/mutations";
import { TimerSession } from "@/types";

const endpoint = {
    timerSession: '/timer-session',
};

export const createTimerSession = async (data: CreateTimerSessionData): Promise<TimerSession> => {
    try {
        const response = await apiClient.post(endpoint.timerSession, data);
        return response.data;
    } catch (err) {
        console.log('Error creating timer session: ', err);
        throw err;
    }
}