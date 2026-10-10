export interface DashboardSafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
  background: 'black' | 'transparent';
}

export const DEFAULT_DASHBOARD_SAFE_AREA: DashboardSafeArea = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  background: 'black',
};

export const DASHBOARD_SAFE_AREA_STORE_KEY = 'dashboard.safeArea';
