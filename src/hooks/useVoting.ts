import { useState, useEffect } from 'react';
import { generateFingerprint } from '@/utils/fingerprint';
import { generateVoteCode } from '@/utils/whatsappConfirmation';

export type VoteCategory = 'melhor-saque' | 'mais-reclamao' | 'mais-gente-boa';
export type VoteStatus = 'pending' | 'confirmed' | 'rejected';

interface Vote {
  voteCode: string;
  category: VoteCategory;
  candidate: string;
  timestamp: number;
  fingerprint: string;
  status: VoteStatus;
}

interface VoteResults {
  [category: string]: {
    [candidate: string]: number;
  };
}

const STORAGE_KEY = 'turma-volei-votes';
const FINGERPRINT_KEY = 'turma-volei-fingerprint';
const RESULTS_RELEASED_KEY = 'turma-volei-results-released';

export const useVoting = () => {
  const [votedCategories, setVotedCategories] = useState<Set<VoteCategory>>(new Set());
  const [fingerprint, setFingerprint] = useState<string>('');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [resultsReleased, setResultsReleased] = useState<boolean>(() => {
    const stored = localStorage.getItem(RESULTS_RELEASED_KEY);
    return stored === 'true';
  });

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

  const submitVote = (category: VoteCategory, candidate: string): string | null => {
    if (votedCategories.has(category)) {
      return null;
    }

    const voteCode = generateVoteCode();
    const newVote: Vote = {
      voteCode,
      category,
      candidate,
      timestamp: Date.now(),
      fingerprint,
      status: 'pending',
    };

    const updatedVotes = [...votes, newVote];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVotes));
    setVotes(updatedVotes);
    setVotedCategories(new Set([...votedCategories, category]));
    
    return voteCode;
  };
  
  const hasVotedInCategory = (category: VoteCategory) => {
    return votedCategories.has(category);
  };

  const getResults = (): VoteResults => {
    const results: VoteResults = {};
    
    votes.forEach(vote => {
      // Only count confirmed votes
      if (vote.status !== 'confirmed') return;
      
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

  const getVotesByStatus = (status?: VoteStatus) => {
    if (!status) return votes;
    return votes.filter(v => v.status === status);
  };

  const confirmVote = (voteCode: string) => {
    const updatedVotes = votes.map(v =>
      v.voteCode === voteCode ? { ...v, status: 'confirmed' as VoteStatus } : v
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVotes));
    setVotes(updatedVotes);
  };

  const rejectVote = (voteCode: string) => {
    const updatedVotes = votes.map(v =>
      v.voteCode === voteCode ? { ...v, status: 'rejected' as VoteStatus } : v
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVotes));
    setVotes(updatedVotes);
  };

  const toggleResultsRelease = () => {
    const newState = !resultsReleased;
    setResultsReleased(newState);
    localStorage.setItem(RESULTS_RELEASED_KEY, String(newState));
  };

  return {
    hasVotedInCategory,
    submitVote,
    getResults,
    getVotesByStatus,
    confirmVote,
    rejectVote,
    totalVotes: votes.length,
    totalConfirmedVotes: votes.filter(v => v.status === 'confirmed').length,
    totalPendingVotes: votes.filter(v => v.status === 'pending').length,
    totalRejectedVotes: votes.filter(v => v.status === 'rejected').length,
    votedCategories,
    resultsReleased,
    toggleResultsRelease,
  };
};
