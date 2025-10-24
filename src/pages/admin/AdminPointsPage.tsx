
import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Autocomplete,
  Grid,
  Chip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { usePointsDistribution } from '@/hooks/usePointsDistribution';
import { useSnackbar } from 'notistack';

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  employeeType: string;
}

export default function PointsDistributionPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { 
    distributions, 
    yearlyBudget,
    monthlyAllocations,
    users,
    loading, 
    error, 
    distributePoints,
    setYearlyBudgetAmount,
    setMonthlyAllocationAmount,
    budgetCalculation
  } = usePointsDistribution();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    points: 0,
    reason: ''
  });
  const [localYearlyBudget, setLocalYearlyBudget] = useState(yearlyBudget);
  const [localAllocations, setLocalAllocations] = useState<{ [key: string]: number }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Check if user has already received points this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const hasReceivedThisMonth = distributions.some(dist => {
      const distDate = new Date(dist.distributedAt);
      return dist.userId === selectedUser._id && 
             distDate.getMonth() === currentMonth &&
             distDate.getFullYear() === currentYear;
    });

    if (hasReceivedThisMonth) {
      enqueueSnackbar('This user has already received points this month', { variant: 'error' });
      return;
    }

    // Get monthly allocation for user's employee type
    const userAllocation = monthlyAllocations.find(
      alloc => alloc.employeeType === selectedUser.employeeType
    );

    if (!userAllocation) {
      enqueueSnackbar('No monthly allocation set for this employee type', { variant: 'error' });
      return;
    }

    if (formData.points > userAllocation.amount) {
      enqueueSnackbar(`Cannot exceed monthly allocation of ${userAllocation.amount} points`, { variant: 'error' });
      return;
    }

    const success = await distributePoints({
      userId: selectedUser._id,
      points: formData.points,
      reason: formData.reason
    });

    if (success) {
      enqueueSnackbar('Points distributed successfully', { variant: 'success' });
      setIsModalOpen(false);
      setSelectedUser(null);
      setFormData({ points: 0, reason: '' });
    } else {
      enqueueSnackbar('Failed to distribute points', { variant: 'error' });
    }
  };

  const handleBudgetUpdate = async (amount: number) => {
    const success = await setYearlyBudgetAmount(amount);
    if (success) {
      enqueueSnackbar('Yearly budget updated successfully', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to update yearly budget', { variant: 'error' });
    }
  };

  const handleAllocationUpdate = async (employeeType: string, amount: number) => {
    const success = await setMonthlyAllocationAmount(employeeType, amount);
    if (success) {
      enqueueSnackbar('Monthly allocation updated successfully', { variant: 'success' });
    } else {
      enqueueSnackbar('Failed to update monthly allocation', { variant: 'error' });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error.message}</Typography>;

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
          Points Distribution
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
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
          Distribute Points
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
              <TableCell>User</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distributions.map((dist) => (
              <TableRow key={dist._id} hover>
                <TableCell>{dist.user.name}</TableCell>
                <TableCell>{dist.user.department}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${dist.points} Points`}
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: (theme) => `${theme.palette.success.main}08`,
                      color: 'success.main',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>{dist.reason}</TableCell>
                <TableCell>{new Date(dist.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
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
          Distribute Points
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select User"
                  required
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              )}
            />
            <TextField
              label="Points"
              type="number"
              required
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
            <TextField
              label="Reason"
              multiline
              rows={3}
              required
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setIsModalOpen(false)}
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
            Distribute
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
