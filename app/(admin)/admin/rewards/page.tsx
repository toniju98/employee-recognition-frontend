'use client';
import { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Switch, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Box, Tabs, Tab, Grid, Card, CardContent,
  CardActions, CardMedia, Chip
} from '@mui/material';
import { Add, AddCircle, PhotoCamera } from '@mui/icons-material';
import { useOrganizationRewards } from '@/hooks/useOrganizationRewards';
import type { Reward } from '@/lib/types/reward';
import { useSnackbar } from 'notistack';
import { useRewardSuggestions } from '@/hooks/useRewardSuggestions';

type CreateRewardPayload = {
  name: string;
  description: string;
  pointsCost: number;
  category: 'LOCAL_PERK' | 'GIFT_CARD' | 'EXPERIENCE' | 'MERCHANDISE';
  quantity: number;
  createdBy: string;
  image?: File;
};

export default function AdminRewardsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { 
    orgRewards, 
    globalRewards, 
    loading, 
    error, 
    addToOrganization, 
    createCustomReward, 
    updateReward 
  } = useOrganizationRewards();
  const { suggestions, reviewSuggestion } = useRewardSuggestions();
  
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateRewardPayload>({
    name: '',
    description: '',
    pointsCost: 0,
    category: 'LOCAL_PERK',
    quantity: 1,
    // TODO: fix
    createdBy: '6746e228c095aaa67ccae553'
  });

  const handleAddToOrg = async (rewardId: string) => {
    const success = await addToOrganization(rewardId);
    if (success) {
      enqueueSnackbar('Reward added to organization successfully!', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to add reward to organization', { variant: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createCustomReward(formData);
    if (success) {
      setIsModalOpen(false);
      setFormData({ name: '', description: '', pointsCost: 0, category: 'LOCAL_PERK', quantity: 1, createdBy: '6746e228c095aaa67ccae553' });
      enqueueSnackbar('Reward created successfully!', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to create reward', { variant: 'error' });
    }

  };

  const handleReviewSuggestion = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const success = await reviewSuggestion(id, status);
    if (success) {
      enqueueSnackbar(`Suggestion ${status.toLowerCase()} successfully`, { variant: 'success' });
    } else {
      enqueueSnackbar(`Failed to ${status.toLowerCase()} suggestion`, { variant: 'error' });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error.message}</Typography>;

  // TODO: check if it makes sense to have the suggestions here for admin
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
          Rewards Management
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
          <Tab label="Organization Rewards" />
          <Tab label="Global Catalog" />
          <Tab label="Suggestions" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Organization Rewards
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
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
              Add Custom Reward
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            '& .MuiTableCell-root': {
              borderColor: 'divider',
            }
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: 'primary.light',
                  '& .MuiTableCell-root': {
                    color: 'white',
                    fontWeight: 600,
                  }
                }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Points Cost</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orgRewards.map((reward) => (
                  <TableRow key={reward._id} hover>
                    <TableCell>{reward.name}</TableCell>
                    <TableCell>{reward.description}</TableCell>
                    <TableCell>{reward.pointsCost}</TableCell>
                    <TableCell>
                      <Chip 
                        label={reward.category.replace('_', ' ').toLowerCase()} 
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                          color: 'primary.main',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={reward.isActive} 
                        onChange={() => updateReward(reward._id, { isActive: !reward.isActive })}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabValue === 1 && (
        <>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
            Global Rewards Catalog
          </Typography>
          <Grid container spacing={3}>
            {globalRewards.map((reward) => (
              <Grid item xs={12} sm={6} md={4} key={reward._id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  }
                }}>
                  {reward.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={reward.image}
                      alt={reward.name}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                      {reward.name}
                    </Typography>
                    <Chip 
                      label={reward.category.replace('_', ' ').toLowerCase()}
                      size="small"
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                        color: 'primary.main',
                        fontWeight: 500
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {reward.description}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {reward.pointsCost} Points
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      startIcon={<AddCircle />}
                      onClick={() => handleAddToOrg(reward._id)}
                      fullWidth
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      Add to Organization
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Custom Reward</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <input
                accept="image/*"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, image: file });
                  }
                }}
                style={{ display: 'none' }}
                id="reward-image"
              />
              <label htmlFor="reward-image">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <TextField
                type="number"
                label="Points Cost"
                value={formData.pointsCost}
                onChange={(e) => setFormData({ ...formData, pointsCost: Number(e.target.value) })}
                required
              />
              <TextField
                type="number"
                label="Quantity Available"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
              />
              <FormControl required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CreateRewardPayload['category'] })}
                >
                  <MenuItem value="LOCAL_PERK">Local Perk</MenuItem>
                  <MenuItem value="GIFT_CARD">Gift Card</MenuItem>
                  <MenuItem value="EXPERIENCE">Experience</MenuItem>
                  <MenuItem value="MERCHANDISE">Merchandise</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
