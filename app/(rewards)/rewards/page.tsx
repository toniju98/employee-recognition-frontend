'use client';
import { useState } from 'react';
import { Container, Typography, Grid, Tabs, Tab, Button, Box } from '@mui/material';
import { RewardCard } from '@/components/rewards/RewardCard';
import { useRewards } from '@/hooks/useRewards';
import { useRewardSuggestions } from '@/hooks/useRewardSuggestions';
import { SuggestionCard } from '@/components/rewards/SuggestionCard';
import { CreateSuggestionModal } from '@/components/rewards/CreateSuggestionModal';

export default function RewardsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rewards, loading: rewardsLoading, error: rewardsError } = useRewards();
  const {
    suggestions,
    loading: suggestionsLoading, 
    createSuggestion,
    toggleVote,
    reviewSuggestion
  } = useRewardSuggestions();

  const loading = rewardsLoading || suggestionsLoading;
  const error = rewardsError;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
        p: 3,
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Rewards Center
        </Typography>
      </Box>

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 4,
        '& .MuiTabs-root': {
          minHeight: 48,
        },
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
          fontSize: '1rem',
        }
      }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Available Rewards" />
          <Tab label="Suggestions" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {rewards.map((reward) => (
            <Grid item key={reward._id} xs={12} sm={6} md={4}>
              <RewardCard reward={reward} />
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4 
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Reward Suggestions
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }
              }}
            >
              Suggest Reward
            </Button>
          </Box>
          <Grid container spacing={3}>
            {suggestions.map((suggestion) => (
              <Grid item key={suggestion._id} xs={12} sm={6} md={4}>
                <SuggestionCard
                  suggestion={suggestion}
                  onVote={() => toggleVote(suggestion._id)}
                  reviewSuggestion={reviewSuggestion}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <CreateSuggestionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createSuggestion}
      />
    </Container>
  );
}
