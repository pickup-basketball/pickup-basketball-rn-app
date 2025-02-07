import { useState, useCallback } from "react";
import { MatchParticipation } from "../../types/match";
import { fetchParticipations } from "../../api/match";

export const useParticipations = () => {
  const [participations, setParticipations] = useState<MatchParticipation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParticipations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchParticipations();
      setParticipations(data);
    } catch (error) {
      setError("참여 매치 목록을 불러오는데 실패했습니다.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    participations,
    isLoading,
    error,
    loadParticipations,
  };
};
