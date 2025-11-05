import { createCourse } from "@/services";
import { useMutation } from "@tanstack/react-query";

interface CreateCourseMutationProps {
    onSuccess: () => void;
    onError: (error: Error) => void;
}

export const useCreateCourseMutation = ({ onSuccess, onError }: CreateCourseMutationProps) => {
    return useMutation({
        mutationFn: (data: { name: string; color: string }) =>
            createCourse(data),
        onSuccess,
        onError,
    });
};