import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

interface CreateSuggestionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (suggestion: { 
    name: string; 
    description: string; 
    suggestedPointsCost: number;
    category: 'LOCAL_PERK' | 'GIFT_CARD' | 'EXPERIENCE' | 'MERCHANDISE';
  }) => Promise<boolean>;
}

export function CreateSuggestionModal({ open, onClose, onSubmit }: CreateSuggestionModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    suggestedPointsCost: 0,
    category: 'LOCAL_PERK' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      enqueueSnackbar('Reward suggestion submitted successfully!', { variant: 'success' });
      setFormData({ name: '', description: '', suggestedPointsCost: 0, category: 'LOCAL_PERK' });
      onClose();
    } else {
      enqueueSnackbar('Failed to submit reward suggestion', { variant: 'error' });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
        Suggest a Reward
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
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            multiline
            rows={4}
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
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
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
              <MenuItem value="LOCAL_PERK">Local Perk</MenuItem>
              <MenuItem value="GIFT_CARD">Gift Card</MenuItem>
              <MenuItem value="EXPERIENCE">Experience</MenuItem>
              <MenuItem value="MERCHANDISE">Merchandise</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="Suggested Points Cost"
            value={formData.suggestedPointsCost}
            onChange={(e) => setFormData({ ...formData, suggestedPointsCost: Number(e.target.value) })}
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
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
          Submit Suggestion
        </Button>
      </DialogActions>
    </Dialog>
  );
}
