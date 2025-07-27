'use client';
import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { useProfile } from '@/hooks/useProfile';
import { RecognitionCard } from '@/components/dashboard/RecognitionCard';
import { RewardCard } from '@/components/rewards/RewardCard';
import { RewardPreference } from '@/lib/types/user';
import { ImageUpload } from '@/components/profile/ImageUpload';

export default function ProfilePage() {
  const {
    profile,
    receivedRecognitions,
    redeemedRewards,
    loading,
    error,
    updatePreferences,
    achievements,
    updateAvatar
  } = useProfile();
  const [tabValue, setTabValue] = useState(0);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<RewardPreference[]>([]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;
  if (!profile) return <Typography>No profile data found</Typography>;

  const handlePreferencesOpen = () => {
    setSelectedPreferences(profile.rewardPreferences);
    setPreferencesOpen(true);
  };

  const handlePreferencesSave = async () => {
    const success = await updatePreferences(selectedPreferences);
    if (success) {
      setPreferencesOpen(false);
    }
  };


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
          My Profile
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
          <Tab label="Profile Information" />
          <Tab label="Preferences" />
          <Tab label="Redeemed Rewards" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box sx={{ 
              position: 'relative', 
              width: 120, 
              height: 120,
              '& .MuiAvatar-root': {
                border: '4px solid rgba(255,255,255,0.2)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }
            }}>
              <Avatar
                src={profile.avatar}
                sx={{ width: '100%', height: '100%' }}
              />
              <Box sx={{ position: 'absolute', bottom: -16, right: -16 }}>
                <ImageUpload
                  currentImage={profile.avatar}
                  onUploadSuccess={updateAvatar}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography sx={{ opacity: 0.8 }}>{profile.department}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip 
                label={`${profile.points} Personal Points`}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Chip 
                label={`${profile.allocationPoints} Points to Give`}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)'
                }}
              />
            </Stack>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              onClick={handlePreferencesOpen}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                }
              }}
            >
              Edit Preferences
            </Button>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement._id}>
              <Card>
                <CardContent>
                  {achievement.icon && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <img src={achievement.icon} alt="" style={{ width: 64, height: 64 }} />
                    </Box>
                  )}
                  <Typography variant="h6" gutterBottom>
                    {achievement.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          {redeemedRewards.map(reward => (
            <Grid item xs={12} sm={6} md={4} key={reward._id}>
              <RewardCard reward={reward} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={preferencesOpen} 
        onClose={() => setPreferencesOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .MuiTypography-root': {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'primary.main'
          }
        }}>
          Reward Preferences
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormGroup>
            {['FOOD', 'TRAVEL', 'ELECTRONICS', 'BOOKS', 'ENTERTAINMENT'].map((pref) => (
              <FormControlLabel
                key={pref}
                control={
                  <Checkbox
                    checked={selectedPreferences.includes(pref as RewardPreference)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPreferences([...selectedPreferences, pref as RewardPreference]);
                      } else {
                        setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
                      }
                    }}
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={pref.charAt(0) + pref.slice(1).toLowerCase()}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '1rem',
                    color: 'text.primary',
                  }
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setPreferencesOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePreferencesSave} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
