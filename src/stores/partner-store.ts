import { create } from 'zustand';
import type { Partner, PartnerTreeNode, Commission, CommissionRule } from '@/types/domain';

interface PartnerStats {
  totalDownline: number;
  totalCommissions: number;
  pendingCommissions: number;
  availableCommissions: number;
  paidCommissions: number;
  monthlyVolume: number;
  customerCount: number;
}

interface PartnerState {
  // State
  partner: Partner | null;
  stats: PartnerStats | null;
  downlineTree: PartnerTreeNode[];
  commissions: Commission[];
  commissionRules: CommissionRule[];
  isLoading: boolean;

  // Actions
  setPartner: (partner: Partner) => void;
  setStats: (stats: PartnerStats) => void;
  setDownlineTree: (tree: PartnerTreeNode[]) => void;
  setCommissions: (commissions: Commission[]) => void;
  setCommissionRules: (rules: CommissionRule[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const defaultStats: PartnerStats = {
  totalDownline: 0,
  totalCommissions: 0,
  pendingCommissions: 0,
  availableCommissions: 0,
  paidCommissions: 0,
  monthlyVolume: 0,
  customerCount: 0,
};

export const usePartnerStore = create<PartnerState>()((set) => ({
  partner: null,
  stats: null,
  downlineTree: [],
  commissions: [],
  commissionRules: [],
  isLoading: false,

  setPartner: (partner) => set({ partner }),
  setStats: (stats) => set({ stats }),
  setDownlineTree: (tree) => set({ downlineTree: tree }),
  setCommissions: (commissions) => set({ commissions }),
  setCommissionRules: (rules) => set({ commissionRules: rules }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({
    partner: null,
    stats: null,
    downlineTree: [],
    commissions: [],
    commissionRules: [],
    isLoading: false,
  }),
}));
