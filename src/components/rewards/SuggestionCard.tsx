import { Card, CardContent, Typography, Button, Box, Chip, IconButton, Avatar } from '@mui/material';
import { ThumbUp, Check, Close } from '@mui/icons-material';
import { useAuth } from '@/components/auth/AuthProvider';
import { memo, useCallback, useMemo } from 'react';

//TODO: maybe suggestion should be deleted after some time automatically or there needs to be an option to delete it

interface SuggestionCardProps {
  suggestion: {
    _id: string;
    name: string;
    description: string;
    suggestedBy: {
      _id: string;
      name: string;
      avatar?: string;
    };
    votes: string[];
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    suggestedPointsCost: number;
    category: "LOCAL_PERK" | "GIFT_CARD" | "EXPERIENCE" | "MERCHANDISE";
  };
  onVote: () => void;
  reviewSuggestion?: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

const SuggestionCard = memo(function SuggestionCard({ suggestion, onVote, reviewSuggestion }: SuggestionCardProps) {
  const { userInfo } = useAuth();
  
  const hasVoted = useMemo(() => 
    suggestion.votes.includes(userInfo?._id || ''), 
    [suggestion.votes, userInfo?._id]
  );
  
  const isAdmin = useMemo(() => 
    userInfo?.role === 'ADMIN', 
    [userInfo?.role]
  );

  const handleVote = useCallback(() => {
    onVote();
  }, [onVote]);

  const handleApprove = useCallback(() => {
    reviewSuggestion?.(suggestion._id, 'APPROVED');
  }, [reviewSuggestion, suggestion._id]);

  const handleReject = useCallback(() => {
    reviewSuggestion?.(suggestion._id, 'REJECTED');
  }, [reviewSuggestion, suggestion._id]);


  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {suggestion.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {suggestion.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={suggestion.suggestedBy.avatar}
            alt={suggestion.suggestedBy.name}
            sx={{ width: 24, height: 24, mr: 1 }}
          >
            {suggestion.suggestedBy.name}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Suggested by {suggestion.suggestedBy.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handleVote}
              color={hasVoted ? 'primary' : 'default'}
              sx={{ 
                p: 1,
                backgroundColor: hasVoted ? (theme) => `${theme.palette.primary.main}08` : 'transparent'
              }}
            >
              <ThumbUp fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {suggestion.votes.length} votes
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAdmin && suggestion.status === "PENDING" && (
              <>
                <IconButton
                  onClick={handleApprove}
                  color="success"
                  sx={{ p: 1 }}
                >
                  <Check fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleReject}
                  color="error"
                  sx={{ p: 1 }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </>
            )}
            <Chip
              label={suggestion.status}
              color={
                suggestion.status === "APPROVED"
                  ? "success"
                  : suggestion.status === "REJECTED"
                  ? "error"
                  : "default"
              }
              sx={{ 
                borderRadius: 2,
                fontWeight: 500,
                px: 1
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export { SuggestionCard };
