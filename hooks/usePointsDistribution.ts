import { useState, useEffect, useCallback } from 'react';
import { PointsDistribution } from '@/lib/types/admin';
import axios from '@/lib/utils/axios';

interface MonthlyAllocation {
  employeeType: string;
  amount: number;
  maxPointsPerRecognition?: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  employeeType: string;
  department: string;
}

interface BudgetCalculation {
  totalAllocated: number;
  remaining: number;
  monthlyBreakdown: {
    [key: string]: {
      monthly: number;
      yearly: number;
      percentageOfBudget: number;
    }
  }
}

export function usePointsDistribution() {
  const [distributions, setDistributions] = useState<PointsDistribution[]>([]);
  const [yearlyBudget, setYearlyBudget] = useState<number>(0);
  const [monthlyAllocations, setMonthlyAllocations] = useState<MonthlyAllocation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [budgetCalculation, setBudgetCalculation] = useState<BudgetCalculation>({
    totalAllocated: 0,
    remaining: 0,
    monthlyBreakdown: {}
  });

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    }
  };

  const fetchDistributions = async () => {
    try {
      const [yearlyBudgetRes, distributionsRes] = await Promise.all([
        axios.get('/admin/yearly-budget'),
        axios.get('/admin/points-distribution')
      ]);

      console.log("distributionsRes", distributionsRes.data);
      console.log("yearlyBudgetRes", yearlyBudgetRes.data);

      const allocations = Object.entries(distributionsRes.data.distributions)
        .filter(([_, value]) => value !== null)
        .map(([role, value]) => ({
          employeeType: role,
          amount: (value as { monthlyAllocation: number }).monthlyAllocation
        }));

      console.log("allocations", allocations);
      setMonthlyAllocations(allocations);
      setYearlyBudget(yearlyBudgetRes.data.budget);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch points data'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyAllocation = async (employeeType: string) => {
    try {
      const { data } = await axios.get(`/admin/monthly-allocation/${employeeType}`);
      setMonthlyAllocations(prev => [...prev, { employeeType, amount: data.allocation }]);
    } catch (error) {
      console.error(`Failed to fetch monthly allocation for ${employeeType}:`, error);
    }
  };

  const setYearlyBudgetAmount = async (amount: number) => {
    try {
      await axios.put('/admin/yearly-budget', { budget: amount });
      setYearlyBudget(amount);
      return true;
    } catch (error) {
      console.error('Failed to set yearly budget:', error);
      return false;
    }
  };

  const setMonthlyAllocationAmount = async (employeeType: string, amount: number) => {
    try {
      await axios.put('/admin/monthly-allocation', { employeeType, allocation: amount });
      setMonthlyAllocations(prev => 
        prev.map(alloc => 
          alloc.employeeType === employeeType 
            ? { ...alloc, amount } 
            : alloc
        )
      );
      return true;
    } catch (error) {
      console.error('Failed to set monthly allocation:', error);
      return false;
    }
  };

  const distributePoints = async (distribution: {
    userId: string;
    points: number;
    reason: string;
  }) => {
    try {
      const { data } = await axios.post('/admin/points/distribute', distribution);
      setDistributions([data, ...distributions]);
      return true;
    } catch (error) {
      console.error('Failed to distribute points:', error);
      return false;
    }
  };

  const calculateBudget = useCallback(() => {
    const breakdown: { [key: string]: any } = {};
    let totalAllocated = 0;

    monthlyAllocations.forEach(allocation => {
      const yearlyAmount = allocation.amount * 12;
      totalAllocated += yearlyAmount;
      
      breakdown[allocation.employeeType] = {
        monthly: allocation.amount,
        yearly: yearlyAmount,
        percentageOfBudget: yearlyBudget > 0 ? (yearlyAmount / yearlyBudget) * 100 : 0
      };
    });

    setBudgetCalculation({
      totalAllocated,
      remaining: yearlyBudget - totalAllocated,
      monthlyBreakdown: breakdown
    });
  }, [yearlyBudget, monthlyAllocations]);

  useEffect(() => {
    Promise.all([fetchDistributions(), fetchUsers()]);
  }, []);

  useEffect(() => {
    calculateBudget();
  }, [yearlyBudget, monthlyAllocations, calculateBudget]);

  return {
    distributions,
    yearlyBudget,
    monthlyAllocations,
    users,
    loading,
    error,
    distributePoints,
    refreshDistributions: fetchDistributions,
    fetchMonthlyAllocation,
    setYearlyBudgetAmount,
    setMonthlyAllocationAmount,
    budgetCalculation,
    calculateBudget
  };
}
