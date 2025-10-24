
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
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRecognitionTypes } from '@/hooks/useRecognitionTypes';
import type { RecognitionType } from '@/lib/types/admin';

export default function RecognitionTypesPage() {
  const { types, loading, error, createType, updateType } = useRecognitionTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    pointValue: 0,
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createType(formData as Omit<RecognitionType, "_id" | "createdAt">);
    if (success) {
      setIsModalOpen(false);
      setFormData({ name: '', category: '', pointValue: 0, active: true });
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
          Recognition Types
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
          Add Recognition Type
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
              <TableCell>Category</TableCell>
              <TableCell>Point Value</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type._id} hover>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={type.category.replace('_', ' ').toLowerCase()} 
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>{type.pointValue}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => updateType(type._id, { active: !type.active })}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    {type.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
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
        <form onSubmit={handleSubmit}>
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
            Add Recognition Type
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
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
              <FormControl required fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  sx={{
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <MenuItem value="TEAMWORK">Teamwork</MenuItem>
                  <MenuItem value="INNOVATION">Innovation</MenuItem>
                  <MenuItem value="EXCELLENCE">Excellence</MenuItem>
                  <MenuItem value="CUSTOMER_SERVICE">Customer Service</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                label="Point Value"
                value={formData.pointValue}
                onChange={(e) => setFormData({ ...formData, pointValue: Number(e.target.value) })}
                required
                fullWidth
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
              type="submit" 
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
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
