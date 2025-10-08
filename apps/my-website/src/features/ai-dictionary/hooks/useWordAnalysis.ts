import { API_PATHS } from "@packages/shared/constants";
import type { WordAnalysisResponse } from "@packages/shared/types";
import { useMutation } from "@tanstack/react-query";

export const useWordAnalysis = () => {
  return useMutation<WordAnalysisResponse, Error, string>({
    mutationFn: async (word: string) => {
      const response = await fetch(API_PATHS.DICTIONARY_DEFINE, {
        body: JSON.stringify({ word }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    },
  });
};
