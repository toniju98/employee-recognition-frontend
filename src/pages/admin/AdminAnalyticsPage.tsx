"use client";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useAnalytics } from "@/hooks/useAnalytics";
import { TimeFrame } from "@/lib/types/analytics";

interface Performer {
  userId: string;
  name: string;
  department: string;
  points: number;
  recognitionsReceived: number;
}

interface DepartmentStat {
  department: string;
  averagePoints: number;
  totalRecognitions: number;
  activeUsers: number;
}

export default function AnalyticsPage() {
  const {
    engagementMetrics,
    performanceInsights,
    loading,
    error,
    timeframe,
    setTimeframe,
  } = useAnalytics();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ 
        p: 3, 
        mb: 4,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                '.MuiSelect-icon': { color: 'white' },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                }
              }}
            >
              <MenuItem value="WEEK">Last Week</MenuItem>
              <MenuItem value="MONTH">Last Month</MenuItem>
              <MenuItem value="YEAR">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Engagement Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Engagement Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Recognitions</Typography>
                <Typography variant="h4">
                  {engagementMetrics?.totalRecognitions}
                </Typography>
              </Grid>
           {/*  <Grid item xs={6}>
                <Typography variant="subtitle2">Active Users</Typography>
                <Typography variant="h4">
                  {engagementMetrics?.activeUsers}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">
                  Recognitions per User
                </Typography>
                <Typography variant="h4">
                  {engagementMetrics?.recognitionsPerUser.toFixed(1)}
                </Typography>
              </Grid> */} 
            </Grid>
          </Paper>
        </Grid>

        {/* Department Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Department Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Average Points</TableCell>
                    <TableCell align="right">Total Recognitions</TableCell>
                    <TableCell align="right">Active Users</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {performanceInsights?.departmentStats.map((dept: DepartmentStat) => (
                    <TableRow key={dept.department}>
                      <TableCell>{dept.department}</TableCell>
                      <TableCell align="right">{dept.averagePoints}</TableCell>
                      <TableCell align="right">
                        {dept.totalRecognitions}
                      </TableCell>
                      <TableCell align="right">{dept.activeUsers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Performance Table */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Performance Insights
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Points</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Recognitions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                 {/* {performanceInsights?.topPerformers.map((performer: Performer) => (
                    <TableRow key={performer.userId}>
                      <TableCell>{performer.name}</TableCell>
                      <TableCell>{performer.department}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${performer.points} points`}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '12px' }}
                        />
                      </TableCell>
                      <TableCell>{performer.recognitionsReceived}</TableCell>
                    </TableRow>
                  ))}*/}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
