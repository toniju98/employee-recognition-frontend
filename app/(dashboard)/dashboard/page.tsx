'use client';
import { useState } from 'react';
import { Container, Typography, Card, CardContent, Skeleton, Button, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { RecognitionCard } from '@/components/dashboard/RecognitionCard';
import { CreateRecognitionModal } from '@/components/recognition/CreateRecognitionModal';
import { useRecognitions } from '@/hooks/useRecognitions';

export default function DashboardPage() {
  const { recognitions, loading, error, refreshRecognitions } = useRecognitions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {[1, 2, 3].map((n) => (
          <Card key={n} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error">
          Error loading recognitions: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
        p: 3,
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Recognition Feed
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
            }
          }}
        >
          Create Recognition
        </Button>
      </Box>

      {recognitions.map((recognition) => (
        <RecognitionCard key={recognition._id} recognition={recognition} />
      ))}

      <CreateRecognitionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshRecognitions}
      />
    </Container>
  );
}
