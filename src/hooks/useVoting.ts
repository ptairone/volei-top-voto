import { useState, useEffect } from 'react';
import { generateFingerprint } from '@/utils/fingerprint';

export type VoteCategory = 'melhor-saque' | 'mais-reclamao' | 'mais-gente-boa';

interface Vote {
  category: VoteCategory;
  candidate: string;
  timestamp: number;
  fingerprint: string;
}

interface VoteResults {
  [category: string]: {
    [candidate: string]: number;
  };
}

const STORAGE_KEY = 'turma-volei-votes';
const FINGERPRINT_KEY = 'turma-volei-fingerprint';

export const useVoting = () => {
  const [votedCategories, setVotedCategories] = useState<Set<VoteCategory>>(new Set());
  const [fingerprint, setFingerprint] = useState<string>('');
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const initFingerprint = async () => {
      let storedFingerprint = localStorage.getItem(FINGERPRINT_KEY);
      
      if (!storedFingerprint) {
        storedFingerprint = await generateFingerprint();
        localStorage.setItem(FINGERPRINT_KEY, storedFingerprint);
      }
      
      setFingerprint(storedFingerprint);
      
      // Check which categories this fingerprint has voted in
      const storedVotes = localStorage.getItem(STORAGE_KEY);
      if (storedVotes) {
        const parsedVotes: Vote[] = JSON.parse(storedVotes);
        setVotes(parsedVotes);
        
        const userVotedCategories = new Set(
          parsedVotes
            .filter(v => v.fingerprint === storedFingerprint)
            .map(v => v.category)
        );
        setVotedCategories(userVotedCategories);
      }
    };
    
    initFingerprint();
  }, []);

  const submitVote = (category: VoteCategory, candidate: string) => {
    if (votedCategories.has(category)) {
      return false;
    }

    const newVote: Vote = {
      category,
      candidate,
      timestamp: Date.now(),
      fingerprint,
    };

    const updatedVotes = [...votes, newVote];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVotes));
    setVotes(updatedVotes);
    setVotedCategories(new Set([...votedCategories, category]));
    
    return true;
  };
  
  const hasVotedInCategory = (category: VoteCategory) => {
    return votedCategories.has(category);
  };

  const getResults = (): VoteResults => {
    const results: VoteResults = {};
    
    votes.forEach(vote => {
      if (!results[vote.category]) {
        results[vote.category] = {};
      }
      
      if (!results[vote.category][vote.candidate]) {
        results[vote.category][vote.candidate] = 0;
      }
      
      results[vote.category][vote.candidate]++;
    });
    
    return results;
  };

  return {
    hasVotedInCategory,
    submitVote,
    getResults,
    totalVotes: votes.length,
    votedCategories,
  };
};
