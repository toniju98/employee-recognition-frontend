import { Reward } from "@/lib/types/reward";
import { Card, CardContent, CardMedia, Typography, Chip, Button, Box } from "@mui/material";
import { useRewardRedemption } from "@/hooks/useRewardRedemption";

interface RewardCardProps {
  reward: Reward;
}

export function RewardCard({ reward }: RewardCardProps) {
  const { redeemReward } = useRewardRedemption();

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
      },
      '& .MuiCardMedia-root': {
        height: 200,
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }
    }}>
      {reward.image && (
        <CardMedia
          component="img"
          image={`http://localhost:5000/uploads/rewards/${reward.image}`}
          alt={reward.name}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 1
          }}
        >
          {reward.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 3,
            lineHeight: 1.6
          }}
        >
          {reward.description}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          mt: 'auto' 
        }}>
          <Chip
            label={`${reward.pointsCost} points`}
            color="primary"
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              fontWeight: 500,
              backgroundColor: (theme) => `${theme.palette.primary.main}08`,
              borderColor: (theme) => `${theme.palette.primary.main}30`,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
          <Button
            variant="contained"
            disabled={!reward.isActive}
            onClick={() => redeemReward(reward._id)}
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
            Redeem
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
